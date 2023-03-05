const router = require('express').Router();
const authRoute = require('./auth');
const notesRoute = require('./notes');

router.use('/', authRoute);
router.use('/', notesRoute);

module.exports = router;