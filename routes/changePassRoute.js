const express = require('express');
const app = express();
const changePassRouter = express.Router();
const nodemailer = require("nodemailer");

const userModel = require('../model/userModel');
const changePassModel = require('../model/changePassModel');

changePassRouter.route('/forget_pass').post(function (req, res) {
    var email = req.body.email;
    userModel.find({ 'email': email }).countDocuments(function (err, number) {
        if (number == 0) {
            res.json('Email not already');
            console.log('Email not already');
        }
        else {
            var genid = makeid(8);
            var insertChange = {
                'email': email,
                'genid': genid,
                'active': '0'
            };

            const changePass = new changePassModel(insertChange);
            changePass.save()
                .then(changePass => {
                    sendEmail(email,genid).catch(console.error);
                    res.json('Change password success');
                })
                .catch(err => {
                    res.status(400).send("unable to save to database");
                });
        }
    })
});

changePassRouter.route('/chack_confrim').post(function (req, res) {
    var email = req.body.email;
    var genid = req.body.genid;
    changePassModel.findOne({email: email, active: '0'}).sort({'_id': -1}).exec(function (err, confrim) {
        if (confrim != null) {
            if (confrim.genid == genid) {
                confrim.active = '1';
                confrim.save()
                    .then(confrim => {
                        res.json('Confrim success');
                    })
                    .catch(err => {
                        res.status(400).send("unable Confrim to database");
                    });
            } else {
                res.json('Genid Not Correct');
            }
        }
        else {
            res.json('Not confrim');
        }
    })
});

async function sendEmail(email,genid) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'Easyfarmsmart2020@gmail.com',
            pass: 'Easyfarmsmart1234'
        }
    });

    transporter.sendMail({
        from: '"Easy Farm Smart Support" <Easyfarmsmart2020@gmail.com>',
        to: email, // list of receivers
        subject: "เปลี่ยนรหัสผ่าน", // Subject line
        text: "รหัสยืนยันตัวตน คือ " + genid , // plain text body
        html: "<b>รหัสยืนยันตัวตน คือ " + genid + "</b>" // html body
    }, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info);
        }
    });

    // console.log("Message sent: %s", info.messageId);
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = changePassRouter;
