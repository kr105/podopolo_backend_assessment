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
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Note', NoteSchema);