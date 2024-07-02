const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    event: {
        type: String,
        required: true,
        unique: true
    },
});

const TheEvent = new mongoose.model('TheEvent', schema);

module.exports = TheEvent;