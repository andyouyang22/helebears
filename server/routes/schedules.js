var express = require('express');
var router = express.Router();

var schedules_model = require("../models/schedule_model")
var scheduleModel = schedules_model.scheduleModel
/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log(scheduleModel)
    if("user" in req) {
        scheduleModel.controller(req.user.dataValues, 'get', res)
    }
    else{
        res.json({status:-1, errors: ["No user object sent"]})
    }
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
