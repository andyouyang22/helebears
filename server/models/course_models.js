/**
 * Created by nirshtern on 10/21/15.
 */

var class_models = require("./class_models");
var classModel = class_models.classModel;
var Class = class_models.Class;

var courseModel = {
    getName: function() {

    },
    dataValidator: function(queryJSON) {
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
            response.status = constants.STATUS_ERROR;
            response.errors = errors;
        } else {
            response.status = constants.STATUS_SUCCESS;
        }
    },
    preprocess: function() {

    },

    postprocess: function() {

    },

    controller: function() {

    }

};



module.exports = courseModel;

