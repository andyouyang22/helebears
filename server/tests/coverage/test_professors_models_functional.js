var assert = require('assert');
var professors_model = require("../../models/professors_model")

var professorsModel = professors_model.professorsModel
var Professors = professors_model.Professors


describe('============== Professors FUNCTIONAL TESTS ==============', function() {
	
  	it('Test Adding Two Professors with Same Name', function(done){
  		Professors.create({professor_name: "**!!!!!"}).then(function(result){
  			Professors.create({professor_name: "**!!!!!"}).then(function(result){
  				throw "Two professors should not have the same name"
  				done()}
  			).error(function(exx){
  				result.destroy().then(function(){
  					done()
	  			}).error(function(exx){
	  				throw exx
	  				done()
	  			})
  			})
  			
  		}).error(function(exx){
  			throw exx
  			done()
  		})
  	})


});