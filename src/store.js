const { v4: uuid } = require('uuid');

const bookmarks = [
  {
    id: uuid(),
    title: 'Google',
    url: 'http://google.com',
    desc: 'An indie search engine startup',
    rating: 4
  },
  {
    id: uuid(),
    title: 'Thinkful',
    url: 'http://thinkful.com',
    desc: 'An immersive program',
    rating: 5
  },
];

module.exports = { bookmarks };
