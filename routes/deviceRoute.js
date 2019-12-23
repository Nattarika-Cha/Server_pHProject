const express = require('express');
const app = express();
const deviceRouter = express.Router();

const deviceModel = require('../model/deviceModel');

deviceRouter.route('/select').post(function (req, res) {
    deviceModel.findOne({ 'serialQR': req.body.serialQR }, function (err, device) {
        if (device != null) {
            if (device.status == '') {
                device.status = 'ON';
                deviceModel.save()
                    .then(device => {
                        console.log('Add device success');
                        res.json('Add device success');
                    })
                    .catch(err => {
                        res.status(400).send("unable add device to database");
                    });
            } else {
                res.json('Not Device');
                console.log('Not Device');
            }
        }
        else {
            res.json('Not Device');
            console.log('Not Device');
        }
    })
});

module.exports = deviceRouter;