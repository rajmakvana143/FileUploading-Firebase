const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
        trim : true,
    },
    bufferData: {
        type: String,
        required: true,
        trim : true,
    },
    Timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Image', imageSchema);