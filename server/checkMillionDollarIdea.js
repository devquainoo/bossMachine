const checkMillionDollarIdea = (req, res, next) => {
    const millionDollar = 1000000;
    console.log('ntestetsstets\n',req.body.numWeeks)

    if (req.body['numWeeks'] !== undefined){
        let numWeeks = req.body['numWeeks'];
        if (isNaN(numWeeks)){
            res.status(400).send('numWeeks s not a number');
        } else {
            req.body["numWeeks"] = numWeeks;
        }
    } else {
        // res.status(400).send('num of weeks is undefined');
        let err = new Error('numWeeks is undefined');
        err.status = 400;
        return next(err);
    }

    if (req.body['weeklyRevenue'] !== undefined) {
        let weeklyRevenue = parseInt(req.body['weeklyRevenue']);
        if (isNaN(weeklyRevenue)) {
            res.status(400).send('weeklyRevenue s not a number');
        } else {
            req.body["weeklyRevenue"] = weeklyRevenue;
        }
    } else {
        // res.status(400).send('weeklyRevenue is undefined');
        let err = new Error('weeklyRevenue is undefined');
        err.status = 400;
        return next(err);
    }

    const product = req.body['numWeeks'] * req.body["weeklyRevenue"];
    if (product < millionDollar){
        let err = new Error('Your idea must be at least a million dollar idea');
        res.status(400).send('this is not a million dollar idea');
    }
    next();
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
