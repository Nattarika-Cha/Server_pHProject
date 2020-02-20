const express = require('express');
const app = express();
const userRouter = express.Router();
var crypto = require('crypto');
var rand = require('csprng');
const nodemailer = require("nodemailer");

const userModel = require('../model/userModel');

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

userRouter.route('/register').post(function (req, res) {
    userModel.find({ 'username': req.body.username }).countDocuments(function (err, number) {
        if (number != 0) {
            res.json('Username already emists');
            console.log('Username already exists');
        }
        else {
            userModel.find({ 'email': req.body.email }).countDocuments(function (err, number_email) {
                if (number_email != 0) {
                    res.json('Email already emists');
                    console.log('Email already exists');
                }
                else {
                    var plaint_password = req.body.password;
                    var hash_data = saltHashPassword(plaint_password);
                    var password = hash_data.passwordHash;
                    var salt = hash_data.salt;

                    //token
                    var token = crypto.createHash('sha512').update(req.body.username + rand).digest("hex")

                    var insertRegister = {
                        'username': req.body.username,
                        'password': password,
                        'email': req.body.email,
                        'fname': req.body.fname,
                        'lname': req.body.lname,
                        'gender': req.body.gender,
                        'image': req.body.image,
                        'token': token,
                        'salt': salt,
                        'active': '0'
                    };

                    console.log(insertRegister);
                    const register = new userModel(insertRegister);
                    register.save()
                        .then(register => {
                            res.json('Registration success');
                        })
                        .catch(err => {
                            res.status(400).send("unable to save to database");
                        });
                }
            })
        }
    })
});

userRouter.route('/login').post(function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    userModel.find({ 'username': username }).countDocuments(function (err, number) {
        if (number == 0) {
            res.json('Email not exists');
            console.log('Email not exists');
        }
        else {
            userModel.findOne({ 'username': username }, function (err, user) {
                var salt = user.salt;
                var hash_password = checkHashPassword(password, salt).passwordHash;
                var encrypted_password = user.password;
                if (hash_password == encrypted_password) {
                    res.json(user);
                    console.log('Login success');
                }
                else {
                    res.json('Wrong password');
                    console.log('Wrong password');
                }
            });
        }
    });
});

userRouter.route('/pro').get(function (req, res) {
    userModel.findOne({ username: req.query.username }, function (err, user) {
        if (err) {
            console.log(err);
        }
        else {
            res.json(user);
        }
    });
});

userRouter.route('/edituser').post(function (req, res) {
    var username = req.body.username;

    userModel.findOne({ username: username }, function (err, user) {
        user.fname = req.body.fname;
        user.lname = req.body.lname;
        user.gender = req.body.gender;
        user.image = req.body.image;
        user.save()
            .then(user => {
                res.json('Edit user success');
            })
            .catch(err => {
                res.status(400).send("unable edit user to database");
            });
    })
});

userRouter.route('/change_pass').post(function (req, res) {
    var username = req.body.username;
    var passwordOld = req.body.passwordOld;
    var passwordNew = req.body.passwordNew;

    userModel.find({ 'username': username }).countDocuments(function (err, number) {
        if (number == 0) {
            res.json('Email not exists');
        }
        else {
            userModel.findOne({ 'username': username }, function (err, user) {
                var salt = user.salt;
                var hash_password = checkHashPassword(passwordOld, salt).passwordHash;
                var encrypted_password = user.password;
                if (hash_password == encrypted_password) {
                    var plaint_password = passwordNew;
                    var hash_data = saltHashPassword(plaint_password);
                    var password_new = hash_data.passwordHash;
                    var salt_new = hash_data.salt;

                    user.password = password_new;
                    user.salt = salt_new;
                    user.save()
                        .then(user => {
                            res.json('Edit password success');
                        })
                        .catch(err => {
                            res.status(400).send("unable edit password to database");
                        });
                }
                else {
                    res.json('Wrong password');
                }
            });
        }
    });
});

userRouter.route('/test_mail').post(function (req, res) {
    main().catch(console.error);
    res.json('Test mail');
});

async function main() {
    //let testAccount = await nodemailer.createTestAccount();
    console.log("testtt")
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // use SSL
        auth: {
            user: 'Easyfarmsmart2020@gmail.com',
            pass: 'Easyfarmsmart1234'
        }
    });

    console.log(transporter)
    let info = await transporter.sendMail({
        from: "Easyfarmsmart2020@gmail.com", // sender address
        to: "they2539@gmail.com, they1996@hotmail.com, s5802041620203@email.kmutnb.ac.th", // list of receivers
        subject: "Change Password", // Subject line
        text: "Hello world?....", // plain text body
        html: "<b>Hello world?....</b>" // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = userRouter;
