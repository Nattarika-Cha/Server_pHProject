const express = require('express');
const app = express();
const senserRouter = express.Router();

const senserModel = require('../model/senserModel');

senserRouter.route('/add').post(function (req, res) {
    var str = req.body.DevEUI_uplink.payload_parsed;
    var data1 = str.split(" ");
    var insertDataSenser = {
        'pH': data1[1]/10,
        'moisture': data1[2],
        'latitude': req.body.DevEUI_uplink.LrrLAT,
        'longitude': req.body.DevEUI_uplink.LrrLON,
        'IMEI': data1[0]
    };

    const data = new senserModel(insertDataSenser);
    data.save()
        .then(data => {
            console.log('Save success lora');
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        });
});

senserRouter.route('/data_senser').get(function (req, res) {
    senserModel.findOne({IMEI: req.query.serialDevice}).sort({'_id': -1}).exec(function (err, sen_sort) {
        if (err) throw err;
        res.json(sen_sort);
    })
});

senserRouter.route('/senser_history').get(function (req, res) {
    senserModel.find({
        IMEI: req.query.serialDevice,
        date: {
            $gte: req.query.start,
            $lt: req.query.end
        }
    }, function (err, senser_history) {
        if (err) {
            console.log(err);
        }
        else {
            res.json(senser_history);
        }
    });
});

module.exports = senserRouter;