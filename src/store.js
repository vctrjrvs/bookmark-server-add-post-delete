const { v4: uuid } = require('uuid');

const bookmarks = [
  {
    id: uuid(),
    title: 'Google',
    url: 'https://www.google.com',
    description: 'THE search engine',
    rating: '5',
},
{
    id: uuid(),
    title: 'Facebook',
    url: 'https://www.facebook.com',
    description: 'The social network',
    rating: '4',
},
{
    id: uuid(),
    title: 'Reddit',
    url: 'https://www.reddit.com',
    description: 'The stuff that distracts you from everything else network',
    rating: '5',
},
];

module.exports = { bookmarks };