/**
 * Created by nirshtern on 10/21/15.
 */

var sequelize_modules = require("./init");
var departments_models = require("./departments_model");
var professors_model = require("./professors_model");
var schedules_model = require("./schedule_model");
var sequelize = sequelize_modules.sequelize;
var Sequelize = sequelize_modules.Sequelize;
var Departments = departments_models.Departments;
var Professors = professors_model.Professors;
var Schedules = schedules_model.Schedules;

var Sequence = exports.Sequence || require('sequence').Sequence
    , sequence = Sequence.create()
    , err
    ;


var Courses = sequelize.define('Courses', {
  name: { type: Sequelize.STRING},
  number: { type: Sequelize.INTEGER},
  name_and_number: {type:Sequelize.STRING, primaryKey: true},
  professor_name: {
    type: Sequelize.STRING,
    primaryKey: true,
    references: {
      model: Professors,
      key: 'professor_name'
   }
  },
  department_name: {
    type: Sequelize.STRING,
    primaryKey: true,
    references: {
      model: Departments,
      key: 'department_name'
   }
  },
  type:  Sequelize.STRING,
  title: Sequelize.STRING,
  ccn: Sequelize.INTEGER,
  units: Sequelize.DOUBLE,
  time: Sequelize.STRING,
  location: Sequelize.STRING,
  final_slot: Sequelize.INTEGER,
  limit: Sequelize.INTEGER,
  enrolled: Sequelize.INTEGER,
  waitlist: Sequelize.INTEGER,
  note: Sequelize.STRING,
    course_description: Sequelize.STRING,
    recommendation: Sequelize.JSON
});

var Sections = sequelize.define("Sections", {
  discussion: {type: Sequelize.STRING, primaryKey: true},
  type: {type: Sequelize.STRING, primaryKey: true},
  instructor: Sequelize.STRING,
  ccn: Sequelize.INTEGER,
  time: Sequelize.STRING,
  location: Sequelize.STRING,
  limit: Sequelize.INTEGER,
  enrolled: Sequelize.INTEGER,
  waitlist: Sequelize.INTEGER,
  name_and_number: {
      type: Sequelize.STRING,
      primaryKey: true
  },
    professor_name: {
        type: Sequelize.STRING,
        primaryKey: true,
        references: {
            model: Professors,
            key: 'professor_name'
        }
    },
    department_name: {
        type: Sequelize.STRING,
        primaryKey: true,
        references: {
            model: Departments,
            key: 'department_name'
        }
    }
});

Courses.sync();
Sections.sync();

var courseModel = {
    postprocess: function(res, filter) {
      Courses.findAll({where:filter}).then(
                function(courses){
                    var results = []
                    for(var i = 0; i < courses.length; i++){
                        courses[i].dataValues['sections'] = [];
                        results.push(courses[i].dataValues)
                    }

                    Sections.findAll().then(
                        function(sections){
                            for(var sec = 0; sec < sections.length; sec++){
                                var section = sections[sec].dataValues;
                                for(var i = 0; i< results.length; i++){
                                    if (section.name_and_number === results[i].name_and_number){
                                        results[i]['sections'].push(section);
                                    }
                                }
                            }
                            res.json({status:1, "results":results})
                        }
                    );

                }).error(function(err) {
                    console.log(err)
                    res.json({status:-1, errors:["Unable to correctly retreive all courses"]})
                })
    },
    controller: function(res, filter) {
        // The controller is responsible to navigate between preprocess, process and postprocess and provide
        // the answer to the client the required format.
        courseModel.postprocess(res, filter)
    },

    aggregateRecommendations: function(courseToAdd,res) {
        Schedules.create(courseToAdd).then(function() {
            res.json({status:1, "results": 'good'})

    }).catch(function(err) {
            res.json({status:-1, errors:["Unable to correctly retrieve all departments",err]})
        });

        sequence
            .then(function (next) {
                next(null, courseToAdd)
            })
            .then(function (next, err, courseToAdd) {
                Schedules.findAll({where: {"unique_id": courseToAdd.unique_id}}).then(
                    function (results) {
                        stripped_results = []
                        for (i = 0; i < results.length; i++) {
                            stripped_results.push(results[i].dataValues.ccn)
                        }
                        next(null, stripped_results, courseToAdd.name_and_number);
                    })

            })
            .then(function (next, err, courseCCNsToUpdate, courseToIncrement) {
                Courses.findAll({
                    where: {
                        ccn: {
                            $in: courseCCNsToUpdate
                        }
                    }
                }).then(function (courses) {
                    next(null, courses, courseToIncrement);
                });

            })
            .then(function (next, err, courses, courseToIncrement) {

                for (var i = 0; i < courses.length; i++) {
                    var course = courses[i];
                    if (course.recommendation === null || course.recommendation === undefined) {
                        course.recommendation = {};
                    }

                    var rec = course.recommendation;

                    if (rec.hasOwnProperty(courseToIncrement)) {
                        rec[courseToIncrement] += 1;
                    } else {
                        rec[courseToIncrement] = 1;
                    }
                    course.update({
                        recommendation: rec
                    })
                }
                next();
            })
    }

};


module.exports.Courses = Courses;
module.exports.courseModel = courseModel;



