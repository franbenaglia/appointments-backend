const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

var schema = new mongoose.Schema({
    googleId: {
        type: String,
        //required: true,
    },
    password: {
        type: String,
        //required: true,
    },
    email: {
        type: String,
        //required: true,
        //unique: true
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

schema.plugin(findOrCreate);

const user = new mongoose.model('User', schema);

module.exports = user;