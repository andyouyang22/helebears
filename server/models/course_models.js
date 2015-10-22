/**
 * Created by nirshtern on 10/21/15.
 */

var classModel = require("./class_models");
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
      key: 'professor_name',
   }
  },
  department_name: {
    type: Sequelize.STRING,
    primaryKey: true,
    references: {
      model: Departments,
      key: 'department_name',
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
})

function courseModel() {
    var department = department;
    var course = course || "*";
};

// Inherit the method of superclass
courseModel.prototype = new classModel();

//Override the parent method dataValidator
courseModel.prototype.dataValidator.get = function(queryJSON) {
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
};

//Override the parent method dataValidator
courseModel.prototype.preprocess = function() {

};

//Override the parent method dataValidator
courseModel.prototype.postprocess = function() {

};

//Override the parent method dataValidator
courseModel.prototype.controller = function() {

};

module.exports = courseModel;

