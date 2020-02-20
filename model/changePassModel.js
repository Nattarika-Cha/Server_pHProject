const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const changePassSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    genid: {
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
    collection: 'changePass'
});

module.exports = mongoose.model('changePass', changePassSchema);