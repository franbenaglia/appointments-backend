const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    phone: String,
});

const turn = new mongoose.model('Turn', schema);

module.exports = turn;