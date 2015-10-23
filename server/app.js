var express = require('express');
//var path = require('path');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var users = require('./routes/users');
var courses = require('./routes/courses');
var departments = require('./routes/departments');
var schedules = require('./routes/schedules');
var reviews = require('./routes/reviews');

var app = express();


// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(cookieParser());


app.use('/',express.static(__dirname + '/../static'));
app.use('/api/users', users);
app.use('/api/courses', courses);
app.use('/api/schedules', schedules);
app.use('/api/reviews', reviews);
app.use('/api/departments',departments);


module.exports = app;