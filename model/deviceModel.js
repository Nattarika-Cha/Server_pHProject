const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    serialQR: {
        type: String,
        required: true
    },
    serialDevice: {
        type: String,
        required: true
    },
    devive_EUI:{
        type: String,
        required: true
    },
    port:{
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    plant: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
},{
    collection: 'device'
});

module.exports = mongoose.model('device', deviceSchema);