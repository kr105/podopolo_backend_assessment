const router = require('express').Router();
const authenticate = require('../authenticate');
const Note = require('../models/note');
const User = require('../models/user');

// get a list of all notes for the authenticated user
router.get('/notes', authenticate.verifyUser, async (req, res) => {
    // Find notes that belongs to the authenticated user
    Note.find({ $or: [{ owner: req.user._id }, { sharedWith: req.user._id }] }).then((notesUser) => {
        res.contentType('application/json');
        res.status(200);
        res.json(notesUser);
        res.send();
    });
});

// get a note by ID for the authenticated user
router.get('/notes/:id', authenticate.verifyUser, async (req, res) => {
    // get the note
    Note.findOne({ _id: req.params.id }).then((note) => {
        // the note doesn't exist
        if (note == null) {
            res.status(404);
            res.contentType('application/problem+json'); // RFC7807
            res.json({ message: 'Note not found' });
            res.send();
            return;
        }

        // the note doesn't belong to the authenticated user
        if (note.owner._id.equals(req.user._id) == false) {
            if (req.user._id in note.sharedWith == true) {
                // the note was shared with the user
                res.contentType('application/json');
                res.status(200);
                res.json(note);
                res.send();
            }

            // the note doesn't belong to the user and it is not shared
            res.status(403);
            res.contentType('application/problem+json'); // RFC7807
            res.json({ message: 'Note not authorized' });
            res.send();
            return;
        }

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
    Note.updateOne({ _id: req.params.id, owner: req.user._id }, {
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
    Note.findOne({ _id: req.params.id, owner: req.user._id }).then((note) => {
        // the note doesn't exist
        if (note == null) {
            res.status(404);
            res.contentType('application/problem+json'); // RFC7807
            res.json({ message: 'Note not found' });
            res.send();
            return;
        }

        // required parameter
        if ('shareWith' in req.body == false) {
            res.status(400);
            res.contentType('application/problem+json'); // RFC7807
            res.json({ message: 'shareWith not provided' });
            res.send();
            return;
        }

        // check if provided user id is valid
        User.findOne({ _id: req.body.shareWith }).then((sharedUser) => {
            if (sharedUser == null) {
                res.status(400);
                res.contentType('application/problem+json'); // RFC7807
                res.json({ message: 'Invalid ID on shareWith' });
                res.send();
                return;
            }

            if (sharedUser._id.equals(req.user._id) == true) {
                res.status(400);
                res.contentType('application/problem+json'); // RFC7807
                res.json({ message: 'Can\'t share a note with yourself' });
                res.send();
                return;
            }

            // Already shared ?
            Note.findOne({ _id: note._id, sharedWith: sharedUser._id }).then(async (sharedNote) => {
                if (sharedNote == null) { // Not yet shared
                    note.sharedWith.push(sharedUser);
                    await note.save();
                }

                // Return OK even if it was already shared

                res.contentType('application/json');
                res.status(200);
                res.json({ message: 'Note shared OK' });
                res.send();
            });
        });
    });
});

// search for notes based on keywords for the authenticated user
router.get('/search?q=:query', authenticate.verifyUser, async (req, res) => {

});

module.exports = router;