/**
 * Created by nirshtern on 10/21/15.
 */

var classModel = require("./models/class_models");

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

