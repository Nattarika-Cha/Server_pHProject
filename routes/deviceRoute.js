const express = require('express');
const app = express();
const deviceRouter = express.Router();

const deviceModel = require('../model/deviceModel');

deviceRouter.route('/select').post(function (req, res) {
    deviceModel.findOne({ 'serialQR': req.body.serialQR }, function (err, device) {
        if (device != null) {
            if (device.status == '') {
                device.status = 'ON';
                device.token = req.body.token;
                device.save()
                    .then(device => {
                        console.log('Add device success');
                        res.json(device);
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

deviceRouter.route('/device_list').get(function (req, res) {
    console.log(req);
    deviceModel.find({}, function (err, device) {
        if(err){
            console.log(err);
        }
        else{
            res.json(device);
        }
    })
});

module.exports = deviceRouter;