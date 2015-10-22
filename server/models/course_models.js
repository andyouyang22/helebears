/**
 * Created by nirshtern on 10/21/15.
 */

var classModel = require("./models/class_models");

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
        response.status = STATUS_ERROR;
        response.errors = errors;
    } else {
        response.status = STATUS_SUCCESS;
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

