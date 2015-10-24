var assert = require('assert');
var departments_model = require("../models/departments_model")

var departmentModel = departments_model.departmentModel
var Departments = departments_model.Departments


describe('============== Departments ==============', function() {
	it('Queried Departments Model Successfully with findAll()', function (done) {
  		Departments.findAll().then(function(departments){
  			assert(true)

  			done()

    	}).error(function(err){
    		assert(false)
    		done()
    	})
  	})
  	it('Queried Departments Model Successfully with findOne()', function (done) {
  		Departments.findOne().then(function(departments){
  			assert(true)

  			done()

    	}).error(function(err){
    		assert(false)
    		done()
    	})
  	})
  	it('Attempt to create a department with an invalid key', function(done){
  		Departments.create({department:"PleaseError"}).then(function(result){
  			throw "Departments did not properly error out"
  			done()
  		}).error(function(err){
  			done()
  		})
  	})
  	it('Test searchQuery()', function(done){
  		res = {}
  		res.json = function(v){}
  		departmentModel.searchQuery({}, res)
  		done()

  	})
  	it('Test preprocess()', function(done){
  		res = {}
  		res.json = function(v){}
  		departmentModel.preprocess({}, res)
  		done()
  	})
  	it('Test controller()', function(done){
  		res = {}
  		res.json = function(v){}
  		departmentModel.controller({}, res)
  		done()
  	})
    it('Test Adding Department and Deleting it', function(done){
      Departments.create({department_name: "!!!!!"}).then(function(result){
        result.destroy().then(function(){
          done()
        }).error(function(exx){
          throw exx
          done()
        })
      }).error(function(exx){
        throw exx
        done()
      })
    })

});