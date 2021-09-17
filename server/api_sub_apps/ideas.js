const express = require('express');
const ideasRouter = express.Router({ mergeParams: true });
const db = require('../db.js');
const checkMillionDollarIdea = require('../checkMillionDollarIdea.js');


// validate request body for post and put
const validateBody = (req, res, next) => {
    
    const ideaSchema = ['name', 'description', 'numWeeks', 'weeklyRevenue'];
    const reqBodySchema = Object.keys(req.body);

    if (req.method == "POST"){
        if (ideaSchema.length !== reqBodySchema.length) {
            return next(new Error('Must provide full data'));
        }
        // check for undefined input data
        for (let i = 0; i < ideaSchema.length; i++) {
            // let notSet = req.body[ideaSchema[i]] === undefined || req.body[ideaSchema[i]] === null;
            if (req.body.hasOwnProperty(ideaSchema[i])) {
                if (req.body[ideaSchema[i]] !== undefined && req.body[ideaSchema[i]] !== null) {
                    continue;
                }
                else {
                    return next(new Error('All properties not set'));
                }
            } else {
                return next(new Error('Wrong Properties'));
            }
        }
        try {
            req.body.numWeeks = parseInt(req.body.numWeeks);
            req.body.weeklyRevenue = parseInt(req.body.weeklyRevenue);
        }
        catch (err) {
            return next(err);
        }
    }

    if(req.method === "PUT"){
        if (req.body.hasOwnProperty('numWeeks')){
            if(req.body.numWeeks === undefined){
                let err = new Error('Set numWeeks')
                return next(err);
            } else {
                req.body.numWeeks = parseInt(req.body.numWeeks);
            }
        }
        if (req.body.hasOwnProperty('weeklyRevenue')){
            if(req.body.weeklyRevenue === undefined){
                let err = new Error('Set weeklyRevenue')
                return next(err);
            } else {
                req.body.weeklyRevenue = parseInt(req.body.weeklyRevenue);
            }
        }

    }
    
    
    return next();
}

// get ideaId paramemter
ideasRouter.param('ideaId', (req, res, next, id) => {
    id = parseInt(id);
    if(typeof(id) === 'number'){
        if (id < 1){
            return next(new Error('Id can not be less than or equal to zero'));
        }
    }
    else {
        return next(new Error('ideasId must be a digit'));
    }
    id = String(id);
    req.ideaId = id;
    req.idea = db.getFromDatabaseById('ideas', id);
    if (!req.idea){
        res.status(404).send('Resource Not Found');
    }
    next();
});

// get all millions as an array
ideasRouter.get('/', (req, res, next) => {
    // an array of all the ideas
    next();
    res.status(200).send(db.getAllFromDatabase('ideas'))
});

// create an idea
ideasRouter.post('/', validateBody, checkMillionDollarIdea, (req, res, next) => {
    // create a new idea and save to db
    if (db.addToDatabase('ideas', req.body)) {
        res.status(201).send(req.body);
    }
    else {
        next(new Error('Cannot create idea'));
    }
});

// get an idea by ideaId
ideasRouter.get('/:ideaId', (req, res, next) => {
    // get a single idea by Id
    res.status(200).send(req.idea);

});

// Update an idea by ideaId
ideasRouter.put('/:ideaId', validateBody, checkMillionDollarIdea, (req, res, next) => {
    // update a single idea by id
    // req.body.id = req.ideaId;
    const keys = Object.keys(req.body);
    console.log('PUT UPDATEEEEEEEEEEEEEEEEE')
    console.log(req.idea);
    keys.forEach((key) => {
        req.idea[key] = req.body[key];
    });
    console.log(req.idea);
    const updatedIdea = db.updateInstanceInDatabase('ideas', req.idea);
    console.log(updatedIdea);
    if(updatedIdea){

        res.status(201).send(updatedIdea);
    }
    else{
        return next(new Error('Could not update'));
    }
});

// delete an idea by ideaId
ideasRouter.delete('/:ideaId', (req, res, next) => {
    // delete an idea by id
    if (req.idea !== {} && req.idea !== null){
        if (db.deleteFromDatabasebyId('ideas', req.ideaId)) {
            res.status(204).send();
        }
    }
    else {
        next(new error('Could not delete'));
    }
});


module.exports = ideasRouter;