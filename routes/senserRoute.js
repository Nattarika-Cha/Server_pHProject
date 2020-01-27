const express = require('express');
const app = express();
const senserRouter = express.Router();

const senserModel = require('../model/senserModel');

senserRouter.route('/add').post(function (req, res) {
    console.log("test");
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
            res.json('Save success lora');
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        });
});

senserRouter.route('/data_senser').get(function (req, res) {
    // senserModel.findOne({}, {}, { sort: { '_id' : -1 } },function (err, sen_sort) {
    //         if (err) throw err;
    //         console.log(sen_sort);
    //     })

    senserModel.findOne().sort({'_id': -1}).exec(function (err, sen_sort) {
        if (err) throw err;
        console.log(sen_sort);
    })
});

module.exports = senserRouter;