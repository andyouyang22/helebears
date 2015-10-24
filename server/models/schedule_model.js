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
    preprocess: function() {

    },

    postprocess: function() {

    },

    controller: function() {

    }

};
