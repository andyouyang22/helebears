/**
 * Created by nirshtern on 10/21/15.
 */

var sequelize_modules = require("./init");
var departments_models = require("./departments_model")
var professors_model = require("./professors_model")

var sequelize = sequelize_modules.sequelize;
var Sequelize = sequelize_modules.Sequelize;
var Departments = departments_models.Departments;
var Professors = professors_model.Professors;


var Courses = sequelize.define('Courses', {
  name: { type: Sequelize.STRING},
  number: { type: Sequelize.INTEGER},
  name_and_number: {type:Sequelize.STRING, primaryKey: true},
  professor_name: {
    type: Sequelize.STRING,
    primaryKey: true,
    references: {
      model: Professors,
      key: 'professor_name'
   }
  },
  department_name: {
    type: Sequelize.STRING,
    primaryKey: true,
    references: {
      model: Departments,
      key: 'department_name'
   }
  },
  type:  Sequelize.STRING,
  title: Sequelize.STRING,
  ccn: Sequelize.INTEGER,
  units: Sequelize.DOUBLE,
  time: Sequelize.STRING,
  location: Sequelize.STRING,
  final_slot: Sequelize.INTEGER,
  limit: Sequelize.INTEGER,
  enrolled: Sequelize.INTEGER,
  waitlist: Sequelize.INTEGER,
  note: Sequelize.STRING
});

var Sections = sequelize.define("Sections", {
  discussion: {type: Sequelize.STRING, primaryKey: true},
  type: {type: Sequelize.STRING, primaryKey: true},
  instructor: Sequelize.STRING,
  ccn: Sequelize.INTEGER,
  time: Sequelize.STRING,
  location: Sequelize.STRING,
  limit: Sequelize.INTEGER,
  enrolled: Sequelize.INTEGER,
  waitlist: Sequelize.INTEGER,
  name_and_number: {
      type: Sequelize.STRING,
      primaryKey: true
  },
    professor_name: {
        type: Sequelize.STRING,
        primaryKey: true,
        references: {
            model: Professors,
            key: 'professor_name'
        }
    },
    department_name: {
        type: Sequelize.STRING,
        primaryKey: true,
        references: {
            model: Departments,
            key: 'department_name'
        }
    }
});


Courses.sync();
Sections.sync();

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
    preprocess: function(inputJSON) {

    },

    postprocess: function(res, filter) {
      Courses.findAll({where:filter}).then(
                function(courses){
                    var results = []
                    for(var i = 0; i < courses.length; i++){
                        results.push(courses[i].dataValues)
                    }
                    res.json({status:1, "results":results})
                }).error(function(err) {
                    console.log(err)
                    res.json({status:-1, errors:["Unable to correctly retreive all courses"]})
                })
    },
    controller: function(res, filter) {
        // The controller is responsible to navigate between preprocess, process and postprocess and provide
        // the answer to the client the required format.
        courseModel.postprocess(res, filter)
    }

};

