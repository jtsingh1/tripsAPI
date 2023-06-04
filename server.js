/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  
Name: Aryan Khurana 
Student ID: 145282216 
Date: 13 May 2023
Cyclic Link: https://dull-jade-badger-vest.cyclic.app
*
*
********************************************************************************/ 
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

// Initializing the app
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// It helps to prevent cross-origin restrictions and ensures that the API can be accessed securely from different sources.
app.use(cors());
// Ensure that our server can parse the JSON provided in the request body for some of our routes
app.use(express.json());

// ========== ROUTE FOR HOME PAGE ==========
app.get('/', (req, res) => {
    res.json({ message: 'API Listening' });
});

// ========== ADD NEW MOVIE ===========
app.post("/api/movies", (req, res) => {
    const movieAdded = req.body;
    db.addNewMovie(movieAdded)
    .then((movie) => {
        res.status(201).json(movie);
    })
    .catch((err) => {
        res.status(500).json({ error: err });
    })
})

// ========== RETURN MOVIES ===========
app.get("/api/movies", (req, res) => {
    const { page, perPage, title } = req.query;
    db.getAllMovies(page, perPage, title)
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) => {
        res.status(500).json({ error: err });
    })
})

// ========== RETURN MOVIE ===========
app.get("/api/movies/:id", (req, res) => {
    const { id } = req.params;
    db.getMovieById(id)
    .then((movie) => {
        res.status(201).json(movie);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
})

// ========== UPDATE MOVIE ===========
app.put('/api/movies/:id', (req, res) => {
    const { id } = req.params;
    const updatedMovie = req.body;
    db.updateMovieById(updatedMovie, id)
    .then(() => {
        res.status(201).json({ message: `Movie ID: ${id} has been updated successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// ========== DELETE MOVIE ==========
app.delete("/api/movies/:id", (req, res) => {
    const id = req.params.id;
    db.deleteMovieById(id)
    .then(() => {
        res.status(201).json({ message: `Movie ID: ${id} has been deleted successfully` });
    })
    .catch((err) => {
        res.status(500).json({ error: err });
    });
})

// ========== PAGE NOT FOUND ==========
app.use((req, res) => {
  res.status(404).json({ message: "Resource not found" });
});

// Tell the app to start listening for requests if the connection with database is successful
db.initialize(process.env.MONGODB_CONN_STRING)
.then(()=>{
    app.listen(HTTP_PORT, () => {
        console.log(`server listening on: ${HTTP_PORT}`);
    });
})
.catch((err)=>{
    console.log(err);
});