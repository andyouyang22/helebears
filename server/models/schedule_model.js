/**
 * Created by nirshtern on 10/21/15.
 */


var classModel = require("./models/class_models");

function scheduleModel() {

};

// Inherit the method of superclass
scheduleModel.prototype = new classModel();

//Override the parent method dataValidator
scheduleModel.prototype.dataValidator = function(queryJSON) {
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
scheduleModel.prototype.preprocess = function() {

};

//Override the parent method dataValidator
scheduleModel.prototype.postprocess = function() {

};

//Override the parent method dataValidator
scheduleModel.prototype.controller = function() {

};

scheduleModel.prototype.createUnifiedSchedule = function(unique_id) {

};

module.exports = scheduleModel;

