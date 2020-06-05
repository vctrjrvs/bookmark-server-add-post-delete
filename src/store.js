const { v4: uuid } = require("uuid");

const bookmarks = [
  {
    id: uuid(),
    title: "Google",
    url: "http://google.com",
    desc: "An indie search engine startup",
    rating: 4,
  },
];

module.exports = { bookmarks };
