var express = require('express');
var router = express.Router();

var course_models = require("../models/course_models")
var courseModel = course_models.courseModel


/* GET request for course listings based on parameters */
router.get('/', function(req, res, next) {
    var query_args = req.query;
    if(! "department" in query_args){
    	res.json({status:-1, errors:["Department not properly sent"]})
    }
    else{
    	
    	filter = {department_name: query_args["department"]}
    	courseModel.controller(res, filter)
    }

});

module.exports = router;
