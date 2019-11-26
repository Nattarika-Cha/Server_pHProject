const express = require('express');
const app = express();

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const request = require('request')

const config = require('./db');
const PORT = 5000;

const cors = require('cors');

mongoose.connect(config.DB, { useNewUrlParser: true }).then(
    () => { console.log('Database is connected') },
    err => { console.log('Can not connect to the database' + err) }
);

const registerRouter = require('./routes/registerRoute');

// const registerModel = require('./model/registerModel');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(
    bodyParser.urlencoded({
        extended: false
    })
)

app.use('/user', registerRouter);

app.get('/', function (req, res) {
    console.log("testtt");
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});

