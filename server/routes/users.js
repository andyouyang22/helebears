var express = require('express');
var router = express.Router();



var user_models = require("../models/user_model")
/* Handles POST signup request*/
router.post('/signup', function(req, res, next) {
  res.send('respond with a resource');
});

/* Handles POST login request*/
router.post('/login', function(req,res,next) {
    res.send('Future iteration implementation');
});

module.exports = router;
