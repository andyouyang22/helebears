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
courseModel.prototype.dataValidator = function() {

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

