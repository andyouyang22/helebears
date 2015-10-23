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
    preprocess: function(query_args,type,res) {
        if (type === 'get'){
            departmentModel.searchQuery(query_args,res);
        }

        if (type == 'post'){}

    },
    searchQuery: function(filter,res) {
        Departments.findAll().then(
            function(departments){
                var results = []
                for(var i = 0; i < departments.length; i++){
                    results.push(departments[i].dataValues)
                }
                res.json({status:1, results:results})
            }).catch(function(err) {
                res.json({status:-1, errors:["Unable to correctly retrieve all departments",err]})
            })
    },
    postprocess: function(queryResults, res) {

    },

    controller: function(query_args,type,res) {
        // The controller is responsible to navigate between preprocess, process and postprocess and provide
        // the answer to the client the required format.
        departmentModel.preprocess(query_args,type,res)
    }

};

module.exports.departmentModel = departmentModel;
module.exports.Departments = Departments;
