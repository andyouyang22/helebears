var express = require('express');
var router = express.Router();

var course_models = require("../models/course_models")
var courseModel = course_models.courseModel;
var Courses = course_models.Courses
/* GET request for course listings based on parameters */

var professors_model = require("../models/professors_model")
var Professors = professors_model.Professors

var departments_models = require("../models/departments_model")
var departmentModel = departments_models.departmentModel
var Departments = departments_models.Departments

router.get('/', function(req, res, next) {
    var query_args = req.query;

    courseModel.controller(res, query_args);
});

router.get('/generateRecommendations', function(req, res, next) {
    var query_args = req.query;

    Courses.findAll().then(function(courses){
            Courses.findAll().then(function(results) {
                for (j = 0; j < results.length; j++) {
                    res = {}
                    other_course = results.filter(function (val) {
                        return val.dataValues["department_name"] === results[j].dataValues["department_name"]
                    })
                    var chooseCourse = 1
                    for (i = 0; i < other_course.length; i++) {
                        var randomnumber = Math.floor(Math.random() * 11) + 1
                        if (chooseCourse == 1 && results[j].dataValues["name_and_number"] != other_course[i].dataValues["name_and_number"]) {
                            res[other_course[i].dataValues["department_name"] + " " + other_course[i].dataValues["name"]] = randomnumber

                        }
                        chooseCourse = 1-chooseCourse
                    }
                    console.log(res)
                    results[j].update({
                        recommendation: res
                    })
                }
            })
    })
})

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
