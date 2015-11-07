var assert = require('assert');
var course_model = require("../../models/course_models")

var courseModel = course_model.courseModel
var Courses = course_model.Courses




describe('============== Courses FUNCTIONAL TESTS ==============', function() {
    it('Test Adding Courses and Deleting it', function(done){
      var professors_model = require("../../models/professors_model")
      var Professors = professors_model.Professors
      var departments_model = require("../../models/departments_model")
      var Departments = departments_model.Departments
      Departments.create({department_name: "dept25"}).then(function(de){
        Professors.create({professor_name: "prof35"}).then(function(prof){
          Courses.create({name:"61D", number: 003, name_and_number: "61B 003", professor_name: "prof35", department_name: "dept25", type: "Data Structures",
                          ccn: 10000, units: 1.5, time: "MW", location: "LAKASHING", final_slot:2, limit:10, enrolled:5, waitlist:1, note: ""}).then(
                          function(course){
                            course.destroy({ force: true }).then(function(){
                              prof.destroy({ force: true }).then(function(){
                                de.destroy({ force: true })
                                done()
                              })
                            })
                          }).error(function(exx){
                              console.log(exx)
                              throw exx
                              done()
                          })
        }).error(function(exx){
          console.log(exx)
          throw exx
          done()
        })
      }).error(function(exx){
        console.log(exx)
        throw exx
        done()
      })
    })
    it('Test Adding 2 of the Same Courses', function(done){
      var professors_model = require("../../models/professors_model")
      var Professors = professors_model.Professors
      var departments_model = require("../../models/departments_model")
      var Departments = departments_model.Departments
      Departments.create({department_name: "dept2222"}).then(function(de){
        Professors.create({professor_name: "prof3333"}).then(function(prof){
          Courses.create({name:"61D", number: 003, name_and_number: "61B 003", professor_name: "prof3333", department_name: "dept2222", type: "Data Structures",
                          ccn: 10000, units: 1.5, time: "MW", location: "LAKASHING", final_slot:2, limit:10, enrolled:5, waitlist:1, note: ""}).then(
                          function(course){
                            Courses.create({name:"61D", number: 003, name_and_number: "61B 003", professor_name: "prof3333", department_name: "dept2222", type: "Data Structures",
                                            ccn: 10000, units: 1.5, time: "MW", location: "LAKASHING", final_slot:2, limit:10, enrolled:5, waitlist:1, note: ""}).then(
                                            function(failure){
                                                throw "Should error"
                                                done()
                                            }).error(function(exx){
                                                course.destroy({ force: true }).then(function(){
                                                  prof.destroy({ force: true }).then(function(){
                                                    de.destroy({ force: true }).then(function(){
                                                      done()
                                                    })
                                                  })
                                                })
       
                                            })

                          }).error(function(exx){
                              console.log(exx)
                              prof.destroy()
                              de.destroy()
                              throw exx
                              done()
                          })
        }).error(function(exx){
          console.log(exx)
          de.destroy()
          throw exx
          done()
        })
      }).error(function(exx){
        console.log(exx)
        throw exx
        done()
      })
    })
    it('Test Adding 2 of the Same Courses except One Primary Key Difference', function(done){
      var professors_model = require("../../models/professors_model")
      var Professors = professors_model.Professors
      var departments_model = require("../../models/departments_model")
      var Departments = departments_model.Departments
      Departments.create({department_name: "dept22222"}).then(function(de){
        Professors.create({professor_name: "prof33333"}).then(function(prof){
          Courses.create({name:"61D", number: 003, name_and_number: "61B 003", professor_name: "prof33333", department_name: "dept22222", type: "Data Structures",
                          ccn: 10000, units: 1.5, time: "MW", location: "LAKASHING", final_slot:2, limit:10, enrolled:5, waitlist:1, note: ""}).then(
                          function(course){
                            Courses.create({name:"61D", number: 003, name_and_number: "61M 003", professor_name: "prof33333", department_name: "dept22222", type: "Data Structures",
                                            ccn: 10000, units: 1.5, time: "MW", location: "LAKASHING", final_slot:2, limit:10, enrolled:5, waitlist:1, note: ""}).then(
                                            function(course2){
                                              course2.destroy({ force: true }).then(function(){
                                                course.destroy({ force: true }).then(function(){
                                                  prof.destroy({ force: true }).then(function(){
                                                    de.destroy({ force: true }).then(function(){
                                                      done()
                                                    })
                                                  })
                                                })
                                              })
                                            }).error(function(exx){
                                                throw "Should not error"
                                                done()
                                            })

                          }).error(function(exx){
                              console.log(exx)
                              prof.destroy()
                              de.destroy()
                              throw exx
                              done()
                          })
        }).error(function(exx){
          console.log(exx)
          de.destroy()
          throw exx
          done()
        })
      }).error(function(exx){
        console.log(exx)
        throw exx
        done()
      })
    })
})