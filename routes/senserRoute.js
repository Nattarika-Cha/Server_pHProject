const express = require('express');
const app = express();
const senserRouter = express.Router();

const senserModel = require('../model/senserModel');

senserRouter.route('/data_senser').get(function (req, res) {
    senserModel.find()
        .sort({ $natural: -1 })
        .limit(1)
        .next()
        .then(
            function (doc) {
                console.log(doc);
            },
            function (err) {
                console.log('Error:', err);
            }
        );
});

module.exports = senserRouter;