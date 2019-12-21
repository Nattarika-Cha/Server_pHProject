const express = require('express');
const app = express();
const deviceRouter = express.Router();

const deviceModel = require('../model/deviceModel');

deviceRouter.route('/select').post(function (req, res) {
    deviceModel.find({ 'serialQR': req.body.serialQR }).countDocuments(function (err, number) {
        if (number != 0) {
            res.json('Add device success');
            console.log('Add device success');
        }
        else {
            res.json('Not Device');
            console.log('Not Device');
        }
    })
});

module.exports = deviceRouter;