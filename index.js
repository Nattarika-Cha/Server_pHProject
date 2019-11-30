// var mongodb = require('mongodb');
// var ObjectID = mongodb.ObjectID;
// var crypto = require('crypto');
// var express = require('express');
// var bodyParser = require('body-parser');

// var genRandomString = function (length) {
//     return crypto.randomBytes(Math.ceil(length / 2))
//         .toString('hex')
//         .slice(0, length);
// };

// var sha512 = function (password, salt) {
//     var hash = crypto.createHmac('sha512', salt);
//     hash.update(password);
//     var value = hash.digest('hex');
//     return {
//         salt: salt,
//         passwordHash: value
//     };
// };

// function saltHashPassword(userPassword) {
//     var salt = genRandomString(16);
//     var passwordData = sha512(userPassword, salt);
//     return passwordData;
// }

// function checkHashPassword(userPassword, salt) {
//     var passwordData = sha512(userPassword, salt);
//     return passwordData;
// }

// var app = express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// var MongoClient = mongodb.MongoClient;

// var url = 'mongodb://localhost:27017'

// MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
//     if (err)
//         console.log('Unable to connect to the mongoDB server.Erroe', err);
//     else {

//         app.get('/test', (request, response,)=> {
//             var test = {
//                 fname: 'Sompot',
//                 lname: 'Satongngak'
//             }
//             response.send(test);
//         });

//         app.post('/register', (request, response, next) => {
//             var post_data = request.body;

//             var plaint_password = post_data.password;
//             var hash_data = saltHashPassword(plaint_password);

//             var password = hash_data.passwordHash;
//             var salt = hash_data.salt;

//             var fname = post_data.fname;
//             var lname = post_data.lname;
//             var sex = post_data.sex;
//             var username = post_data.username;

//             var insertJson = {
//                 'username': username,
//                 'password': password,
//                 'fname': fname,
//                 'lname': lname,
//                 'sex': sex,
//                 'salt': salt
//             };
//             var db = client.db('project')

//             db.collection('user')
//                 .find({ 'username': username }).count(function (err, number) {
//                     if (number != 0) {
//                         response.json('Email already emists');
//                         console.log('Email already exists');
//                     }
//                     else {
//                         db.collection('user')
//                             .insertOne(insertJson, function (error, res) {
//                                 response.json('Registration success');
//                                 console.log('Registration success');
//                             })
//                     }
//                 })
//         });

//         app.post('/login', (request, response, next) => {
//             var post_data = request.body;

//             var username = post_data.username;
//             var userPassword = post_data.password;

//             var db = client.db('project')

//             db.collection('user')
//                 .find({ 'username': username }).count(function (err, number) {
//                     if (number == 0) {
//                         response.json('๊Username not exists');
//                         console.log('Email not exists');
//                     }
//                     else {
//                         db.collection('user')
//                             .findOne({ 'username': username }, function (err, user) {
//                                 var salt = user.salt;
//                                 var hashed_password = checkHashPassword(userPassword, salt).passwordHash;
//                                 var encrypted_password = user.password;
//                                 if (hashed_password == encrypted_password) {
//                                     response.json('Login success');
//                                     console.log('Login success');
//                                 } else {
//                                     response.json('Wrong password');
//                                     console.log('Wrong password');
//                                 }
//                             })
//                     }
//                 })
//         });

//         app.listen(3000, () => {
//             console.log('Connected to MongoDB Server , WebService running on post 3000');
//         })
//     }
// });

const express = require('express');

const app = express();

// [START hello_world]
// Say hello!
app.get('/', (req, res) => {
  res.status(200).send('Hello, world!');
});
// [END hello_world]

if (module === require.main) {
  // [START server]
  // Start the server
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
  // [END server]
}

module.exports = app;

