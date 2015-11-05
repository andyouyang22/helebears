/**
 * Created by nirshtern on 10/21/15.
 */

var sequelize_modules = require("./init")
var course_models = require("./course_models")
var sequelize = sequelize_modules.sequelize
var Sequelize = sequelize_modules.Sequelize
var Courses = course_models.Courses;

var Schedules = sequelize.define("Schedules", {
  unique_id: {type: Sequelize.STRING, primaryKey: true},
  name_and_number: {
    type: Sequelize.STRING,
    primaryKey: true,
    references: {
      model: Courses,
      key: 'name_and_number',
   }
  }
})
Schedules.sync()

var scheduleModel = {
    getName: function() {

    },
    dataValidator: function(queryJSON) {
    },
    preprocess: function(userDataValues,type,res) {
        if (type === 'get'){
            scheduleModel.searchQuery(userDataValues,res);
        }

        if (type == 'post'){

        }

    },
    searchQuery: function(userDataValues,res) {
        Schedules.findAll().then(
            function(departments){
                res.json({status:1})
            }).catch(function(err) {
                res.json({status:-1, errors:["Unable to correctly retrieve all departments",err]})
            })
    },
    createQuery: function (data, res) {
        var entry = {
            unique_id: data.user.email,
            name_and_number: data.name_and_number
        };
        Schedules.create(entry).then(function(results){
            res.json({
                status:1
            })
        }).catch(function(err){
            res.json({status: -1, errors:['Course already added for user',err]});
            console.log(err)
        });
    },
    removeQuery: function (data, res) {
        var entry = {
            unique_id: data.user.email,
            name_and_number: data.name_and_number
        };
        Schedules.findAll({where: entry}).then(function(results){
            console.log(results)
            console.log("RESULTS")
            results[0].destroy().then(function(){
                console.log("DONE")
                res.json({status: 1})
            }).catch(function(err){
                res.json({status: -1, errors:['Error destroying course, course exists',err]});
            })
        }).catch(function(err){
            res.json({status: -1, errors:['Error removing course, course may not exist',err]});
        });
    },
    postprocess: function(queryResults, res) {

    },

    controller: function(userDataValues,type,res) {
        // The controller is responsible to navigate between preprocess, process and postprocess and provide
        // the answer to the client the required format.
        scheduleModel.preprocess(userDataValues,type,res)
    }

};
module.exports.Schedules = Schedules;
module.exports.scheduleModel = scheduleModel;