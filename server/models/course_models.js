/**
 * Created by nirshtern on 10/21/15.
 */

var sequelize_modules = require("./init");
var departments_models = require("./departments_model")
var professors_model = require("./professors_model")

var sequelize = sequelize_modules.sequelize;
var Sequelize = sequelize_modules.Sequelize;
var Departments = departments_models.Departments;
var Professors = professors_model.Professors;


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
  note: Sequelize.STRING
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
      primaryKey: true,
      references: {
      model: Courses,
      key: 'name_and_number'
   }
  }
});

Sections.sync();
Courses.sync();

var courseModel = {
    getName: function() {

    },
    dataValidator: function(queryJSON) {
        var errors = [];
        var response = {};

        if (Object.keys(queryJSON).length == 0){
            errors.push('No query arguments were provided.');
        }

        if ((!queryJSON.department) || queryJSON.length < 1 || queryJSON.length > 128) {
            errors.push('Invalid department size.');
        }

        if (queryJSON.course && queryJSON.length < 0 && queryJSON.length > 128) {
            errors.push('Invalid course size.');
        }

        if (errors.length > 0){
            response.status = constants.STATUS_ERROR;
            response.errors = errors;
        } else {
            response.status = constants.STATUS_SUCCESS;
        }
    },
    preprocess: function(inputJSON) {

    },

    postprocess: function(res, filter) {
      Courses.findAll({where:filter}).then(
                function(courses){
                    var results = []
                    for(var i = 0; i < courses.length; i++){
                        results.push(courses[i].dataValues)
                    }
                    res.json({status:1, "results":results})
                }).error(function(err) {
                    console.log(err)
                    res.json({status:-1, errors:["Unable to correctly retreive all courses"]})
                })
    },
    controller: function(res, filter) {
        // The controller is responsible to navigate between preprocess, process and postprocess and provide
        // the answer to the client the required format.
        courseModel.postprocess(res, filter)

        
    }

};


module.exports.Courses = Courses;
module.exports.courseModel = courseModel