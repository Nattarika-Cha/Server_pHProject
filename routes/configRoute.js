const express = require('express');
const app = express();
const configRouter = express.Router();

const configModel = require('../model/configModel');

configRouter.route('/add').post(function (req, res) {
    var insertConfig = {
        'name': req.body.name,
        'age': req.body.age,
        'area': req.body.area,
        'soil_type': req.body.soil_type,
        'pH': req.body.pH,
        'humidity': req.body.humidity,
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

module.exports = configRouter;