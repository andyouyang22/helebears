var express = require('express');

/* GET home page. */
module.exports = function(app, passport) {

    app.get('/',function(req, res) {
        // Load the index.ejs file
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    app.get('/login', function(req, res) {
        // Render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // Process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/homepage', // Redirect to the secure profile section
        failureRedirect : '/login',    // Redirect back to the login page if error
        failureFlash : true            // Allow flash messages
    }));

    app.get('/signup', function(req, res) {
        // Render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // Process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/homepage',  // Redirect to the secure profile section
        failureRedirect : '/signup', // Redirect back to the signup page if error
        failureFlash : true          // Allow flash messages
    }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/homepage',
            failureRedirect : '/'
        }));



// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
    app.get('/connect/local', function(req, res) {
        res.render('connect-local.ejs', { message: req.flash('loginMessage') });
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect : '/homepage', // redirect to the secure profile section
        failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // google ---------------------------------
    // send to google to do the authentication
    app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

    // the callback after google has authorized the user
    app.get('/connect/google/callback',
        passport.authorize('google', {
            successRedirect : '/homepage',
            failureRedirect : '/'
        }));

    // =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', function(req, res) {
        var user            = req.user;
        user.email    = undefined;
        user.password = undefined;
        user.save().then(function() {
            res.redirect('/homepage');
        });
    });

    app.get('/unlink/google', function(req, res) {
        var user          = req.user;
        user.googletoken = undefined;
        user.save().then(function() {
            res.redirect('/homepage');
        });
    });


    //==============================
    //==============================

    app.get('/homepage', isLoggedIn, function(req, res, next) {
        next();
    });

    app.use('/homepage',express.static(__dirname + '/../static'));

    // Route middleware to make sure a user is logged in
};

function isLoggedIn(req, res, next) {
    // If user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // If they aren't redirect them to the home page
    res.redirect('/');
}


