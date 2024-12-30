const mongoose = require('mongoose');
const User = require('../models/user');


var schema = new mongoose.Schema({
    event: {
        type: String,
        required: false,
        unique: true
    },
    date: {
        type: Date,
        required: true,
        unique: true
    },
    user: { type: mongoose.Schema.ObjectId, ref: "User" },
    cancelUser: {
        type: Boolean,
        required: false
    },
    cancelAdmin: {
        type: Boolean,
        required: false
    },

    idTx: {
        type: String,
        required: false,
        unique: true
    },

});

const turn = new mongoose.model('Turn', schema);

module.exports = turn;