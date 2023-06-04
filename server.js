/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  
Name: Jas Tej Singh
Student ID: 130244213
Date: 04 May 2023
Cyclic Link: https://long-plum-fly-boot.cyclic.app/
*
*
********************************************************************************/ 
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const TripDB = require("./modules/tripDB.js");
const db = new TripDB();

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

// ========== ADD NEW TRIP ===========
app.post("/api/trips", (req, res) => {
    const tripAdded = req.body;
    db.addNewTrip(tripAdded)
    .then((trip) => {
        res.status(201).json(trip);
    })
    .catch((err) => {
        res.status(500).json({ error: err });
    })
})

// ========== RETURN TRIPS ===========
app.get("/api/trips", (req, res) => {
    const { page, perPage} = req.query;
    db.getAllTrips(page, perPage)
    .then((trips) => {
        res.status(201).json(trips);
    })
    .catch((err) => {
        res.status(500).json({ error: err });
    })
})

// ========== RETURN TRIP ===========
app.get("/api/trips/:id", (req, res) => {
    const { id } = req.params;
    db.getTripById(id)
    .then((trip) => {
        res.status(201).json(trip);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
})

// ========== UPDATE TRIP ===========
app.put('/api/trips/:id', (req, res) => {
    const { id } = req.params;
    const updatedTrip = req.body;
    db.updateTripById(updatedTrip, id)
    .then(() => {
        res.status(201).json({ message: `Trip ID: ${id} has been updated successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// ========== DELETE TRIP ==========
app.delete("/api/trips/:id", (req, res) => {
    const id = req.params.id;
    db.deleteTripById(id)
    .then(() => {
        res.status(201).json({ message: `Trip ID: ${id} has been deleted successfully` });
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