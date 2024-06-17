const mongoose = require('mongoose');
const User = require('../models/user');


var schema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: false
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

});

const turn = new mongoose.model('Turn', schema);

module.exports = turn;