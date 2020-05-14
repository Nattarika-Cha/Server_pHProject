const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const senserSchema = new Schema({
    pH: {
        type: String,
        required: true
    },
    moisture: {
        type: String,
        required: true
    },
    WaterpH: {
        type: String,
        required: true
    },
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    },
    pump: {
        type: String,
        required: true
    },
    IMEI: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
},{
    collection: 'senser'
});

module.exports = mongoose.model('senser', senserSchema);