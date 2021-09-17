const { request } = require('express');
const express = require('express');
const minionsRouter = express.Router({mergeParams: true});
const db =  require('../db.js');

// validate salary
const validateSalary = (req, res, next) => {
    try {
        if (!req.body.salary){
            return next(new Error('Include salary'));
        }
        req.body.salary = parseInt(req.body.salary);
        if(req.body.salary < 0){
            return next(new Error('Salary cannot be less than 0'));
        }
        return next();
    }
    catch (err){
        err.message = "Salary is not right";
        next(err);
    }
}

// get minionId parameter
minionsRouter.param('minionId', (req, res, next, id) => {
    let minionId = String(parseInt(id));
    const minion = db.getFromDatabaseById('minions',minionId);
    if (minion){
        req.minionId = minionId;
        req.minion = minion;
        return next();
    } else {
        const err = new Error('Not Found');
        err.status = 404;
        return next(err);
    }
});

// get all minions as an array
minionsRouter.get('/', (req, res, next) => {
    // an array of all the minions
    const allMinions = db.getAllFromDatabase('minions');
    res.status(200).send(allMinions);
});

// create minion
minionsRouter.post('/', validateSalary, (req, res, next) => {
    // create a new minion and save to db
    req.body.salary = parseInt(req.body.salary);
    const minion = db.addToDatabase('minions', req.body);
    if(minion !== null){
        res.status(201).send(minion);
    }
    else {
        next(new Error('Cannot save'));
    }
});

// get a minion by minionId
minionsRouter.get('/:minionId', (req, res, next) => {
    // get a single minion by Id
      res.status(200).send(req.minion);
});

// Update a minion by minionId
minionsRouter.put('/:minionId', validateSalary, (req, res, next) => {
    // update a single minion by id
    const update = req.body;
    update.id = req.minionId;
    const updatedMinion = db.updateInstanceInDatabase('minions', update);
    if (updatedMinion) {
        res.status(200).send(updatedMinion);
    } else {
        next(new Error('Update failed'));
    }

});

// delete a minion by minionId
minionsRouter.delete('/:minionId', (req, res, next) => {
    // delete a minion by id
    if (db.deleteFromDatabasebyId('minions', req.minionId)){
        res.status(204).send();
    }
    else {
        next(new error('Could not delete'));
    }
});


module.exports = minionsRouter