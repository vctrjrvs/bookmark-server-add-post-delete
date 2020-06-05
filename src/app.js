require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const validateBearerToken = require('./validate-bearer-token');
const errorHandler = require('./errorHandler')

const { v4: uuid } = require('uuid');
const { isWebUri } = require('valid-url');

const app = express()

const morganOption = (NODE_ENV === 'production')
     ? 'tiny'
     : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(express.json());

app.use(validateBearerToken)

app.get('/', (req, res) => {
     res.send('Hello, world!')
})  

app.use(errorHandler)

const bookmarks = [{
     "id": "8sdfbvbs65sd",
     "title": "Google",
     "url": "http://google.com",
     "desc": "An indie search engine startup",
     "rating": 4
}]

app.get('/bookmarks', (req, res) => {
     res.json(bookmarks)
})


app.post('/bookmarks', (req,res) => {
     const { title, url, desc, rating } = req.body;
     const { bookmark_id } = req.params;
     
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
     
     const bookmark = { bookmark_id: uuid(), title, url, desc, rating }

     bookmarks.push(bookmark)

     logger.info(`Bookmark with id ${bookmark_id} created`);

     res.status(201).location(`http://localhost:8000/bookmarks/${bookmark_id}`)

})

app.get('/bookmarks/:bookmark_id', (req, res) => {
     const { bookmark_id } = req.params;
     const bookmark = bookmarks.find(id => bookmark.id === bookmark_id);

     if (!bookmark) {
          logger.error(`Bookmark with id ${bookmark_id} not found.`);
          return res.status(404).send('Bookmark not found');
     }
     res.json(bookmark)
})

module.exports = app