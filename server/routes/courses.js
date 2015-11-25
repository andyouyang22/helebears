var express = require('express');
var router = express.Router();

var course_models = require("../models/course_models")
var courseModel = course_models.courseModel;


/* GET request for course listings based on parameters */
router.get('/', function(req, res, next) {
    var query_args = req.query;

    courseModel.controller(res, query_args);
});

module.exports = router;
