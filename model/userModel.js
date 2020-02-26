const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment-timezone');

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    token: {
        type: String,
        required: true
    },
    device_token: {
        type: String,
        //required: true
    },
    salt: {
        type: String,
        required: true
    },
    active: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
},{
    collection: 'user'
});

module.exports = mongoose.model('user', userSchema);