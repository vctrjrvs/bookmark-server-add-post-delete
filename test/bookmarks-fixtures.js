function bookmarkArray() {
     return [
          {
               id: 1,
               title: 'Google',
               url: 'https://www.google.com',
               description: 'THE search engine',
               rating: '5',
          },
          {
               id: 2,
               title: 'Facebook',
               url: 'https://www.facebook.com',
               description: 'The social network',
               rating: '4',
          },
          {
               id: 3,
               title: 'Reddit',
               url: 'https://www.reddit.com',
               description: 'The stuff that distracts you from everything else network',
               rating: '5',
          }
     ]
}

module.exports = {
     bookmarkArray,
}