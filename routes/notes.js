const router = require('express').Router();

// get a list of all notes for the authenticated user
router.get('/notes', (req, res) => {

});

// get a note by ID for the authenticated user
router.get('/notes/:id', (req, res) => {

});

// create a new note for the authenticated user
router.post('/notes', (req, res) => {

});

// update an existing note by ID for the authenticated user
router.put('/notes/:id', (req, res) => {

});

// delete a note by ID for the authenticated user
router.delete('/notes/:id', (req, res) => {

});

// share a note with another user for the authenticated user
router.post('/notes/:id/share', (req, res) => {
    
});

// search for notes based on keywords for the authenticated user
router.get('/search?q=:query', (req, res) => {
    
});

module.exports = router;