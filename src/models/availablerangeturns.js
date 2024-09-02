const mongoose = require('mongoose');

var schema = new mongoose.Schema({

    event: {
        type: String,
        required: true,
        unique: true
    },
    dayValues: {
        type: [Number],
        required: false,
        unique: false
    },
    hourValues: {
        type: [Number],
        required: false,
        unique: false
    },
    minuteValues: {
        type: [Number],
        required: false,
        unique: false
    },
    minDate: {
        type: String,
        required: false,
        unique: false
    },
    maxDate: {
        type: String,
        required: false,
        unique: false
    },
    specificdays: {
        type: [String],
        required: false,
        unique: false
    },
    weekends: {
        type: Boolean,
        required: false,
        unique: false
    },
    deleted: {
        type: Boolean,
        required: false,
        unique: false
    }


});

const AvailableRangeTurn = new mongoose.model('AvailableRangeTurn', schema);

module.exports = AvailableRangeTurn;