const express = require('express');
const app = express();
const analyzeRouter = express.Router();

const alyzeModel = require('../model/alyzeModel');

analyzeRouter.route('/analyze').get(function (req, res) {
    alyzeModel.findOne({ pH: req.query.pH, soil_type: req.query.soil_type }, function (err, pH) {
        if (err) {
            console.log(err);
        }
        else {
            res.json(pH);
        }
    });
})