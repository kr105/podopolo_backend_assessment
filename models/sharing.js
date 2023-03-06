const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SharingSchema = new Schema({
    note: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Note',
        index: true
    },
    sharedWith: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true
    }
});

module.exports = mongoose.model('Sharing', SharingSchema);