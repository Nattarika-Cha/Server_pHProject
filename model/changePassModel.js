const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const changePassSchema = new Schema({
    token: {
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
    collection: 'change_pass'
});

module.exports = mongoose.model('change_pass', changePassSchema);