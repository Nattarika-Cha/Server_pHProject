const express = require('express');
const app = express();
const senserRouter = express.Router();
var request = require('request');
var moment = require('moment');

const senserModel = require('../model/senserModel');
const deviceModel = require('../model/deviceModel');
const configModel = require('../model/configModel');
const userModel = require('../model/userModel');
const notiModel = require('../model/notiModel');
const settingModel = require('../model/settingModel');

// senserRouter.route('/add').post(function (req, res) {
//     if (req.body.DevEUI_uplink != undefined) {
//         //console.log(req.body.DevEUI_uplink.payload_hex);
//         var str1 = req.body.DevEUI_uplink.payload_hex;
//         var hex = str1.toString();
//         var str = '';
//         for (var n = 0; n < hex.length; n += 2) {
//             str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
//         }
//         console.log(str);
//         // var str = req.body.DevEUI_uplink.payload_parsed;
//         var data1 = str.split(" ");
//         var insertDataSenser = {
//             'pH': data1[1] / 10,
//             'moisture': data1[2],
//             'latitude': req.body.DevEUI_uplink.LrrLAT,
//             'longitude': req.body.DevEUI_uplink.LrrLON,
//             'pump': data1[3],
//             'IMEI': data1[0]
//         };

//         const data = new senserModel(insertDataSenser);
//         data.save()
//             .then(data => {
//                 console.log('Save success lora');
//             })
//             .catch(err => {
//                 res.status(400).send("unable to save to database");
//             });
//     } else {
//         console.log("Send to lora");
//     }
// });

// senserRouter.route('/add_test').post(function (req, res) {
//     (async () => {
//         // save_senser(req.body.pH, req.body.moisture, req.body.pump, req.body.IMEI)
//         chack_noti(req.body.pH, req.body.moisture, req.body.latitude, req.body.longitude, req.body.pump, req.body.IMEI).then(() => {
//             res.json('Save success test');
//         })
//     })();

