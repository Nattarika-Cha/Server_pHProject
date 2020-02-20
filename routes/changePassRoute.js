const express = require('express');
const app = express();
const changePassRouter = express.Router();
var crypto = require('crypto');
var rand = require('csprng');
const nodemailer = require("nodemailer");

const userModel = require('../model/userModel');
const changePassModel = require('../model/changePassModel');

var genRandomString = function (length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};

var sha512 = function (password, salt) {
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
};

function saltHashPassword(userPassword) {
    var salt = genRandomString(16);
    var passwordData = sha512(userPassword, salt);
    return passwordData;
}

function checkHashPassword(userPassword, salt) {
    var passwordData = sha512(userPassword, salt);
    return passwordData;
}

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

            console.log(insertChange);
            const changePass = new changePassModel(insertChange);
            changePass.save()
                .then(changePass => {
                    console.log("testtt");
                    sendEmail(email).catch(console.error);
                    res.json('Change password success');
                })
                .catch(err => {
                    res.status(400).send("unable to save to database");
                });
        }
    })
});

async function sendEmail(email) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'Easyfarmsmart2020@gmail.com',
            pass: 'Easyfarmsmart1234'
        }
    });

    console.log("testtt");
    transporter.sendMail({
        from: '"Easy Farm Smart Support" <Easyfarmsmart2020@gmail.com>',
        to: email, // list of receivers
        subject: "เปลี่ยนรหัสผ่าน", // Subject line
        text: "รหัสยืนยันตัวตน คือ " , // plain text body
        html: "<b>รหัสยืนยันตัวตน คือ </b>" // html body
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
