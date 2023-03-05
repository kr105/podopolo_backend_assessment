const router = require('express').Router();
const passport = require('passport');

// User model
var User = require('../models/user');

// Get our authenticate module
var authenticate = require('../authenticate');

// create a new user account
router.post('/auth/signup', (req, res) => {
    User.register(new User({username: req.body.username, email: req.body.email}),
    req.body.password, (err, user) => {
        if(err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
        }
        else {
            // Use passport to authenticate User
            passport.authenticate('local')(req, res, () => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: true, status: 'Registration Successful!'});
            });
        }
    });
});


// log in to an existing user account and receive an access token
router.post('/auth/login', passport.authenticate('local', {session: false}), (req, res) => {
    // Create a token
    var token = authenticate.getToken({_id: req.user._id});

    // Response
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

module.exports = router;