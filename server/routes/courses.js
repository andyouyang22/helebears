var express = require('express');
var router = express.Router();

/* GET request for course listings based on parameters */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;
