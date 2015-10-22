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

Inherit the method of superclass
departmentsModel.prototype = new classModel();

//Override the parent method dataValidator
departmentsModel.prototype.dataValidator = function(queryJSON) {
    var errors = [];
    var response = {};

    if (Object.keys(queryJSON).length != 0){
        errors.push('Unexpected arguments were received');
    }

    if (errors.length > 0){
        response.status = constants.STATUS_ERROR;
        response.errors = errors;
    } else {
        response.status = constants.STATUS_SUCCESS;
    }

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
module.exports.Departments = Departments;
