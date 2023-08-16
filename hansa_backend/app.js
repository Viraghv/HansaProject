const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const boltRouter = require('./routes/boltRouter');
const cikkekRouter = require('./routes/cikkekRouter');
const vasarlasRouter = require('./routes/vasarlasRouter');
const tetelRouter = require('./routes/tetelRouter');


const app = express();

let corsOptions = {
    origin: true,
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
}

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/bolt', boltRouter);
app.use('/cikkek', cikkekRouter);
app.use('/vasarlas', vasarlasRouter);
app.use('/tetel', tetelRouter);

module.exports = app;
