var express = require('express');
var router = express.Router();

var course_models = require("../models/course_models")
var courseModel = course_models.courseModel;
var Courses = course_models.Courses
/* GET request for course listings based on parameters */

var professors_model = require("../models/professors_model")
var Professors = professors_model.Professors

router.get('/', function(req, res, next) {
    var query_args = req.query;

    courseModel.controller(res, query_args);
});
router.post('/addCourses', function(req, res, next) {
    Courses.create(req.body).then(function(){
        res.send("Done")

    }).catch(function(err){
        console.log(err)
        res.send("Done")
    })
});

router.post('/addProfessor', function(req, res, next) {
    Professors.create(req.body).then(function(){
        res.send("Done")
    }).catch(function(err){
        console.log(err)
        res.send("Done")
    })
});


module.exports = router;
