var express = require('express');
var router = express.Router();

var schedules_model = require("../models/schedule_model")
var scheduleModel = schedules_model.scheduleModel
var course_models = require("../models/course_models")
var courseModel = course_models.courseModel;
/* GET users listing. */
router.get('/', function(req, res, next) {
    if("user" in req) {
        scheduleModel.controller(req.user.dataValues.email, 'get', res)
    }
    else{
        res.json({status:-1, errors: ["No user object sent"]})
    }
});

/* POST request for adding a class to schedule */
router.post('/add',function(req, res, next) {
    if(!("user" in req)) {
        res.json({status:-1, errors: ["No user object sent"]})
    }
    if(!("name_and_number" in req.body)) {
        res.json({status:-1, errors: ["name_and_number not sent with post request's body"]})
    }
    else{
        req.body.unique_id = req.user.dataValues.email;
        courseModel.aggregateRecommendations(req.body, res)
    }
});

/* POST request for removing a class to schedule */
router.post('/remove',function(req, res, next) {
    if(!("user" in req)) {
        res.json({status:-1, errors: ["No user object sent"]})
    }
    if(!("name_and_number" in req.body)) {
        res.json({status:-1, errors: ["name_and_number not sent with post request's body"]})
    }
    else{
        req.body.unique_id = req.user.dataValues.email
        scheduleModel.removeQuery(req.body, res)
    }
});


module.exports = router;