// });

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
        var pH = data1[1] / 10;
        var humidity = data1[2];
        var latitude = req.body.DevEUI_uplink.LrrLAT;
        var longitude = req.body.DevEUI_uplink.LrrLON;
        var pump = data1[3];
        var serialDevice = data1[0];
        notiModel.find({ serialDevice: serialDevice }).countDocuments(function (err, noitnumber) {
            if (noitnumber != 0) {
                notiModel.findOne({ serialDevice: serialDevice }).sort({ '_id': -1 }).exec(function (err, noti) {
                    var date_last_noti = noti.date;
                    var date_now = moment();
                    var date_next_noti = moment(date_last_noti).add(1, 'hours');
                    // console.log("Last " + date_last_noti);
                    console.log("Now " + date_now);
                    console.log("Next " + date_next_noti);
                    if (date_next_noti < date_now) {
                        configModel.find({ serialDevice: serialDevice }).countDocuments(function (err, number) {
                            if (number != 0) {
                                configModel.findOne({ serialDevice: serialDevice }, function (err, config) {
                                    var pH_low = config.pH_low;
                                    var pH_hight = config.pH_hight;
                                    var humidity_low = config.humidity_low;
                                    var humidity_hight = config.humidity_hight;
                                    if (((pH < pH_low) || (pH > pH_hight)) && ((humidity < humidity_low) || (humidity > humidity_hight))) {
                                        deviceModel.findOne({ serialDevice: serialDevice }, function (err, device) {
                                            if (err) { console.log(err); }
                                            else {
                                                var token = device.token
                                                settingModel.find({ token: token }).countDocuments(function (err, settingnumber) {
                                                    if (settingnumber != 0) {
                                                        settingModel.findOne({ token: token }, function (err, setting) {
                                                            if (setting.messege == true) {
                                                                userModel.findOne({ token: token }, function (err, user) {
                                                                    if (err) { console.log(err); }
                                                                    else {
                                                                        var device_token = user.device_token;
                                                                        var msg = "ค่า pH และค่าความชื้นผิดปกติ โปรดตรวจสอบ";
                                                                        sendNoti(device_token, serialDevice, msg);
                                                                        console.log("pH and humidity wrong")
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        })
                                    } else if ((pH < pH_low) || (pH > pH_hight)) {
                                        deviceModel.findOne({ serialDevice: serialDevice }, function (err, device) {
                                            if (err) { console.log(err); }
                                            else {
                                                var token = device.token
                                                settingModel.find({ token: token }).countDocuments(function (err, settingnumber) {
                                                    if (settingnumber != 0) {
                                                        settingModel.findOne({ token: token }, function (err, setting) {
                                                            if (setting.messege == true) {
                                                                userModel.findOne({ token: token }, function (err, user) {
                                                                    if (err) { console.log(err); }
                                                                    else {
                                                                        var device_token = user.device_token;
                                                                        var msg = "ค่า pH ผิดปกติ โปรดตรวจสอบ";
                                                                        sendNoti(device_token, serialDevice, msg);
                                                                        console.log("pH wrong")
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        })
                                    } else if ((humidity < humidity_low) || (humidity > humidity_hight)) {
                                        deviceModel.findOne({ serialDevice: serialDevice }, function (err, device) {
                                            if (err) { console.log(err); }
                                            else {
                                                var token = device.token
                                                settingModel.find({ token: token }).countDocuments(function (err, settingnumber) {
                                                    if (settingnumber != 0) {
                                                        settingModel.findOne({ token: token }, function (err, setting) {
                                                            if (setting.messege == true) {
                                                                userModel.findOne({ token: token }, function (err, user) {
                                                                    if (err) { console.log(err); }
                                                                    else {
                                                                        var device_token = user.device_token;
                                                                        var msg = "ค่าความชื้นผิดปกติ โปรดตรวจสอบ";
                                                                        sendNoti(device_token, serialDevice, msg);
                                                                        console.log("humidity wrong")
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        })
                                    } else {
                                        console.log("Normal pH and humidity")
                                    }
                                });
                            } else {
                                console.log("device not yet config");
                            }
                        });
                    } else {
                        console.log("Noti less one hours");
                    }
                });
            } else {
                configModel.find({ serialDevice: serialDevice }).countDocuments(function (err, number) {
                    if (number != 0) {
                        configModel.findOne({ serialDevice: serialDevice }, function (err, config) {
                            var pH_low = config.pH_low;
                            var pH_hight = config.pH_hight;
                            var humidity_low = config.humidity_low;
                            var humidity_hight = config.humidity_hight;
                            if (((pH < pH_low) || (pH > pH_hight)) && ((humidity < humidity_low) || (humidity > humidity_hight))) {
                                deviceModel.findOne({ serialDevice: serialDevice }, function (err, device) {
                                    if (err) { console.log(err); }
                                    else {
                                        var token = device.token
                                        settingModel.find({ token: token }).countDocuments(function (err, settingnumber) {
                                            if (settingnumber != 0) {
                                                settingModel.findOne({ token: token }, function (err, setting) {
                                                    if (setting.messege == true) {
                                                        userModel.findOne({ token: token }, function (err, user) {
                                                            if (err) { console.log(err); }
                                                            else {
                                                                var device_token = user.device_token;
                                                                var msg = "ค่า pH และค่าความชื้นผิดปกติ โปรดตรวจสอบ";
                                                                sendNoti(device_token, serialDevice, msg);
                                                                console.log("pH and humidity wrong")
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                })
                            } else if ((pH < pH_low) || (pH > pH_hight)) {
                                deviceModel.findOne({ serialDevice: serialDevice }, function (err, device) {
                                    if (err) { console.log(err); }
                                    else {
                                        var token = device.token
                                        settingModel.find({ token: token }).countDocuments(function (err, settingnumber) {
                                            if (settingnumber != 0) {
                                                settingModel.findOne({ token: token }, function (err, setting) {
                                                    if (setting.messege == true) {
                                                        userModel.findOne({ token: token }, function (err, user) {
                                                            if (err) { console.log(err); }
                                                            else {
                                                                var device_token = user.device_token;
                                                                var msg = "ค่า pH ผิดปกติ โปรดตรวจสอบ";
                                                                sendNoti(device_token, serialDevice, msg);
                                                                console.log("pH wrong")
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                })
                            } else if ((humidity < humidity_low) || (humidity > humidity_hight)) {
                                deviceModel.findOne({ serialDevice: serialDevice }, function (err, device) {
                                    if (err) { console.log(err); }
                                    else {
                                        var token = device.token
                                        settingModel.find({ token: token }).countDocuments(function (err, settingnumber) {
                                            if (settingnumber != 0) {
                                                settingModel.findOne({ token: token }, function (err, setting) {
                                                    if (setting.messege == true) {
                                                        userModel.findOne({ token: token }, function (err, user) {
                                                            if (err) { console.log(err); }
                                                            else {
                                                                var device_token = user.device_token;
                                                                var msg = "ค่าความชื้นผิดปกติ โปรดตรวจสอบ";
                                                                sendNoti(device_token, serialDevice, msg);
                                                                console.log("humidity wrong")
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                })
                            } else {
                                console.log("Normal pH and humidity")
                            }
                        });
                    } else {
                        console.log("device not yet config");
                    }
                });
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
            if (pump != sen_sort.pump) {
                if (pump == '0') {
                    deviceModel.findOne({ serialDevice: serialDevice }, function (err, device) {
                        if (err) { console.log(err); }
                        else {
                            var token = device.token
                            settingModel.find({ token: token }).countDocuments(function (err, settingnumber) {
                                if (settingnumber != 0) {
                                    settingModel.findOne({ token: token }, function (err, setting) {
                                        if (setting.messege == true) {
                                            userModel.findOne({ token: token }, function (err, user) {
                                                if (err) { console.log(err); }
                                                else {
                                                    var device_token = user.device_token;
                                                    var msg = "ปิดการใช้งานปั้มน้ำ";
                                                    sendNoti_pump(device_token, serialDevice, msg);
                                                    console.log("Close Pump")
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    })
                } else if (pump == '1') {
                    deviceModel.findOne({ serialDevice: serialDevice }, function (err, device) {
                        if (err) { console.log(err); }
                        else {
                            var token = device.token
                            settingModel.find({ token: token }).countDocuments(function (err, settingnumber) {
                                if (settingnumber != 0) {
                                    settingModel.findOne({ token: token }, function (err, setting) {
                                        if (setting.messege == true) {
                                            userModel.findOne({ token: token }, function (err, user) {
                                                if (err) { console.log(err); }
                                                else {
                                                    var device_token = user.device_token;
                                                    var msg = "เปิดการใช้งานปั้มน้ำ";
                                                    sendNoti_pump(device_token, serialDevice, msg);
                                                    console.log("Open Pump")
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    })
                }
            } else {
                console.log("Normal Pump")
            }
        })
    } else {
        console.log("Send to lora");
    }
});


senserRouter.route('/add_test').post(function (req, res) {
    var pH = req.body.pH;
    var humidity = req.body.moisture;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var pump = req.body.pump;
    var serialDevice = req.body.IMEI;
    notiModel.find({ serialDevice: serialDevice }).countDocuments(function (err, noitnumber) {
        if (noitnumber != 0) {
            notiModel.findOne({ serialDevice: serialDevice }).sort({ '_id': -1 }).exec(function (err, noti) {
                var date_last_noti = noti.date;
                var date_now = moment();
                var date_next_noti = moment(date_last_noti).add(1, 'hours');
                // console.log("Last " + date_last_noti);
                console.log("Now " + date_now);
                console.log("Next " + date_next_noti);
                if (date_next_noti < date_now) {
                    configModel.find({ serialDevice: serialDevice }).countDocuments(function (err, number) {
                        if (number != 0) {
                            configModel.findOne({ serialDevice: serialDevice }, function (err, config) {
                                var pH_low = config.pH_low;
                                var pH_hight = config.pH_hight;
                                var humidity_low = config.humidity_low;
                                var humidity_hight = config.humidity_hight;
                                if (((pH < pH_low) || (pH > pH_hight)) && ((humidity < humidity_low) || (humidity > humidity_hight))) {
                                    deviceModel.findOne({ serialDevice: serialDevice }, function (err, device) {
                                        if (err) { console.log(err); }
                                        else {
                                            var token = device.token
                                            settingModel.find({ token: token }).countDocuments(function (err, settingnumber) {
                                                if (settingnumber != 0) {
                                                    settingModel.findOne({ token: token }, function (err, setting) {
                                                        if (setting.messege == true) {
                                                            userModel.findOne({ token: token }, function (err, user) {
                                                                if (err) { console.log(err); }
                                                                else {
                                                                    var device_token = user.device_token;
                                                                    var msg = "ค่า pH และค่าความชื้นผิดปกติ โปรดตรวจสอบ";
                                                                    sendNoti(device_token, serialDevice, msg);
                                                                    console.log("pH and humidity wrong")
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    })
                                } else if ((pH < pH_low) || (pH > pH_hight)) {
                                    deviceModel.findOne({ serialDevice: serialDevice }, function (err, device) {
                                        if (err) { console.log(err); }
                                        else {
                                            var token = device.token
                                            settingModel.find({ token: token }).countDocuments(function (err, settingnumber) {
                                                if (settingnumber != 0) {
                                                    settingModel.findOne({ token: token }, function (err, setting) {
                                                        if (setting.messege == true) {
                                                            userModel.findOne({ token: token }, function (err, user) {
                                                                if (err) { console.log(err); }
                                                                else {
                                                                    var device_token = user.device_token;
                                                                    var msg = "ค่า pH ผิดปกติ โปรดตรวจสอบ";
                                                                    sendNoti(device_token, serialDevice, msg);
                                                                    console.log("pH wrong")
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    })
                                } else if ((humidity < humidity_low) || (humidity > humidity_hight)) {
                                    deviceModel.findOne({ serialDevice: serialDevice }, function (err, device) {
                                        if (err) { console.log(err); }
                                        else {
                                            var token = device.token
                                            settingModel.find({ token: token }).countDocuments(function (err, settingnumber) {
                                                if (settingnumber != 0) {
                                                    settingModel.findOne({ token: token }, function (err, setting) {
                                                        if (setting.messege == true) {
                                                            userModel.findOne({ token: token }, function (err, user) {
                                                                if (err) { console.log(err); }
                                                                else {
                                                                    var device_token = user.device_token;
                                                                    var msg = "ค่าความชื้นผิดปกติ โปรดตรวจสอบ";
                                                                    sendNoti(device_token, serialDevice, msg);
                                                                    console.log("humidity wrong")
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    })
                                } else {
                                    console.log("Normal pH and humidity")
                                }
                            });
                        } else {
                            console.log("device not yet config");
                        }
                    });
                } else {
                    console.log("Noti less one hours");
                }
            });
        } else {
            configModel.find({ serialDevice: serialDevice }).countDocuments(function (err, number) {
                if (number != 0) {
                    configModel.findOne({ serialDevice: serialDevice }, function (err, config) {
                        var pH_low = config.pH_low;
                        var pH_hight = config.pH_hight;
                        var humidity_low = config.humidity_low;
                        var humidity_hight = config.humidity_hight;
                        if (((pH < pH_low) || (pH > pH_hight)) && ((humidity < humidity_low) || (humidity > humidity_hight))) {
                            deviceModel.findOne({ serialDevice: serialDevice }, function (err, device) {
                                if (err) { console.log(err); }
                                else {
                                    var token = device.token
                                    settingModel.find({ token: token }).countDocuments(function (err, settingnumber) {
                                        if (settingnumber != 0) {
                                            settingModel.findOne({ token: token }, function (err, setting) {
                                                if (setting.messege == true) {
                                                    userModel.findOne({ token: token }, function (err, user) {
                                                        if (err) { console.log(err); }
                                                        else {
                                                            var device_token = user.device_token;
                                                            var msg = "ค่า pH และค่าความชื้นผิดปกติ โปรดตรวจสอบ";
                                                            sendNoti(device_token, serialDevice, msg);
                                                            console.log("pH and humidity wrong")
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            })
                        } else if ((pH < pH_low) || (pH > pH_hight)) {
                            deviceModel.findOne({ serialDevice: serialDevice }, function (err, device) {
                                if (err) { console.log(err); }
                                else {
                                    var token = device.token
                                    settingModel.find({ token: token }).countDocuments(function (err, settingnumber) {
                                        if (settingnumber != 0) {
                                            settingModel.findOne({ token: token }, function (err, setting) {
                                                if (setting.messege == true) {
                                                    userModel.findOne({ token: token }, function (err, user) {
                                                        if (err) { console.log(err); }
                                                        else {
                                                            var device_token = user.device_token;
                                                            var msg = "ค่า pH ผิดปกติ โปรดตรวจสอบ";
                                                            sendNoti(device_token, serialDevice, msg);
                                                            console.log("pH wrong")
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            })
                        } else if ((humidity < humidity_low) || (humidity > humidity_hight)) {
                            deviceModel.findOne({ serialDevice: serialDevice }, function (err, device) {
                                if (err) { console.log(err); }
                                else {
                                    var token = device.token
                                    settingModel.find({ token: token }).countDocuments(function (err, settingnumber) {
                                        if (settingnumber != 0) {
                                            settingModel.findOne({ token: token }, function (err, setting) {
                                                if (setting.messege == true) {
                                                    userModel.findOne({ token: token }, function (err, user) {
                                                        if (err) { console.log(err); }
                                                        else {
                                                            var device_token = user.device_token;
                                                            var msg = "ค่าความชื้นผิดปกติ โปรดตรวจสอบ";
                                                            sendNoti(device_token, serialDevice, msg);
                                                            console.log("humidity wrong")
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            })
                        } else {
                            console.log("Normal pH and humidity")
                        }
                    });
                } else {
                    console.log("device not yet config");
                }
            });
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
        if (pump != sen_sort.pump) {
            if (pump == '0') {
                deviceModel.findOne({ serialDevice: serialDevice }, function (err, device) {
                    if (err) { console.log(err); }
                    else {
                        var token = device.token
                        settingModel.find({ token: token }).countDocuments(function (err, settingnumber) {
                            if (settingnumber != 0) {
                                settingModel.findOne({ token: token }, function (err, setting) {
                                    if (setting.messege == true) {
                                        userModel.findOne({ token: token }, function (err, user) {
                                            if (err) { console.log(err); }
                                            else {
                                                var device_token = user.device_token;
                                                var msg = "ปิดการใช้งานปั้มน้ำ";
                                                sendNoti_pump(device_token, serialDevice, msg);
                                                console.log("Close Pump")
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                })
            } else if (pump == '1') {
                deviceModel.findOne({ serialDevice: serialDevice }, function (err, device) {
                    if (err) { console.log(err); }
                    else {
                        var token = device.token
                        settingModel.find({ token: token }).countDocuments(function (err, settingnumber) {
                            if (settingnumber != 0) {
                                settingModel.findOne({ token: token }, function (err, setting) {
                                    if (setting.messege == true) {
                                        userModel.findOne({ token: token }, function (err, user) {
                                            if (err) { console.log(err); }
                                            else {
                                                var device_token = user.device_token;
                                                var msg = "เปิดการใช้งานปั้มน้ำ";
                                                sendNoti_pump(device_token, serialDevice, msg);
                                                console.log("Open Pump")
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                })
            }
        } else {
            console.log("Normal Pump")
        }
    })
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

senserRouter.route('/noit').post(function (req, res) {
    // var devive_EUI = req.body.devive_EUI;
    // var port = req.body.port;
    // var status = req.body.status;
    var url = "https://fcm.googleapis.com/fcm/send";
    var options = {
        'method': 'POST',
        'url': url,
        'headers': {
            'Authorization': 'key=AAAATIebnog:APA91bHWCX1dfBfhtlyCers4LYMyWjzG-d7khFBUIOA2mxBEWwYbTDu6taGMDb5pbhjiRJu9H-h1FvdEye6gFV5jhOE4wcpEIOp5Kv5yoIn3RfTL-AYHoojgX4loaqc-KbSHjwlr-MYz',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "to": "fWws1q2BAGU:APA91bHyKflf8Z9BpKv6TraZQWwkRKqKTgJgXBYGuqLoVxd3sloNzfFrjeZmtMmCbjBMfNnlHOmMORvy7ivTyQQ2gvCH6VFn9D3wDNJSZNkj4C0onXh8SedMU8TQg2X5A90j6xsUxT8E",
            "collapse_key": "type_a",
            "notification": {
                "body": "อุปกรณ์รหัส .... ค่าความชื้นผิดปกติ",
                "title": "ผิดปกติ"
            }
        })
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        var noit = JSON.parse(response.body);
        console.log(response.body);
        res.json(noit);
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

function sendNoti(device_token, device, msg) {
    var url = "https://fcm.googleapis.com/fcm/send";
    var messege = "อุปกรณ์รหัส " + device + " " + msg;
    var options = {
        'method': 'POST',
        'url': url,
        'headers': {
            'Authorization': 'key=AAAATIebnog:APA91bHWCX1dfBfhtlyCers4LYMyWjzG-d7khFBUIOA2mxBEWwYbTDu6taGMDb5pbhjiRJu9H-h1FvdEye6gFV5jhOE4wcpEIOp5Kv5yoIn3RfTL-AYHoojgX4loaqc-KbSHjwlr-MYz',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "to": device_token,
            "collapse_key": "type_a",
            "notification": {
                "body": messege,
                "title": "ผิดปกติ"
            }
        })
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        var noit = JSON.parse(response.body);
        var insertDataNoti = {
            'serialDevice': device,
            'msg': messege
        };

        const noti = new notiModel(insertDataNoti);
        noti.save()
            .then(noti2 => {
                console.log('Save noti success');
                // console.log(noit);
            })
            .catch(err => {
                console.log("unable to save to database");
            });
    });
}

function sendNoti_pump(device_token, device, msg) {
    var url = "https://fcm.googleapis.com/fcm/send";
    var messege = "อุปกรณ์รหัส " + device + " " + msg;
    var options = {
        'method': 'POST',
        'url': url,
        'headers': {
            'Authorization': 'key=AAAATIebnog:APA91bHWCX1dfBfhtlyCers4LYMyWjzG-d7khFBUIOA2mxBEWwYbTDu6taGMDb5pbhjiRJu9H-h1FvdEye6gFV5jhOE4wcpEIOp5Kv5yoIn3RfTL-AYHoojgX4loaqc-KbSHjwlr-MYz',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "to": device_token,
            "collapse_key": "type_a",
            "notification": {
                "body": messege,
                "title": "สถานะปั้มน้ำ"
            }
        })
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        var noit = JSON.parse(response.body);
        console.log(response.body);
    });
}

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