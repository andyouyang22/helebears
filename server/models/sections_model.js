/**
 * Created by nirshtern on 10/21/15.
 */

var classModel = require("./models/class_models");

function sectionsModel() {

};

// Inherit the method of superclass
sectionsModel.prototype = new classModel();

//Override the parent method dataValidator
sectionsModel.prototype.dataValidator = function() {

};

//Override the parent method dataValidator
sectionsModel.prototype.preprocess = function() {

};

//Override the parent method dataValidator
sectionsModel.prototype.postprocess = function() {

};

//Override the parent method dataValidator
sectionsModel.prototype.controller = function() {

};

module.exports = sectionsModel;