//var c = Sections.build({professor_name:"McDavid",department_name:"Math Science",discussion: "11.185", type: "Lab", name_and_number:"110 11", instructor: "TA", ccn: 34344, time:"R 1630PM 1730PM", location: "EVANS", limit: 15, enrolled: 5, waitlist: 10})
//c.save()
//var c = Sections.build({professor_name:"Kashi",department_name:"Economics",discussion: "11.185", type: "Discussion", name_and_number:"140E 11", instructor: "TBD", ccn: 34345, time:"R 1600PM 1700PM", location: "EVANS", limit: 10, enrolled: 5, waitlist: 10})
//c.save()
//var c = Sections.build({professor_name:"McDavid",department_name:"Math Science",discussion: "11.185", type: "Discussion", name_and_number:"110 11", instructor: "TA1", ccn: 51092, time:"MW 1000AM 1130AM", location: "EVANS", limit: 16, enrolled: 5, waitlist: 10})
//c.save()
//var c = Sections.build({professor_name:"McDavid",department_name:"Math Science",discussion: "11.144", type: "Lab", name_and_number:"110 11", instructor: "TA3", ccn: 52412, time:"TR 1500PM 1700PM ", location: "CORY", limit: 10, enrolled: 10, waitlist: 10})
//c.save()
//var c = Sections.build({professor_name:"McDavid",department_name:"Math Science",discussion: "11.190", type: "Discussion", name_and_number:"110 11", instructor: "TA4", ccn: 4214, time:"MW", location: "SODA", limit: 23, enrolled: 5, waitlist: 10})
//c.save()
//var c = Sections.build({professor_name:"McDavid",department_name:"Math Science",discussion: "11.124", type: "Discussion", name_and_number:"110 11", instructor: "TA4", ccn: 4123, time:"R 1000AM 1130AM", location: "CORY", limit: 10, enrolled: 12, waitlist: 10})
//c.save()
//var c = Sections.build({professor_name:"Kashi",department_name:"Economics",discussion: "11.185", type: "Discussion", name_and_number:"140E 11", instructor: "TBDTATBA", ccn: 24, time:"T 1600PM 1700PM", location: "SODA", limit: 25, enrolled: 15, waitlist: 10})
//c.save()
//var c = Sections.build({professor_name:"Kashi",department_name:"Economics",discussion: "11.185", type: "Discussion", name_and_number:"140E 11", instructor: "Alex", ccn: 242, time:"W 1600PM 1700PM", location: "SODA", limit: 10, enrolled: 8, waitlist: 10})
//c.save()
//var c = Sections.build({professor_name:"Kashi",department_name:"Economics",discussion: "11.185", type: "Discussion", name_and_number:"140E 11", instructor: "Ryan", ccn: 1242, time:"T 1000AM 1130AM", location: "SODA", limit: 10, enrolled: 5, waitlist: 10})
//c.save()
//var c = Sections.build({professor_name:"Kashi",department_name:"Economics",discussion: "11.185", type: "Discussion", name_and_number:"140E 11", instructor: "Andy", ccn: 900, time:"T 1500PM 1700PM", location: "SODA", limit: 30, enrolled: 5, waitlist: 10})
//c.save()
//var c = Sections.build({professor_name:"Necula",department_name:"Biology",discussion: "11.185", type: "Lab", name_and_number:"121 11", instructor: "Shai", ccn: 12, time:"MW 1000AM 1130AM", location: "SODA", limit: 10, enrolled: 5, waitlist: 10})
//c.save()
//var c = Sections.build({professor_name:"Necula",department_name:"Biology",discussion: "11.185", type: "Lab", name_and_number:"121 11", instructor: "Shay", ccn: 55, time:"R 1600PM 1700PM", location: "SODA", limit: 10, enrolled: 5, waitlist: 10})
//c.save()
//var c = Sections.build({professor_name:"Necula",department_name:"Biology",discussion: "11.185", type: "Lab", name_and_number:"121 11", instructor: "TA", ccn: 123, time:"R 1600PM 1700PM", location: "SODA", limit: 10, enrolled: 5, waitlist: 10})
//c.save()
//var c = Sections.build({professor_name:"Necula",department_name:"Biology",discussion: "11.185", type: "Discussion", name_and_number:"121 11", instructor: "END", ccn: 434, time:"MW 1000AM 1130AM", location: "WHEELER", limit: 10, enrolled: 10, waitlist: 10})
//c.save()
//var c = Sections.build({professor_name:"Necula",department_name:"Biology",discussion: "11.185", type: "Discussion", name_and_number:"121 11", instructor: "END", ccn: 121, time:"MW", location: "GBC", limit: 10, enrolled: 5, waitlist: 10})
//c.save()
//var c = Sections.build({professor_name:"Jay",department_name:"History",discussion: "11.185", type: "Discussion", name_and_number:"62C 11", instructor: "END", ccn: 434, time:"MW 1000AM 1100AM", location: "LI-KA-SHING", limit: 10, enrolled: 8, waitlist: 10})
//c.save()
//var c = Sections.build({professor_name:"Jay",department_name:"History",discussion: "11.185", type: "Discussion", name_and_number:"62C 11", instructor: "END", ccn: 33, time:"R 1600PM 1700PM", location: "EVANS", limit: 10, enrolled: 5, waitlist: 10})
//c.save()
//var c = Sections.build({professor_name:"Jay",department_name:"History",discussion: "11.185", type: "Discussion", name_and_number:"62C 11", instructor: "END", ccn: 2352, time:"W 1130AM 1230PM", location: "SODA", limit: 10, enrolled: 14, waitlist: 10})
//c.save()
//var c = Sections.build({professor_name:"Jay",department_name:"History",discussion: "11.185", type: "Discussion", name_and_number:"62C 11", instructor: "END", ccn: 235, time:"MW 9OOOAM 1000AM", location: "SODA", limit: 15, enrolled: 5, waitlist: 10})
//c.save()
//var c = Sections.build({professor_name:"Jay",department_name:"History",discussion: "11.185222", type: "Discussion", name_and_number:"62C 11", instructor: "END", ccn: 64, time:"R 1000AM 1200PM", location: "SODA", limit: 40, enrolled: 12, waitlist: 10})
//c.save()
//var c = Sections.build({professor_name:"Jay",department_name:"History",discussion: "11.18523", type: "Discussion", name_and_number:"62C 11", instructor: "END", ccn: 511, time:"MW 1000AM 1130AM", location: "SODA", limit: 60, enrolled: 5, waitlist: 10})
//c.save()
//var c = Sections.build({professor_name:"Garcia",department_name:"UGBA",discussion: "11.1822", type: "Lab", name_and_number:"155 12", instructor: "END", ccn: 575, time:"F 1200PM 1400PM", location: "SODA", limit: 10, enrolled: 5, waitlist: 10})
//c.save()
//var c = Sections.build({professor_name:"Garcia",department_name:"UGBA",discussion: "11.1898", type: "Lab", name_and_number:"155 12", instructor: "END", ccn: 586, time:"TR 1200PM 1300PM", location: "STADIUM", limit: 10, enrolled: 5, waitlist: 10})
//c.save()
//var c = Sections.build({professor_name:"Garcia",department_name:"UGBA",discussion: "11.184", type: "Discussion", name_and_number:"155 12", instructor: "END", ccn: 90, time:"W 1300PM 1400PM", location: "EVANS", limit: 10, enrolled: 5, waitlist: 10})
//c.save()
//var c = Sections.build({professor_name:"Garcia",department_name:"UGBA",discussion: "11.181", type: "Discussion", name_and_number:"155 12", instructor: "END", ccn: 23, time:"MW 9000AM 1000AM", location: "SODA", limit: 10, enrolled: 8, waitlist: 10})
//c.save()
//var c = Sections.build({professor_name:"Garcia",department_name:"UGBA",discussion: "11.183", type: "Lab", name_and_number:"155 12", instructor: "END", ccn: 12, time:"MW 8000AM 1000AM", location: "STADIUM", limit: 10, enrolled: 5, waitlist: 10})
//c.save()
//var c = Sections.build({professor_name:"Garcia",department_name:"UGBA",discussion: "11.187", type: "Lab", name_and_number:"155 12", instructor: "END", ccn: 12412, time:"MW 8000AM 1030AM", location: "SODA", limit: 30, enrolled: 12, waitlist: 10})
//c.save()
//


