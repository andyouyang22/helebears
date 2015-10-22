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

var departmentModel = {
    getName: function() {

    },
    dataValidator: function(queryJSON) {
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

    },
    preprocess: function() {

    },

    postprocess: function() {

    },

    controller: function() {

    }

};

module.exports = departmentModel;
module.exports.Departments = Departments;
