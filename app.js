var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var appRoutes = require('./routes/app');
var accountRoutes = require('./routes/account');

var app = express();
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bank');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

app.use('/account', accountRoutes);
app.use('/', appRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
 res.status(404).json({
  title: "404 not found",
  error: {message: 'Invalid request path'}
 });
});

module.exports = app;
