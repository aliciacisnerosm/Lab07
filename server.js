const express = require('express');
const uuid = require('uuid');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const morgan = require('morgan');
const { DATABASE_URL, PORT, TOKEN } = require('./config');
const { Bookmarks } = require('./models/bookmarkModel.js');
const mongoose = require('mongoose');
const cors = require('./middleware/cors');
const apiKey = TOKEN;

const app = express();
app.use(cors);
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(middleware);
function middleware(req, res, next) {
  let authorization = req.headers.authorization;
  let bookapikey = req.headers['book-api-key'];
  let query = req.query.apiKey;

  if (!authorization && !bookapikey && !query) {
    res.statusMessage = 'apikey is missing';
    return res.status(401).end();
  }

  if (authorization && authorization !== `Bearer ${apiKey}`) {
    res.statusMessage = 'The apikey provided is not valid';
    return res.status(401).end();
  }

  if (bookapikey && bookapikey !== apiKey) {
    res.statusMessage = 'The apikey provided is not valid';
    return res.status(401).end();
  }

  if (query && query !== apiKey) {
    res.statusMessage = 'The apikey provided is not valid';
    return res.status(401).end();
  }

  next();
}

app.get('/bookmarks', (req, res) => {
  console.log('Getting all bookmarks');
  Bookmarks.getAllBookmarks()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      res.statusMessage =
        'Something is wrong with the Database. Try again later.';
      return res.status(500).end();
    });
});

app.get('/bookmark', (req, res) => {
  let title = req.query.title;

  console.log('Getting all bookmarks with title =', title);

  if (!title) {
    res.statusMessage = 'Error - title is missing';
    return res.status(406).end();
  }

  Bookmarks.getBookmark(title)
    .then((result) => {
      if (result.length == 0) {
        res.statusMessage = 'Title not found';
        return res.status(404).end();
      }
      return res.status(200).json(result);
    })
    .catch((err) => {
      res.statusMessage =
        'Something is wrong with the Database. Try again later.' + err.message;
      return res.status(500).end();
    });
});

app.post('/bookmarks', jsonParser, (req, res) => {
  let id = uuid.v4();
  let title = req.body.title;
  let description = req.body.description;
  let rating = req.body.rating;
  let url = req.body.url;

  if (!title || !description || !rating || !url) {
    res.statusMessage =
      'One of these params is missing: title, description, rating or url';
    return res.status(406).end();
  }

  if (typeof title !== 'string') {
    res.statusMessage = 'Title must be a string';
    return res.status(409).end();
  }
  if (typeof description !== 'string') {
    res.statusMessage = 'Description must be a string';
    return res.status(409).end();
  }
  if (typeof url !== 'string') {
    res.statusMessage = 'Url must be a string';
    return res.status(409).end();
  }
  if (typeof rating !== 'number') {
    res.statusMessage = 'Rating must be a number';
    return res.status(409).end();
  }

  let newBookmark = {
    id: id,
    title: title,
    description: description,
    url: url,
    rating: rating,
  };

  Bookmarks.createBookmark(newBookmark)
    .then((result) => {
      return res.status(201).json(result);
    })
    .catch((err) => {
      res.statusMessage =
        'Something is wrong with the Database - Try again later! ' +
        err.message;
      return res.status(500).end();
    });
});

app.delete('/bookmark/:id', (req, res) => {
  let id = req.params.id;

  Bookmarks.deleteBookmark(id)
    .then((result) => {
      if (result.deletedCount == 0) {
        res.statusMessage = 'The id was not found in the bookmarks list';
        return res.status(404).end();
      } else {
        return res.status(200).end();
      }
    })
    .catch((err) => {
      res.statusMessage = 'Something wrong with the Database';
      return res.status(500).end();
    });
});

app.patch('/bookmark/:id', jsonParser, (req, res) => {
  let id = req.body.id;
  let idParam = req.params.id;

  if (!id) {
    res.statusMessage = 'No body was sent';
    return res.status(406).end();
  }

  if (id != idParam) {
    res.statusMessage = 'Ids do not match';
    return res.status(409).end();
  }
  let params = {};

  if (req.body.title) {
    params['title'] = req.body.title;
  }

  if (req.body.description) {
    params['description'] = req.body.description;
  }

  if (req.body.url) {
    params['url'] = req.body.url;
  }

  if (req.body.rating) {
    params['rating'] = req.body.rating;
  }

  Bookmarks.updateBookmark(id, params)
    .then((result) => {
      if (!result) {
        res.statusMessage = 'That id was not found in the bookmarks list';
        return res.status(404).end();
      }
      return res.status(202).json(result);
    })
    .catch((err) => {
      res.statusMessage = 'Something wrong with the Database';
      return res.status(500).end();
    });
});

app.listen(PORT, () => {
  new Promise((resolve, reject) => {
    const settings = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    };
    mongoose.connect(DATABASE_URL, settings, (err) => {
      if (err) {
        return reject(err);
      } else {
        console.log('Database connected successfully.');
        return resolve();
      }
    });
  }).catch((err) => {
    console.log(err);
  });
});
