var assert = require('assert');
var professors_model = require("../models/professors_model")

var Professors = professors_model.Professors

describe('Professors', function() {
  describe('findAll()', function () {
  	it('Queried Professors Model Successfully with findAll()', function () {
  	Professors.findAll().then(function(professors){
  			assert(true)
    	}).error(function(err){
    		assert(false)
    	})
  })
  });
});