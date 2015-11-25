/**
 * Helper functions for parsing HTTP response data. This was mainly a refactoring
 * effort to keep the code in the core files a bit cleaner.
 */

var time = require('./time.js');

var generateCCN = function(ccn) {
	ccn = ccn + ""
	for (var i = ccn.length; i < 5; i++) {
		ccn = "0" + ccn;
	}
	return ccn;
};

module.exports = {
	schedule: function(data) {
		if (data.status == -1) {
			console.log("Failed to load user's schedule");
			console.log("Errors: " + data.errors);
			return
		}
		var courses = [];
		data.results.forEach(function(result) {
			var course = {
				name : result.name_and_number,
				time : result.course_time,
				room : "420 Barrows", // TODO: store room location in backend
				ccn  : result.ccn,
			};
			if (course.ccn == undefined) {
				course.ccn = that.ccn(course.name, course.time);
			}
			courses.push(course);
		});
		return courses;
	},
	departments: function(data) {
		var depts = [];
		for (var i = 0; i < data.results.length; i++) {
			depts.push(data.results[i].department_name);
		}
		return depts;
	},
	courses: function(data) {
		var courses = [];
		for (var i = 0; i < data.results.length; i++) {
			courses.push(data.results[i].name);
		}
		return courses;
	},
	results: function(data) {
		var results = [];
		data.results.forEach(function(lec) {
			var course = {
				name : lec.department_name + " " + lec.name,
				desc : lec.title,
				inst : lec.professor_name,
				room : lec.location,
				time : time.convert(lec.time),
				ccn  : generateCCN(lec.ccn),
				
				//BEFORE PUSHING TO HEROKU COMMENT ME OUT
				course_description : "Temporary Course Description LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG LONG ",
				recommendation : {name:'CS169',recommendation:{'CS170':20,'CS160':10,'CS142':33}},
				
				//BEFORE PUSHING TO HEROKU UNCOMMENT ME
				//recommendation : lec.recommendation,
				//course_description : lec.course_description,
				sections : [],
			};
			lec.sections.forEach(function(sec) {
				course.sections.push({
					time : time.convert(sec.time),
					ccn  : generateCCN(sec.ccn),
				});
			});
			results.push(course);
		});
		return results;
	},
};
