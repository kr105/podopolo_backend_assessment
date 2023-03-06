const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true
    },
    title: {
        type: String,
        required: true
    },
    contents: {
        type: String,
        required: true
    },
    sharedWith: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true
        }
    ]
}, {
    timestamps: true
});

// Index to support text search
NoteSchema.index({ title: 'text', contents: 'text' });

module.exports = mongoose.model('Note', NoteSchema);