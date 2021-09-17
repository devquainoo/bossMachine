const express = require('express');
const apiRouter = express.Router();
const minionsRouter = require('./api_sub_apps/minions.js');
const ideasRouter = require('./api_sub_apps/ideas.js');
const meetingsRouter = require('./api_sub_apps/meetings.js');

// minions
apiRouter.use('/minions', minionsRouter);

// Ideas
apiRouter.use('/ideas', ideasRouter);

// Meetings
apiRouter.use('/meetings', meetingsRouter);

module.exports = apiRouter;
