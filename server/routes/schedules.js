var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

/* POST request for adding a class to schedule */
router.post('/add',function(req, res, next) {
    res.send('respond with a resource');
});

/* POST request for removing a class to schedule */
router.post('/remove',function(req, res, next) {
    res.send('respond with a resource');
});


module.exports = router;
