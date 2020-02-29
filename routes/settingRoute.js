const express = require('express');
const app = express();
const settingRouter = express.Router();

const settingModel = require('../model/settingModel');

settingRouter.route('/add_setting').post(function (req, res) {
    var token = req.body.token;
    settingModel.find({ 'token': token }).countDocuments(function (err, number) {
        if (number == 0) {
            console.log("Message : " + req.body.messege);
            console.log("GPS : " + req.body.gps);
            var insertSetting = {
                // 'sound': req.body.sound,
                'messege': req.body.messege,
                'gps': req.body.gps,
                'token': req.body.token
            };

            const setting = new settingModel(insertSetting);
            setting.save()
                .then(setting => {
                    res.json('Save success');
                })
                .catch(err => {
                    res.status(400).send("unable to save to database");
                });
        }
        else {
            settingModel.findOne({ 'token': token }, function (err, setting) {
                // setting.sound = req.body.sound;
                console.log("Message : " + req.body.messege);
                console.log("GPS : " + req.body.gps);
                setting.messege = req.body.messege;
                setting.gps = req.body.gps;
                setting.save()
                    .then(setting => {
                        res.json('Edit setting success');
                    })
                    .catch(err => {
                        res.status(400).send("unable edit setting to database");
                    });
            });
        }
    });
});

settingRouter.route('/get_setting').get(function (req, res) {
    settingModel.findOne({ token: req.query.token }, function (err, setting) {
        if (err) {
            console.log(err);
        }
        else {
            res.json(setting);
        }
    });
});

module.exports = settingRouter;