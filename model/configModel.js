const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const configSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    soil_type: {
        type: String,
        required: true
    },
    pH: {
        type: String,
        required: true
    },
},{
    collection: 'config'
});

module.exports = mongoose.model('config', configSchema);