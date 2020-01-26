const express = require('express');
const app = express();
const senserRouter = express.Router();

const senserModel = require('../model/senserModel');

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