var assert = require('assert');
var professors_model = require("../../models/professors_model")

var professorsModel = professors_model.professorsModel
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
  	it('Attempt to create a professor with an invalid key', function(done){
  		Professors.create({professors:"PleaseError"}).then(function(result){
  			throw "Professors did not properly error out"
  			done()
  		}).error(function(err){
  			done()
  		})
  	})
  	it('Test searchQuery()', function(done){
  		res = {}
  		res.json = function(v){}
  		professorsModel.searchQuery({}, res)
  		done()

  	})
  	it('Test preprocess()', function(done){
  		res = {}
  		res.json = function(v){}
  		professorsModel.preprocess({}, res)
  		done()
  	})
  	it('Test controller()', function(done){
  		res = {}
  		res.json = function(v){}
  		professorsModel.controller({}, res)
  		done()
  	})
  	it('Test Adding Professor and Deleting it', function(done){
  		Professors.create({professor_name: "**!!!!!"}).then(function(result){
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