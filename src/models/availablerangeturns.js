const mongoose = require('mongoose');

var schema = new mongoose.Schema({

    event: {
        type: String,
        required: true,
        unique: true
    },
    dayValues: {
        type: [Number],
        required: true,
        unique: false
    },
    hourValues: {
        type: [Number],
        required: true,
        unique: false
    },
    minuteValues: {
        type: [Number],
        required: true,
        unique: false
    },
    minDate: {
        type: String,
        required: true,
        unique: false
    },
    maxDate: {
        type: String,
        required: true,
        unique: false
    }

});

const AvailableRangeTurn = new mongoose.model('AvailableRangeTurn', schema);

module.exports = AvailableRangeTurn;