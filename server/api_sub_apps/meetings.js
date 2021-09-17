const express = require('express');
const meetingsRouter = express.Router({ mergeParams: true });
const db = require('../db.js');




// get all meetings as an array
meetingsRouter.get('/', (req, res, next) => {
    // an array of all the meetings
    const meeting = db.getAllFromDatabase('meetings');
    res.status(200).send(meeting);
});

// create meetings
meetingsRouter.post('/', (req, res, next) => {
    // create a new meetings and save to db
    const meeting = db.createMeeting();
    db.addToDatabase('meetings', meeting);
    res.status(201).send(meeting);
});

// delete a meetings by meetingsId
meetingsRouter.delete('/', (req, res, next) => {
    // delete a meetings by id
    db.deleteAllFromDatabase('meetings');
    res.status(204).send('All meetings Deletion succesful');
});


module.exports = meetingsRouter