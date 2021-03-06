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
    preprocess: function(query_args,type,res) {
        if (type === 'get'){
            departmentModel.searchQuery(query_args,res);
        }


    },
    searchQuery: function(filter,res) {
        Departments.findAll({order: [['createdAt', 'ASC']]}).then(
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

    controller: function(query_args,type,res) {
        // The controller is responsible to navigate between preprocess, process and postprocess and provide
        // the answer to the client the required format.
        departmentModel.preprocess(query_args,type,res)
    }

};


module.exports.departmentModel = departmentModel;
module.exports.Departments = Departments;
