var assert = require('assert');
var reviews_models = require("../../models/reviews_models")

var reviewsModel = reviews_models.reviewsModel
var Reviews = reviews_models.Reviews


describe('============== Reviews ==============', function() {
	it('Queried Reviews Model Successfully with findAll()', function (done) {
  		Reviews.findAll().then(function(departments){
  			assert(true)

  			done()

    	}).error(function(err){
    		assert(false)
    		done()
    	})
  	})
  	it('Queried Reviews Model Successfully with findOne()', function (done) {
  		Reviews.findOne().then(function(departments){
  			assert(true)

  			done()

    	}).error(function(err){
    		assert(false)
    		done()
    	})
  	})
  	it('Attempt to create a department with an invalid key', function(done){
  		Reviews.create({rating_3:"Hi"}).then(function(result){
  			throw "Reviews did not properly error out"
  			done()
  		}).error(function(err){
  			done()
  		})
  	})
  	it('Test searchQuery()', function(done){
  		res = {}
  		res.json = function(v){}
  		reviewsModel.searchQuery({}, res)
  		done()

  	})
  	it('Test preprocess()', function(done){
  		res = {}
  		res.json = function(v){}
  		reviewsModel.preprocess({}, res)
  		done()
  	})
  	it('Test controller()', function(done){
  		res = {}
  		res.json = function(v){}
  		reviewsModel.controller({}, res)
  		done()
  	})
});