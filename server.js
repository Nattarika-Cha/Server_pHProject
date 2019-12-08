const express = require('express');
const app = express();

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const request = require('request')

const config = require('./db');
const PORT = 8080;

const cors = require('cors');

mongoose.connect(config.DB, { useNewUrlParser: true }).then(
    () => { console.log('Database is connected') },
    err => { console.log('Can not connect to the database' + err) }
);

const userRouter = require('./routes/userRoute');

// const registerModel = require('./model/registerModel');

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
    res.json('test path /');
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});

