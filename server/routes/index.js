var express = require('express');

/* GET home page. */
module.exports = function(app, passport) {

    app.get('/',function(req, res) {
        // Load the index.ejs file
        res.render('index.ejs');
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
        successRedirect : '/login',  // Redirect to the secure profile section
        failureRedirect : '/signup', // Redirect back to the signup page if error
        failureFlash : true          // Allow flash messages
    }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // Get the user out of session and pass to template
        });
    });

    app.get('/homepage', isLoggedIn, function(req, res, next) {
        next();
    });

    app.use('/homepage',express.static(__dirname + '/../static'));

    // Route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {
        // If user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return next();

        // If they aren't redirect them to the home page
        res.redirect('/');
    }
}
