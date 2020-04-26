const express = require('express');
const uuid = require('uuid');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const morgan = require('morgan');
const apiKey = "2abbf7c3-245b-404f-9473-ade729ed4653";

const app = express();
app.use( morgan('dev'));
app.use(middleware);

function middleware (req, res, next){
  let authorization = req.headers.authorization;
  let bookapikey = req.headers['book-api-key'];
  let query = req.query.apiKey;

  if (!authorization && !bookapikey && !query){
    res.statusMessage = "apikey is missing";
    return res.status(401).end();
  }

  if(authorization && authorization !== `Bearer ${apiKey}`){
    res.statusMessage = "The apikey provided is not valid";
    return res.status(401).end();
  }

  if(bookapikey && bookapikey !== apiKey){
    res.statusMessage = "The apikey provided is not valid";
    return res.status(401).end();
  }

  if(query && query !== apiKey){
    res.statusMessage = "The apikey provided is not valid";
    return res.status(401).end();
  }

  next(); 
}

let bookmarksList = [
  {
    id: uuid.v4(),
    title: "Google",
    description: "Google shalala",
    url: "https://www.google.com/",
    rating: 3
  },
  {
    id: uuid.v4(),
    title: "Google",
    description: "Twitter shalala",
    url: "https://www.twitter.com/",
    rating: 5
  }
]

app.get('/bookmarks', (req, res) =>{
  console.log("Getting all bookmarks");
  return res.status(200).json(bookmarksList);
});

app.get('/bookmark', (req, res) => {
  let title = req.query.title;

  console.log("Getting all bookmarks with title =", title);

  if(!title){
    res.statusMessage = "Error - title is missing"
    return res.status(406).end();
  }

  let result = bookmarksList.filter((bookmark) =>{
    return bookmark.title == title;
  });

  if(result.length == 0){
    res.statusMessage = "Title not found"
    return res.status(404).end();
  }

  return res.status(200).json(result);
});


app.post('/bookmarks', jsonParser, (req, res) =>{
  console.log("body", req.body);
  let id = uuid.v4();
  let title = req.body.title;
  let description = req.body.description
  let rating = req.body.rating
  let url = req.body.url

  if(!title || !description|| !rating|| !url){
    res.statusMessage = "One of these params is missing: title, description, rating or url"
    return res.status(406).end();
  }

  if(typeof(title) !== "string"){
    res.statusMessage = "Title must be a string"
    return res.status(409).end();
  }
  if(typeof(description) !== "string"){
    res.statusMessage = "Description must be a string"
    return res.status(409).end();
  }
  if(typeof(url) !== "string"){
    res.statusMessage = "Url must be a string"
    return res.status(409).end();
  }
  if(typeof(rating) !== "number"){
    res.statusMessage = "Rating must be a number"
    return res.status(409).end();
  }

  let newBookmark =  {
    id : id,
    title : title,
    description : description,
    url : url, 
    rating: rating
  }

  bookmarksList.push(newBookmark);

  return res.status(201).json(newBookmark);
});

app.delete('/bookmark/:id',  (req, res) =>{
  let id = req.params.id;

  let bookmarkR = bookmarksList.findIndex((bookmark) =>{
    if(bookmark.id == id){
      return true;
    }
  });

  if(bookmarkR < 0){
    res.statusMessage = "That id was not found in the bookmarks list"
    return res.status(404).end();
  }else{
    bookmarksList.splice(bookmarkR, 1);
    return res.status(200).end(); 
  }
});

app.patch('/bookmark/:id',jsonParser, (req, res) =>{

  let id = req.body.id;
  let idParam = req.params.id;

  if (!id){
    res.statusMessage = "No body was sent";
    return res.status(406).end();
  }


  if(id != idParam){
    res.statusMessage = "Ids do not match";
    return res.status(409).end();
  }


  let bookmarkR = bookmarksList.findIndex((bookmark) =>{
    if(bookmark.id == id){
      return true;
    }
  });

  if(bookmarkR < 0){
    res.statusMessage = "That id was not found in the bookmarks list"
    return res.status(404).end();
  }

  if(req.body.title){
    bookmarksList[bookmarkR].title = req.body.title;
  }

  if(req.body.description){
    bookmarksList[bookmarkR].description = req.body.description;
  }

  if(req.body.url){
    bookmarksList[bookmarkR].url = req.body.url;
  }

  if(req.body.rating){
    bookmarksList[bookmarkR].rating = req.body.rating;
  }

  return res.status(202).json(bookmarksList[bookmarkR]); 

});

app.listen(8080,() => {
    console.log("This server is running in 8080");
}); 