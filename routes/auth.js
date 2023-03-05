const router = require('express').Router();
const passport = require('passport');

// User model
var User = require('../models/user');

// Get our authenticate module
var authenticate = require('../authenticate');

// create a new user account
router.post('/auth/signup', (req, res) => {
    User.register(new User({ username: req.body.username, email: req.body.email }),
        req.body.password, (err, user) => {
            if (err) {
                res.contentType('application/problem+json'); // RFC7807
                res.status(400);
                res.json({ message: err.message });
            }
            else {
                // Use passport to authenticate User
                passport.authenticate('local')(req, res, () => {
                    res.contentType('application/json');
                    res.status(201);
                    res.json({ message: 'Registration successful' });
                });
            }
        });
});


// log in to an existing user account and receive an access token
router.post('/auth/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info, status) => {
        if (err) {
            return next(err); // will generate a 500 error
        }

        // Auth failed
        if (!user) {
            if (info.message == 'Missing credentials') {
                res.status(400);
            } else {
                res.status(401);
            }

            res.contentType('application/problem+json'); // RFC7807
            res.json({ message: info.message });
            return res.send();
        }

        // Create a token
        var token = authenticate.getToken({ _id: user._id });

        // Response
        res.contentType('application/json');
        res.status(200);
        res.json({ token: token });
    })(req, res, next);
});

module.exports = router;