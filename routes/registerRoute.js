const express = require('express');
const app = express();
const registerRouter = express.Router();
var crypto = require('crypto');

const registerModel = require('../model/registerModel');

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

registerRouter.route('/register').post(function (req, res) {
    registerModel.find({ 'username': req.body.username }).countDocuments(function (err, number) {
        if (number != 0) {
            res.json('Email already emists');
            console.log('Email already exists');
        }
        else {
            var plaint_password = req.body.password;
            var hash_data = saltHashPassword(plaint_password);
            var password = hash_data.passwordHash;
            var salt = hash_data.salt;
            var insertRegister = {
                'username': req.body.username,
                'password': password,
                'fname': req.body.fname,
                'lname': req.body.lname,
                'gender': req.body.gender,
                'salt': salt
            };

            const register = new registerModel(insertRegister);
            register.save()
                .then(register => {
                    res.json('Registration success');
                })
                .catch(err => {
                    res.status(400).send("unable to save to database");
                });
        }
    })
});

registerRouter.route('/login').get(function (req, res) {
    console.log("login");
});

module.exports = registerRouter;