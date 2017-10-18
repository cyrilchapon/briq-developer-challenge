var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var boom = require('boom');

var index = require('./routes/index');
var users = require('./routes/users');
var transactions = require('./routes/transactions');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/transactions', transactions);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(boom.notFound());
});

// error handler
app.use(require('./errors/sequelizeToBoom'));
app.use(require('./errors/boomHandler'));
app.use(require('./errors/finalHandler'));

module.exports = app;
