/**
 * Created by nirshtern on 10/31/15.
 */

// load all the things we need
var kickbox = require('kickbox').client('604455ed1e1afa7e76631c71e1151f114de11d62f255295543042ff8bf3a3d70').kickbox();
var LocalStrategy   = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
var user_model = require('../models/user_model');
var Users = user_model.Users;
var UserMethods = user_model.UserMethods;

// loads the auth variables
var configAuth = require('./auth');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and deserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.dataValues);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        //Users.findOne(id, function(err, user) {
        //    done(err, user);
        //});

        Users.findOne({ where:{id : user.id }
        }).then(function(user) {
            done(null,user)
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {

            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function() {

                if(email.indexOf("@berkeley.edu") < 0){
                    return done(null, false, req.flash('signupMessage', 'Must be a @berkeley.edu email account'));
                }
                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                Users.findOne({ where:{email :  email }
                             }).then(function(localuser) {

                    // check to see if theres already a user with that email
                    if (localuser) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {


                        //  If we're logged in, we're connecting a new local account.
                        if(req.user) {
                            var user = req.user;
                            user.email    = email;
                            user.password = UserMethods.generateHash(password);
                            user.save().then(function() {
                                //if (err)
                                //    throw err;
                                return done(null, user);
                            });
                        }

                        // if there is no user with that email
                        // create the new user and add to the database

                        kickbox.verify(email, function (err, response) {
                            // Let's see some results
                            console.log(response.body);
                            if(response.body.result === 'deliverable'){
                                var newUser = Users.build({email:response.body.email,password: UserMethods.generateHash(password)});
                                newUser.save();
                                return done(null,newUser);
                            } else {
                                return done(null, false, req.flash('signupMessage', response.body.reason));
                            }

                        });

                    }

                });

            });

        }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists

            Users.findOne({ where:{email : email }
            }).then(function(user) {

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

                // if the user is found but the password is wrong
                if (!UserMethods.validPassword(password, user.dataValues.password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, user);

            });

        }));

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

            clientID        : configAuth.googleAuth.clientID,
            clientSecret    : configAuth.googleAuth.clientSecret,
            callbackURL     : configAuth.googleAuth.callbackURL,
            passReqToCallback : true

        },
        function(req, token, refreshToken, profile, done) {

            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Google

            process.nextTick(function() {

                if(!req.user) {

                    // try to find the user based on their google id

                    Users.findOne({
                        where: {googleid: profile.id}
                    }).then(function (user) {

                        // if no user is found, return the message
                        if (user) {
                            return done(null, user); // loging user
                        } else {
                            var newUser = Users.build({
                                googleid: profile.id,
                                googletoken: token,
                                googlename: profile.displayName,
                                googleemail: profile.emails[0].value,
                                email:''
                            });
                            newUser.save();
                            return done(null, newUser);
                        }

                    });

                } else {
                    var user = req.user;

                    user.googleid = profile.id;
                    user.googletoken = token;
                    user.googlename = profile.displayName;
                    user.googleemail = profile.emails[0].value;

                    user.save().then(function() {
                        //if (err)
                        //    throw err;
                        return done(null,user);
                    })
                }

            });

        }));
};

