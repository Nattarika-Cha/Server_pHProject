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
    status: {
        type: String,
        required: true
    },
},{
    collection: 'device'
});

module.exports = mongoose.model('device', deviceSchema);