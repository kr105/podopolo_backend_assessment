const router = require('express').Router();
const authenticate = require('../authenticate');
const Note = require('../models/note');

// get a list of all notes for the authenticated user
router.get('/notes', authenticate.verifyUser, async (req, res) => {
    Note.find({ owner: req.user._id }).then((notes) => {
        res.contentType('application/json');
        res.status(200);
        res.json(notes);
        res.send();
    });
});

// get a note by ID for the authenticated user
router.get('/notes/:id', authenticate.verifyUser, async (req, res) => {
    Note.findOne({ _id: req.params.id, owner: req.user._id }).then((note) => {
        res.contentType('application/json');
        res.status(200);
        res.json(note);
        res.send();
    });
});

// create a new note for the authenticated user
router.post('/notes', authenticate.verifyUser, async (req, res, next) => {
    let newNote = new Note({
        owner: req.user._id,
        title: req.body.title,
        contents: req.body.contents
    });

    newNote.save().then((note) => {
        res.contentType('application/json');
        res.status(201);
        res.location(`/api/notes/${note.id}`)
        res.json({ id: note.id });
        res.send();
    });
});

// update an existing note by ID for the authenticated user
router.put('/notes/:id', authenticate.verifyUser, async (req, res) => {
    Note.updateOne({ _id: req.params.id, owner: req.user._id },{
        title: req.body.title,
        contents: req.body.contents
    }).then((result) => {
        if (result.matchedCount == 0) {
            res.status(404);
            res.contentType('application/problem+json'); // RFC7807
            res.json({ message: 'Note not found' });
        } else {
            res.status(200);
            res.contentType('application/json');
            res.json({ message: 'Note updated successfully' });
        }
        res.send();
    });
});

// delete a note by ID for the authenticated user
router.delete('/notes/:id', authenticate.verifyUser, async (req, res) => {
    Note.deleteOne({ _id: req.params.id, owner: req.user._id }).then((result) => {
        if (result.deletedCount == 0) {
            res.status(404);
            res.contentType('application/problem+json'); // RFC7807
            res.json({ message: 'Note not found' });
        } else {
            res.status(200);
            res.contentType('application/json');
            res.json({ message: 'Note deleted successfully' });
        }
        res.send();
    });
});

// share a note with another user for the authenticated user
router.post('/notes/:id/share', authenticate.verifyUser, async (req, res) => {

});

// search for notes based on keywords for the authenticated user
router.get('/search?q=:query', authenticate.verifyUser, async (req, res) => {

});

module.exports = router;