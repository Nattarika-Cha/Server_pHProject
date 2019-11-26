const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registerSchema = new Schema({
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
    salt: {
        type: String,
        required: true
    },
},{
    collection: 'register'
});

module.exports = mongoose.model('register', registerSchema);