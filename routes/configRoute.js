const express = require('express');
const app = express();
const configRouter = express.Router();

const configModel = require('../model/configModel');

configRouter.route('/add').post(function (req, res) {
    var insertConfig = {
        'name': req.body.name,
        'age': req.body.age,
        'age_type': req.body.age_type,
        'area': req.body.area,
        'area_type': req.body.area_type,
        'soil_type': req.body.soil_type,
        'pH_low': req.body.pH_low,
        'pH_hight': req.body.pH_hight,
        'humidity_low': req.body.humidity_low,
        'humidity_hight': req.body.humidity_hight,
        'serialDevice': req.body.serialDevice
    };

    const config = new configModel(insertConfig);
    config.save()
        .then(config => {
            res.json('Save success');
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        });
});

configRouter.route('/device_config').get(function (req, res) {
    configModel.findOne({ serialDevice: req.query.serialDevice }, function (err, device_config) {
        if (err) {
            console.log(err);
        }
        else {
            res.json(device_config);
        }
    });
});

module.exports = configRouter;