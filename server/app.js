var express = require('express');
var google = require('googleapis');
var logger = require('morgan');
var open = require("open");
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var Sequence = exports.Sequence || require('sequence').Sequence
    , sequence = Sequence.create()
    , err
    ;

var users = require('./routes/users');
var courses = require('./routes/courses');
var departments = require('./routes/departments');
var schedules = require('./routes/schedules');
var reviews = require('./routes/reviews');

var schedules_model = require("./models/schedule_model")
var scheduleModel = schedules_model.scheduleModel;
var Schedules = schedules_model.Schedules;

var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');

var app = express();

//Setting google calendar
var calendar = google.calendar('v3');
var CLIENT_ID = '753668621131-guo991t7lr2a7dasfpjjb3p6qvcvea5l.apps.googleusercontent.com';
var CLIENT_SECRET = 'ND3UzEAAZICIhj7pxI5s-jNS';
var REDIRECT_URL = 'http://localhost:3000/calendarauth';

var oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
var authed = false;

app.get('/addtocalendar',function(req,res) {



    if(!authed) {

        var url = oauth2Client.generateAuthUrl({
            //access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/calendar'
        });
        res.redirect(url);

    } else {

        sequence.
            then(function(next) {
            var unique_id = req.query.unique_id;
            next(null, unique_id)
        }).then(function(next, err,unique_id) {
            Schedules.findAll({
                where: {
                    unique_id: {
                        $in: [unique_id]
                    }
                }
            }).then(function(results) {
                var i;
                var events = [];
                for(i = 0; i < results.length;i++){

                    var time = results[i].dataValues.course_time.split(" ");
                    var startTime = time[1].slice(0,2) + ":" + time[1].slice(3) + ":00-07:00";
                    var endTime = time[2].slice(0,2) + ":" + time[2].slice(3) + ":00-07:00";
                    var event = {
                        'summary': results[i].dataValues.name_and_number,
                        'location': results[i].dataValues.location,
                        'start': {
                            'dateTime': startTime,
                            'timeZone': 'America/Los_Angeles',
                        },
                        'end': {
                            'dateTime': endTime,
                            'timeZone': 'America/Los_Angeles',
                        },
                        'recurrence': [
                            'RRULE:FREQ=WEEKLY;BYDAY=' + ''+';UNTIL=20151205T063000Z'
                        ]
                    }
                    events.push(event);
                }
                //if(i === results.length) {
                    next(null, events);
                //}
            });
        }).then(function(next, err,events){
            for(var i=0;i<events.length;i++) {

                calendar.events.insert({
                    auth: oauth2Client,
                    calendarId: 'primary',
                    resource: events[i],
                }, function (err, event) {
                    if (err) {
                        console.log('There was an error contacting the Calendar service: ' + err);
                        return;
                    }
                    console.log('Event created: %s', event.htmlLink);

                });
                next(null);
            }
        }).then(function(next, err){
            res.redirect('/');
            open('https://calendar.google.com/calendar');
            next();
        })

        //var event = {
        //    'summary': 'Google I/O 2015',
        //    'location': '800 Howard St., San Francisco, CA 94103',
        //    'description': 'A chance to hear more about Google\'s developer products.',
        //    'start': {
        //        'dateTime': '2015-08-27T09:00:00-07:00',
        //        'timeZone': 'America/Los_Angeles',
        //    },
        //    'end': {
        //        'dateTime': '2015-08-27T10:00:00-07:00',
        //        'timeZone': 'America/Los_Angeles',
        //    },
        //    'recurrence': [
        //        'RRULE:FREQ=WEEKLY;BYDAY=TU,TH;UNTIL=20151205T063000Z'
        //    ]
        //};
        //
        //var event2 = {
        //    'summary': 'TRY OUT',
        //    'location': '800 Howard St., San Francisco, CA 94103',
        //    'description': 'A chance to hear more about Google\'s developer products.',
        //    'start': {
        //        'dateTime': '2015-08-27T11:00:00-07:00',
        //        'timeZone': 'America/Los_Angeles',
        //    },
        //    'end': {
        //        'dateTime': '2015-08-27T12:00:00-07:00',
        //        'timeZone': 'America/Los_Angeles',
        //    },
        //    'recurrence': [
        //        'RRULE:FREQ=WEEKLY;BYDAY=MO,WE;UNTIL=20151205T063000Z'
        //    ]
        //};
        //
        //var events = [];
        //events.push(event);
        //events.push(event2);
    }
});


app.get('/calendarauth',function(req,res) {
    var code = req.query.code;

    if(code) {

        oauth2Client.getToken(code,function(err, tokens) {
            if(err) {
                console.log('Error authenticating');
                console.log(err);
            } else {
                console.log('Successfully authenticated');
                console.log(tokens);

                //Store our credentials and redirect back to our main page
                oauth2Client.setCredentials(tokens);
                authed = true;
                res.redirect('/addtocalendar');
            }
        })
    }

})
// Set up our Express application
app.use(morgan('dev')); // Log every request to the console
app.use(cookieParser()); // Read cookies (needed for auth)
app.use(bodyParser.json()); // Get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

require('./config/passport')(passport); // Pass passport for configuration

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs'); // Set up ejs for templating

// Required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // Session secret
app.use(passport.initialize());
app.use(passport.session()); // Persistent login sessions
app.use(flash()); // Use connect-flash for flash messages stored in session

// Un-comment after placing favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Load our routes; pass in our app and fully configured passport
require('./routes/index.js')(app, passport);

app.use(express.static(__dirname + "/public"));

app.use('/homepage', express.static(__dirname + '/../static'));
app.use('/api/users', users);
app.use('/api/courses', courses);
app.use('/api/schedules', schedules);
app.use('/api/reviews', reviews);
app.use('/api/departments', departments);

module.exports = app;
