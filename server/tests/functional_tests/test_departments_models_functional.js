var assert = require('assert');
var departments_model = require("../../models/departments_model")

var departmentModel = departments_model.departmentModel
var Departments = departments_model.Departments


describe('============== Departments FUNCTIONAL TESTS ==============', function() {
    it('Test Adding Two Departments with Same Name', function(done){
      Departments.create({department_name: "**!!!!!"}).then(function(result){
        Departments.create({department_name: "**!!!!!"}).then(function(result){
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