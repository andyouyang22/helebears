var assert = require('assert');
var professors_model = require("../models/professors_model")

var Professors = professors_model.Professors


describe('============== Professors ==============', function() {
	it('Queried Professors Model Successfully with findAll()', function (done) {
  		Professors.findAll().then(function(professors){
  			assert(true)

  			done()

    	}).error(function(err){
    		assert(false)
    		done()
    	})
  	})
  	it('Queried Professors Model Successfully with findOne()', function (done) {
  		Professors.findOne().then(function(professor){
  			assert(true)

  			done()

    	}).error(function(err){
    		assert(false)
    		done()
    	})
  	})
});