/**
 * Created by nirshtern on 10/21/15.
 */

var classModel = require("./models/class_models");

function userModel() {

};

// Inherit the method of superclass
userModel.prototype = new classModel();

//Override the parent method dataValidator
userModel.prototype.dataValidator = function() {

};

//Override the parent method dataValidator
userModel.prototype.preprocess = function() {

};

//Override the parent method dataValidator
userModel.prototype.postprocess = function() {

};

//Override the parent method dataValidator
userModel.prototype.controller = function() {

};

userModel.prototype.existsConflictingUser = function(username) {

};

module.exports = userModel;

