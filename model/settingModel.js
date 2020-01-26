const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingSchema = new Schema({
    sound: {
        type: String,
        required: true
    },
    messege: {
        type: String,
        required: true
    },
    gps: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
},{
    collection: 'setting'
});

module.exports = mongoose.model('setting', settingSchema);