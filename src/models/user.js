const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const hash = require('bcrypt').hash;

var schema = new mongoose.Schema({
    googleId: {
        type: String,
        //required: true,
    },
    githubId: {
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
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
});

schema.plugin(findOrCreate);

schema.pre('save', async function (next) {

    const hashedPassword = await hash(this.password ? this.password : 'azhAZH', 10);
    this.password = hashedPassword;

    next();
});

schema.method('isValidPassword', async function (password) {
    const isValid = await compare(password, this.password);
    return isValid;
});

const User = new mongoose.model('User', schema);

module.exports = User;