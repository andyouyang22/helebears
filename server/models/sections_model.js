/**
 * Created by nirshtern on 10/21/15.
 */

var classModel = require("./models/class_models");

function sectionsModel() {

};

// Inherit the method of superclass
sectionsModel.prototype = new classModel();

//Override the parent method dataValidator
sectionsModel.prototype.dataValidator = function(queryJSON) {
    var errors = [];
    var response = {};

    if (Object.keys(queryJSON).length != 0){
        errors.push('Unexpected arguments were received');
    }

    if (errors.length > 0){
        response.status = STATUS_ERROR;
        response.errors = errors;
    } else {
        response.status = STATUS_SUCCESS;
    }

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

