const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const request = require('request')
const cors = require('cors');
const PORT = 3030;
const config = require('./db');
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
    () => { console.log('Database is connected') },
    err => { console.log('Can not connect to the database' + err) }
);

//Routes
const userRouter = require('./routes/userRoute');

//Model
const senserModel = require('./model/senserModel');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(
    bodyParser.urlencoded({
        extended: false
    })
)

app.use('/user', userRouter);

app.get('/', function (req, res) {
    console.log(req.headers.host);
    console.log(req.query);
    res.json(req.headers.host + " , " + req.query);
})

// UDP Server
var dgram = require("dgram");
var server = dgram.createSocket("udp4");

server.on("error", function (err) {
    console.log("server error:\n" + err.stack);
    server.close();
});

server.on("message", function (msg, rinfo) {
    var str = "" + msg;
    var data = str.split(",");
    var pH = data[0].split("");
    pH.splice(1,0,".");
    console.log(pH[0]);
    console.log(pH[1]);
    console.log(pH[2]);
    var insertSenser = {
        'pH': pH[0]+pH[1]+pH[2],
        'moisture': data[1],
        'latitude': 'test',
        'longitude': 'test',
        'IMEI': data[2],
    };
    console.log(insertSenser);

    const senser = new senserModel(insertSenser);
    senser.save()
        .then(senser => {
            var ack = new Buffer("Save success");
            server.send(ack, 0, ack.length, rinfo.port, rinfo.address, function (err, bytes) {
                console.log('Save success');
            });
        })
        .catch(err => {
            var ack = new Buffer("unable to save to database");
            server.send(ack, 0, ack.length, rinfo.port, rinfo.address, function (err, bytes) {
                console.log("unable to save to database");
            });
        });
});

server.on("listening", function () {
    var address = server.address();
    console.log("server listening " + address.address + ":" + address.port);
});

server.bind({
    address: '0.0.0.0',
    port: 5001,
    exclusive: true
});
// END UDP Server

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});