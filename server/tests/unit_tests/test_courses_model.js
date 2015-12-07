var assert = require('assert');
var course_model = require("../../models/course_models")
var departments_model = require("../../models/departments_model");
var professors_model = require("../../models/professors_model");
var schedule_model = require("../../models/schedule_model");
var courseModel = course_model.courseModel;
var Courses = course_model.Courses;
var Departments = departments_model.Departments;
var Professors = professors_model.Professors;
var Schedules = schedule_model.Schedules;





describe('============== Courses ==============', function() {
	it('Queried Courses Model Successfully with findAll()', function (done) {
  		Courses.findAll().then(function(departments){
  			assert(true)

  			done()

    	}).error(function(err){
    		assert(false)
    		done()
    	})
  	})
  	it('Queried Courses Model Successfully with findOne()', function (done) {
  		Courses.findOne().then(function(departments){
  			assert(true)

  			done()

    	}).error(function(err){
    		assert(false)
    		done()
    	})
  	})
  	it('Attempt to create a course with an invalid key', function(done){
  		Courses.create({departmento:"PleaseError"}).then(function(result){
  			throw "Courses did not properly error out"
  			done()
  		}).error(function(err){
  			done()
  		})
  	})
	it('Test postprocess fail()', function(done){
		res = {}
		res.json = function(v){}
		courseModel.postprocess(res, {asd: "!!!"})
		done()
	})

  	it('Test controller()', function(done){
  		res = {}
  		res.json = function(v){}
  		courseModel.controller(res, {})
  		done()
  	})
});


