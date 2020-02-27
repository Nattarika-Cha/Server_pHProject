const express = require('express');
const app = express();
const senserRouter = express.Router();
var request = require('request');

const senserModel = require('../model/senserModel');
const deviceModel = require('../model/deviceModel');
const configModel = require('../model/configModel');

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

// senserRouter.route('/add_test').post(function (req, res) {
//     (async () => {
//         // save_senser(req.body.pH, req.body.moisture, req.body.pump, req.body.IMEI)
//         chack_noti(req.body.pH, req.body.moisture, req.body.latitude, req.body.longitude, req.body.pump, req.body.IMEI).then(() => {
//             res.json('Save success test');
//         })
//     })();

// });

senserRouter.route('/add_test').post(function (req, res) {
    var pH = req.body.pH;
    var humidity = req.body.moisture;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var pump = req.body.pump;
    var serialDevice = req.body.IMEI;
    configModel.find({ serialDevice: serialDevice }).countDocuments(function (err, number) {
        if (number != 0) {
            configModel.findOne({ serialDevice: serialDevice }, function (err, config) {
                var pH_low = config.pH_low;
                var pH_hight = config.pH_hight;
                var humidity_low = config.humidity_low;
                var humidity_hight = config.humidity_hight;
                if (((pH < pH_low) || (pH > pH_hight)) && ((humidity < humidity_low) || (humidity > humidity_hight))) {
                    console.log("pH and humidity wrong")
                } else if ((pH < pH_low) || (pH > pH_hight)) {
                    console.log("pH wrong")
                } else if ((humidity < humidity_low) || (humidity > humidity_hight)) {
                    console.log("humidity wrong")
                } else {
                    console.log("Normal")
                }
            });

            senserModel.findOne({ IMEI: serialDevice }).sort({ '_id': -1 }).exec(function (err, sen_sort) {
                var insertDataSenser = {
                    'pH': pH,
                    'moisture': humidity,
                    'latitude': latitude,
                    'longitude': longitude,
                    'pump': pump,
                    'IMEI': serialDevice
                };
                const data = new senserModel(insertDataSenser);
                data.save()
                    .then(data => {
                        console.log('Save success test');
                        res.json('Save success test');
                    })
                    .catch(err => {
                        console.log('unable to save to database');
                    });
                if (err) throw err;
                // console.log(pump)
                // console.log(sen_sort.pump)
                if (pump != sen_sort.pump) {
                    if (pump == '0') {
                        console.log("Close Pump")
                    } else if (pump == '1') {
                        console.log("Open Pump")
                    }
                } else {
                    console.log("Normal")
                }

            })
        } else {
            console.log("device not yet config");
        }
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
            res.json(pump);
        });
    });
});

// async function start_noti(pH, humidity, pump, serialDevice) {
//     await chack_noti(pH, humidity, pump, serialDevice);
// }

// function save_senser()

// function chack_noti(pH, humidity, latitude, longitude, pump, serialDevice) {
//     return new Promise(function (resolve, reject) {
//         configModel.find({ serialDevice: serialDevice }).countDocuments(function (err, number) {
//             if (number != 0) {
//                 configModel.findOne({ serialDevice: serialDevice }, function (err, config) {
//                     var pH_low = config.pH_low;
//                     var pH_hight = config.pH_hight;
//                     var humidity_low = config.humidity_low;
//                     var humidity_hight = config.humidity_hight;
//                     if (((pH < pH_low) || (pH > pH_hight)) && ((humidity < humidity_low) || (humidity > humidity_hight))) {
//                         console.log("pH and humidity wrong")
//                     } else if ((pH < pH_low) || (pH > pH_hight)) {
//                         console.log("pH wrong")
//                     } else if ((humidity < humidity_low) || (humidity > humidity_hight)) {
//                         console.log("humidity wrong")
//                     } else {
//                         console.log("Normal")
//                     }
//                 });

//                 senserModel.findOne({ IMEI: serialDevice }).sort({ '_id': -1 }).exec(function (err, sen_sort) {
//                     if (err) throw err;
//                     console.log(pump)
//                     console.log(sen_sort.pump)
//                     if (pump != sen_sort.pump) {
//                         if (pump == '0') {
//                             console.log("Close Pump")
//                         } else if (pump == '1') {
//                             console.log("Open Pump")
//                         }
//                     } else {
//                         console.log("Normal")
//                     }
//                     var insertDataSenser = {
//                         'pH': pH,
//                         'moisture': humidity,
//                         'latitude': latitude,
//                         'longitude': longitude,
//                         'pump': pump,
//                         'IMEI': serialDevice
//                     };
//                     const data = new senserModel(insertDataSenser);
//                     data.save()
//                         .then(data => {
//                             console.log('Save success test');
//                             res.json('Save success test');
//                         })
//                         .catch(err => {
//                             console.log('unable to save to database');
//                         });
//                 })
//             } else {
//                 console.log("device not yet config");
//             }
//         });
//     })
// }

module.exports = senserRouter;