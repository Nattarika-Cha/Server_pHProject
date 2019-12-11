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

const userRouter = require('./routes/userRoute');

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
    console.log(msg);
    var data = toString(msg).split(",").map(val => val + 1);
    console.log(toString(msg).split(",").map(val => val + 1));
    console.log(JSON.stringify(data));
    console.log(data);
    console.log(data[0]);
    console.log(data[1]);
    console.log(data[2]);
    console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
    var ack = new Buffer("Hello ack");
    server.send(ack, 0, ack.length, rinfo.port, rinfo.address, function (err, bytes) {
        console.log("sent ACK.");
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