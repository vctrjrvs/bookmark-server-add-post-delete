const store = require('../store');
const express = require('express');
const { isWebUri } = require('valid-url');
const logger = require('../logger');
const { v4: uuid } = require('uuid');
const BookmarksService = require('./bookmarks-service')

const bookmarkRouter = express.Router();
const bodyParse = express.json();

const serializeBookmark = bookmark = ({
  id: bookmark.id,
  title: bookmark.title,
  url: bookmark.url,
  description: bookmark.description,
  rating: Number(bookmark.rating),
})

bookmarkRouter
  .route('/bookmarks')
  .get((req, res) => {
    BookmarksService.getAllBookmarks(req.app.get('db'))
    .then(bookmarks => {
      res.json(bookmarks.map(serializeBookmark))
      
    })
    .catch(next)
  })
  .post(bodyParse, (req, res) => {
    const { title, url, desc, rating } = req.body;

    if (!title) {
      logger.error(`Title is required`);
      return res.status(400).send('Invalid data');
    }

    if (!url) {
      logger.error(`URL is required`);
      return res.status(400).send('Invalid data');
    }

    if (!desc) {
      logger.error(`Description is required`);
      return res.status(400).send('Invalid data');
    }

    if (!Number.isInteger(rating) || rating > 5 || rating < 0) {
      logger.error(`Rating must be a number between 1 and 5`);
      return res.status(400).send('Invalid data');
    }

    if (!isWebUri(url)) {
      logger.error(`URL must be a valid URL`);
      return res.status(400).send('Invalid data');
    }

    const bookmark = { id: uuid(), title, url, desc, rating };

    store.bookmarks.push(bookmark);

    logger.info(`Bookmark with id ${bookmark.id} created`);

    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${bookmark.id}`)
      .json(bookmark);
  });

bookmarkRouter
  .route('/bookmarks/:bookmark_id')
  .get((req, res) => {
    const { bookmark_id } = req.params
    BookmarksService.getById(req.app.get('db'), bookmark_id)
      .then(bookmark => {
        if (!bookmark) {
          logger.error(`Bookmark with id ${bookmark_id} not found.`)
          return res.status(404).json({
            error: { message: `Bookmark Not Found` }
          })
        }
        res.json(serializeBookmark(bookmark))
      })
      .catch(next)
  })
  .delete((req, res) => {
    const { bookmark_id } = req.params;

    const bookmarkIndex = store.bookmarks.findIndex(
      bookmark => bookmark.id == bookmark_id
    );

    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${bookmark_id} not found.`);
      return res.status(404).send('Not found');
    }

    store.bookmarks.splice(bookmarkIndex, 1);

    logger.info(`Bookmark with id ${bookmark_id} deleted.`);

    res.status(204).end();
  });

module.exports = bookmarkRouter;