//var c = Courses.build({name: "52", number:11, name_and_number:"52 11",professor_name:"Garcia", department_name:"Math Science", type: "LEC", title: "Data Structure", ccn: 5, units: 1, time: "T 1000AM 1130AM", location: "CORY", final_slot: 5, limit: 10, enrolled: 5, waitlist: 0, note: "This course if offered for the last time."})
//c.save()
//
//var c = Courses.build({name: "121", number:11, name_and_number:"121 11",professor_name:"Necula", department_name:"Biology", type: "LEC", title: "Cell Engineering", ccn: 89723, units: 7, time: "Th 1400PM 1600PM", location: "CORY", final_slot: 18, limit: 20, enrolled:15, waitlist: 0, note: ""})
//c.save()
//
//var c = Courses.build({name: "64B", number:11, name_and_number:"64B 11",professor_name:"Garcia", department_name:"UGBA", type: "LEC", title: "How To Start a Business", ccn: 1092, units: 6, time: "W 1500PM 1630PM", location: "SODA", final_slot: 5, limit: 50, enrolled: 5, waitlist: 0, note: ""})
//c.save()
//
//var c = Courses.build({name: "62C", number:11, name_and_number:"62C 11",professor_name:"Jay", department_name:"History", type: "LEC", title: "Data Structure", ccn: 22, units: 2, time: "MW 1200PM 1600PM", location: "WHEELER", final_slot: 3, limit: 10, enrolled: 5, waitlist: 0, note: ""})
//c.save()
//
//var c = Courses.build({name: "EE20", number:14, name_and_number:"EE20 14",professor_name:"Babak", department_name:"Electrical Engineering", type: "LEC", title: "Systems and Signals", ccn: 87, units: 2.5, time: "MW 1700PM 1830PM", location: "WHEELER", final_slot: 5, limit: 10, enrolled: 5, waitlist: 0, note: ""})
//c.save()
//
//var c = Courses.build({name: "155", number:12, name_and_number:"155 12",professor_name:"Garcia", department_name:"Math Science", type: "LEC", title: "Life of Pie", ccn: 4634, units: 2.5, time: "MW 1500PM 1700PM", location: "UGBA", final_slot: 7, limit: 30, enrolled: 5, waitlist: 0, note: "This course is for declared students only."})
//c.save()
//
//var c = Courses.build({name: "110", number:11, name_and_number:"110 11",professor_name:"McDavid", department_name:"Math Science", type: "LEC", title: "Becoming a Golden Bear", ccn: 34343, units: 2, time: "TTh 1100AM 1300PM", location: "WHEELER", final_slot: 6, limit: 10, enrolled: 5, waitlist: 0, note: ""})
//c.save()
//
//var c = Courses.build({name: "24", number:11, name_and_number:"24 11",professor_name:"Ben-David", department_name:"Math Science", type: "SEMINAR", title: "The Real Life", ccn: 12312, units: 3, time: "MW 1000AM 1200PM", location: "WHEELER", final_slot: 1, limit: 40, enrolled: 31, waitlist: 0, note: ""})
//c.save()
//
//var c = Courses.build({name: "18D", number:11, name_and_number:"18D 11",professor_name:"Lenovo", department_name:"Physics", type: "LEC", title: "Computer Electricity", ccn: 314, units: 4, time: "MF 9000AM 1300PM", location: "WHEELER", final_slot: 2, limit: 10, enrolled: 7, waitlist: 0, note: ""})
//c.save()
//
//var c = Courses.build({name: "140E", number:11, name_and_number:"140E 11",professor_name:"Kashi", department_name:"Economics", type: "LEC", title: "Data Structure", ccn: 5643, units: 4, time: "RF 8000AM 9300AM", location: "LI-KA-SHING", final_slot: 5, limit: 20, enrolled: 20, waitlist: 0, note: ""})
//c.save()
//
//var c = Courses.build({name: "89Y", number:12, name_and_number:"89Y 12",professor_name:"Alex", department_name:"Political Science", type: "LEC", title: "Data Structure", ccn: 124, units: 5, time: "MW 1700PM 1900PM", location: "SOUTH HALL", final_slot: 5, limit: 10, enrolled: 9, waitlist: 0, note: ""})
//c.save()



module.exports.Courses = Courses;
module.exports.courseModel = courseModel