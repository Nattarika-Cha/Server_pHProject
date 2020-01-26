const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingSchema = new Schema({
    sound: {
        type: Boolean,
        required: true
    },
    messege: {
        type: Boolean,
        required: true
    },
    gps: {
        type: Boolean,
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