const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const analyzeSchema = new Schema({
    pH: {
        type: String,
        required: true
    },
    soil_type: {
        type: String,
        required: true
    },
    limestone: {
        type: String,
        required: true
    },
},{
    collection: 'analyze'
});

module.exports = mongoose.model('analyze', analyzeSchema);