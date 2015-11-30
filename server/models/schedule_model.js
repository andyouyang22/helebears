/**
 * Created by nirshtern on 10/21/15.
 */

var sequelize_modules = require("./init")
var course_models = require("./course_models")
var sequelize = sequelize_modules.sequelize
var Sequelize = sequelize_modules.Sequelize
var Courses = course_models.Courses;
var courseModel = course_models.courseModel;



var Schedules = sequelize.define("Schedules", {
  unique_id: {type: Sequelize.STRING, primaryKey: true},
  name_and_number: {
      type: Sequelize.STRING,
      primaryKey: true,
  },
  course_time: Sequelize.STRING,
  section_time: Sequelize.STRING,
  lab_time: Sequelize.STRING,
    ccn: Sequelize.INTEGER,
    location:Sequelize.STRING
})
Schedules.sync();

var scheduleModel = {
    preprocess: function(userDataValues,type,res) {
        if (type === 'get'){
            scheduleModel.searchQuery(userDataValues,res);
        }

    },
    searchQuery: function(unique_id,res) {
        Schedules.findAll({where: {"unique_id": unique_id}}).then(
            function(results){
                stripped_results  = []
                for(i = 0; i < results.length;i++){
                    stripped_results.push(results[i].dataValues)
                }
                res.json({status:1, "results": stripped_results})
            }).catch(function(err) {
                res.json({status:-1, errors:["Unable to correctly retrieve all departments",err]})
            })
    },
    createQuery: function (data, res) {
        Schedules.create(data).then(function(results){
           res.json({status:1, "results": 'good'})
        }).catch(function(err) {
            res.json({status:-1, errors:["Unable to correctly retrieve all departments",err]})
        });
    },
    removeQuery: function (data, res) {
        Schedules.findAll({where: data}).then(function(results){
            results[0].destroy().then(function(){
                res.json({status: 1})
            }).catch(function(err){
                res.json({status: -1, errors:['Error destroying course, course exists',err]});
            })
        }).catch(function(err){
            res.json({status: -1, errors:['Error removing course, course may not exist',err]});
        });
    },

    controller: function(userDataValues,type,res) {
        // The controller is responsible to navigate between preprocess, process and postprocess and provide
        // the answer to the client the required format.
        scheduleModel.preprocess(userDataValues,type,res)
    }

};


module.exports.Schedules = Schedules;
module.exports.scheduleModel = scheduleModel;