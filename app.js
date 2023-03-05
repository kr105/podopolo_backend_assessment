const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const passport = require('passport');
const routes = require('./routes');

// middleware
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((err, req, res, next) => {
    console.error(err); 
  
    // handle body-parser error when the json received is malformed
    if (err.status === 400) {
      return res.status(err.status).send('Bad request');
    }
  
    return next(err);
});

// routes
app.use('/api', routes);

// handle non existent routes
app.get('*', function(req, res) {
    res.contentType('application/problem+json'); // RFC7807
    res.status(404);
    res.json({ message: 'Not Found' });
});

module.exports = app;