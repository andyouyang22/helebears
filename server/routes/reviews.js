var express = require('express');
var router = express.Router();

/* GET request for getting reviews of a specific professor */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

/* POST request for creating a review for a professor */
router.post('/create',function(req, res, next) {
    res.send('respond with a resource');
});


module.exports = router;
