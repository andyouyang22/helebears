/**
 * Created by nirshtern on 10/21/15.
 */

var classModel = require("./models/class_models");

function userModel() {

};

// Inherit the method of superclass
userModel.prototype = new classModel();

//Override the parent method dataValidator
userModel.prototype.dataValidator.signup = function(queryJSON) {
    var errors = [];
    var response = {};

    if (Object.keys(queryJSON).length != 0){
        errors.push('No arguments were received');
    }

    var username = queryJSON.username;
    if ((!username) || username.length < 1 || username.length > 128){
        errors.push('Invalid size of username');
    }
    var password = queryJSON.password;
    if ((!password) || password.length < 1 || password.length > 128){
        errors.push('Invalid size of password');
    }

    if (errors.length > 0){
        response.status = STATUS_ERROR;
        response.errors = errors;
    } else {
        response.status = STATUS_SUCCESS;
    }

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

