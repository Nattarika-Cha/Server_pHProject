const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment-timezone');
const dateThailand = moment.tz(Date.now(), "Asia/Bangkok");

console.log(dateThailand); // "2018-08-20T16:35:14.033+07:00"

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
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
    token: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        tz: 'Asia/Bangkok'
    },
},{
    collection: 'user'
});

module.exports = mongoose.model('user', userSchema);