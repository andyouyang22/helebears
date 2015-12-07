/**
 * Created by nirshtern on 12/5/15.
 */

var readline = require('readline');


var OAuth2Client = google.auth.OAuth2;
//var plus = google.plus('v1');

// Client ID and client secret are available at
// https://code.google.com/apis/console
var CLIENT_ID = '753668621131-guo991t7lr2a7dasfpjjb3p6qvcvea5l.apps.googleusercontent.com';
var CLIENT_SECRET = 'ND3UzEAAZICIhj7pxI5s-jNS';
var REDIRECT_URL = 'localhost:3000/profile';

var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getAccessToken(code,oauth2Client, callback) {
    // generate consent page url
    var url = oauth2Client.generateAuthUrl({
        //access_type: 'offline', // will return a refresh token
        scope: 'https://www.googleapis.com/auth/calendar' // can be a space-delimited string or an array of scopes
    });

    console.log('Visit the url: ', url);
    rl.question('Enter the code here:', function(code) {
        // request access token
        oauth2Client.getToken(code, function(err, tokens) {
            // set tokens to the client
            // TODO: tokens should be set by OAuth2 client.
            oauth2Client.setCredentials(tokens);
            callback();
        });
    });
}

//// retrieve an access token
//getAccessToken(oauth2Client, function() {
//    // retrieve user profile
//    plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, profile) {
//        if (err) {
//            console.log('An error occured', err);
//            return;
//        }
//        console.log(profile.displayName, ':', profile.tagline);
//    });
//});