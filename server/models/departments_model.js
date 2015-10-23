/**
 * Created by nirshtern on 10/21/15.
 */


var sequelize_modules = require("./init")
var sequelize = sequelize_modules.sequelize;
var Sequelize = sequelize_modules.Sequelize;

var Departments = sequelize.define('Departments', {
  department_name: { type: Sequelize.STRING, primaryKey: true}
})
Departments.sync()

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
        // The controller is responsible to navigate between preprocess, process and postprocess and provide
        // the answer to the client the required format.

        var preprocessedJSON = departmentModel.preprocess(inputJSON);
        if (preprocessedJSON.status == constants.STATUS_ERROR ) {

        }
        var processedJSON = sequelizeProcess(preprocessedJSON);
        if (processedJSON == constants.STATUS_ERROR) {

        }
        var postprocessedJSON = departmentModel.postprocess(processedJSON);
        if (postprocessedJSON.status == constants.STATUS_ERROR) {

        }
    }

};

module.exports = departmentModel;
module.exports.Departments = Departments;
