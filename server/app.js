var express = require('express');
var app = express();

//var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var users = require('./routes/users');
var courses = require('./routes/courses');
var departments = require('./routes/departments');
var schedules = require('./routes/schedules');
var reviews = require('./routes/reviews');

var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

require('./config/passport')(passport); // pass passport for configuration

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

require('./routes/index.js')(app, passport); // load our routes and pass in our app and fully configured passport


//app.use('/',express.static(__dirname + '/../static'));
app.use('/api/users', users);
app.use('/api/courses', courses);
app.use('/api/schedules', schedules);
app.use('/api/reviews', reviews);
app.use('/api/departments',departments);



module.exports = app;
