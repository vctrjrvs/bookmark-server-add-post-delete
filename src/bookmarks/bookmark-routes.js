const store = require("../store");
const express = require("express");
const { isWebUri } = require("valid-url");
const logger = require("../logger");
const { v4: uuid } = require("uuid");

const bookmarkRouter = express.Router();
const bodyParse = express.json();

// const bookmarks = [
//   {
//     id: "8sdfbvbs65sd",
//     title: "Google",
//     url: "http://google.com",
//     desc: "An indie search engine startup",
//     rating: 4,
//   },
// ];

bookmarkRouter
  .route("/bookmarks")
  .get((req, res) => {
    res.json(store.bookmarks);
  })
  .post(bodyParse, (req, res) => {
    const { title, url, desc, rating } = req.body;

    if (!title) {
      logger.error(`Title is required`);
      return res.status(400).send("Invalid data");
    }

    if (!url) {
      logger.error(`URL is required`);
      return res.status(400).send("Invalid data");
    }

    if (!desc) {
      logger.error(`Description is required`);
      return res.status(400).send("Invalid data");
    }

    if (!Number.isInteger(rating) || rating > 5 || rating < 0) {
      logger.error(`Rating must be a number between 1 and 5`);
      return res.status(400).send("Invalid data");
    }

    if (!isWebUri(url)) {
      logger.error(`URL must be a valid URL`);
      return res.status(400).send("Invalid data");
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
  .route("/bookmarks/:bookmark_id")
  .get((req, res) => {
    const { bookmark_id } = req.params;
    const bookmark = bookmarks.find((bookmark) => bookmark.id == bookmark_id);

    if (!bookmark) {
      logger.error(`Card with id ${id} not found.`);
      return res.status(404).send("Card Not Found");
    }

    res.json(bookmark);
  })
  .delete((req, res) => {
    const { bookmark_id } = req.params;

    const bookmarkIndex = store.bookmarks.findIndex(
      (bookmark) => bookmark.id == bookmark_id
    );

    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${bookmark_id} not found.`);
      return res.status(404).send("Not found");
    }

    store.bookmarks.splice(bookmarkIndex, 1);

    logger.info(`Bookmark with id ${bookmark_id} deleted.`);

    res.status(204).end();
  });

module.exports = bookmarkRouter;
