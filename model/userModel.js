const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
        default: {type:Date, default:Date.now}, tz: 'Asia/Bangkok' // e.g. 'Asia/Calcutta' or 'America/New_York'
    },
},{
    collection: 'user'
});

module.exports = mongoose.model('user', userSchema);