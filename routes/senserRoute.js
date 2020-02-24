const express = require('express');
const app = express();
const senserRouter = express.Router();
var request = require('request');

const senserModel = require('../model/senserModel');
const deviceModel = require('../model/deviceModel');

senserRouter.route('/add').post(function (req, res) {
    if (req.body.DevEUI_uplink != undefined) {
        //console.log(req.body.DevEUI_uplink.payload_hex);
        var str1 = req.body.DevEUI_uplink.payload_hex;
        var hex = str1.toString();
        var str = '';
        for (var n = 0; n < hex.length; n += 2) {
            str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
        }
        console.log(str);
        // var str = req.body.DevEUI_uplink.payload_parsed;
        var data1 = str.split(" ");
        var insertDataSenser = {
            'pH': data1[1] / 10,
            'moisture': data1[2],
            'latitude': req.body.DevEUI_uplink.LrrLAT,
            'longitude': req.body.DevEUI_uplink.LrrLON,
            'pump': data1[3],
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
    } else {
        console.log("Send to lora");
    }
});

senserRouter.route('/add_test').post(function (req, res) {
    var insertDataSenser = {
        'pH': req.body.pH,
        'moisture': req.body.moisture,
        'latitude': req.body.latitude,
        'longitude': req.body.longitude,
        'pump': req.body.pump,
        'IMEI': req.body.IMEI
    };

    const data = new senserModel(insertDataSenser);
    data.save()
        .then(data => {
            console.log('Save success test');
            res.json('Save success test');
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        });
});


senserRouter.route('/data_senser').get(function (req, res) {
    senserModel.findOne({ IMEI: req.query.serialDevice }).sort({ '_id': -1 }).exec(function (err, sen_sort) {
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

senserRouter.route('/pump').post(function (req, res) {
    var devive_EUI = req.body.devive_EUI;
    var port = req.body.port;
    var status = req.body.status;
    var options = {
        'method': 'POST',
        'url': 'https://loraiot.cattelecom.com/portal/iotapi/auth/token',
        'headers': {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ "username": "pHproject", "password": "pHproject1234" })

    };
    request(options, function (error, token) {
        if (error) throw new Error(error);
        var access_token = JSON.parse(token.body);
        var authorization = "Bearer " + access_token.access_token;
        var url = "https://loraiot.cattelecom.com/portal/iotapi/core/devices/" + devive_EUI + "/downlinkMessages";
        var options = {
            'method': 'POST',
            'url': url,
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': authorization
            },
            body: JSON.stringify({ "payloadHex": status, "targetPorts": port })

        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            var pump = JSON.parse(response.body);
            console.log(response.body);
            res.json("Pump " + pump.payloadHex + " " + pump.status);
        });
    });
});

module.exports = senserRouter;