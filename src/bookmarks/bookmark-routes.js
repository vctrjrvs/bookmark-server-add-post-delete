const express = require('express');
const { isWebUri } = require('valid-url');
const logger = require('../logger');
const xss = require('xss')
const BookmarksService = require('./bookmarks-service')

const bookmarkRouter = express.Router();
const bodyParse = express.json();

const serializeBookmark = bookmark => ({
  id: bookmark.id,
  title: bookmark.title,
  url: bookmark.url,
  description: bookmark.description,
  rating: Number(bookmark.rating),
})

bookmarkRouter
  .route('/bookmarks')
  .get((req, res, next) => {
    BookmarksService.getAllBookmarks(req.app.get('db'))
      .then(bookmarks => {
        res.json(bookmarks.map(serializeBookmark))

      })
      .catch(next)
  })
  .post(bodyParse, (req, res, next) => {
    for (const field of ['title', 'url', 'rating']) {
      if (!req.body[field]) {
        logger.error(`${field} is required`)
        return res.status(400).send({
          error: { message: `${field} is required` }
        })
      }
    }

    const ratingNumber = Number(rating)

    const { title, url, description, rating } = req.body;

    if (!Number.isInteger(ratingNumber) || ratingNumber > 5 || ratingNumber < 0) {
      logger.error(`Rating must be a number between 1 and 5`);
      return res.status(400).send('Invalid rating');
    }

    if (!isWebUri(url)) {
      logger.error(`URL must be a valid URL`);
      return res.status(400).send('Invalid URL');
    }

    const newBookmark = { title, url, description, rating };

    BookmarksService.insertBookmark(
      req.app.get('db'),
      newBookmark)
      .then(bookmark => {
        logger.info(`Bookmark with id ${bookmark.id} created`)
        res
          .status(201)
          .location(`/bookmarks/${bookmark.id}`)
          .json(serializeBookmark(bookmark))
      })
      .catch(next)
  })


bookmarkRouter
  .route('/bookmarks/:bookmark_id')
  .all((req, res, next) => {
    const { bookmark_id } = req.params
    BookmarksService.getById(req.app.get('db'), bookmark_id)
      .then(bookmark => {
        if (!bookmark) {
          logger.error(`Bookmark with id ${bookmark_id} not found.`)
          return res.status(404).json({
            error: { message: `Bookmark Not Found` }
          })
        }
        res.bookmark = (bookmark)
        next()
      })
      .catch(next)
  })

  .get((req, res) => {
    res.json(serializeBookmark(res.bookmark))
  })
  .delete((req, res, next) => {
    const { bookmark_id } = req.params;
    BookmarksService.deleteBookmark(
      req.app.get('db'),
      bookmark_id)
      .then(numRowsAffected => {
        logger.info(`Bookmark with id ${bookmark_id} deleted.`);
        res.status(204).end()
      })
      .catch(next);
  });

module.exports = bookmarkRouter;