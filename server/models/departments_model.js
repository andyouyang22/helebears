/**
 * Created by nirshtern on 10/21/15.
 */

var classModel = require("./class_models");

var sequelize_modules = require("./init")
var sequelize = sequelize_modules.sequelize;
var Sequelize = sequelize_modules.Sequelize;

var Departments = sequelize.define('Departments', {
  department_name: { type: Sequelize.STRING, primaryKey: true}
})

function departmentsModel() {

};

// Inherit the method of superclass
departmentsModel.prototype = new classModel();

//Override the parent method dataValidator
departmentsModel.prototype.dataValidator = function() {

};

//Override the parent method dataValidator
departmentsModel.prototype.preprocess = function() {

};

//Override the parent method dataValidator
departmentsModel.prototype.postprocess = function() {

};

//Override the parent method dataValidator
departmentsModel.prototype.controller = function() {

};

module.exports = departmentsModel;

