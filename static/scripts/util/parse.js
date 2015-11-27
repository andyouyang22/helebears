/**
 * Helper functions for parsing HTTP response data. This was mainly a refactoring
 * effort to keep the code in the core files a bit cleaner.
 */

var time = require('./time.js');

module.exports = {
	courses: function(data) {
		var courses = [];
		for (var i = 0; i < data.results.length; i++) {
			courses.push(data.results[i].name);
		}
		return courses;
	},
	departments: function(data) {
		var depts = [];
		for (var i = 0; i < data.results.length; i++) {
			depts.push(data.results[i].department_name);
		}
		return depts;
	},
	normalCase: function(name) {
		var tokens = name.split(" ");
		for (i = 0; i < tokens.length; i++) {
			var t = tokens[i];
			if (t.length > 1) {
				t = t[0].toUpperCase() + t.slice(1).toLowerCase();
			}
			else {
				t = t.toUpperCase() + "."
			}
			tokens[i] = t;
		}
		return tokens.join(" ");
	},
	results: function(data) {
		var that = this;
		var results = [];
		data.results.forEach(function(lec) {
			var course = {
				name  : lec.department_name + " " + lec.name,
				desc  : lec.title,
				inst  : that.normalCase(lec.professor_name),
				room  : lec.location,
				time  : lec.time,
				ccn   : lec.ccn,
				units : lec.units,
				limit : lec.limit,
				rec   : lec.recommendation,
				info  : lec.course_description,
				enrolled : lec.enrolled,
				waitlist : lec.waitlist,
				sections : [],
			};
			lec.sections.forEach(function(sec) {
				course.sections.push({
					time : time.convert(sec.time),
					ccn  : sec.ccn,
				});
			});
			results.push(course);
		});
		return results;
	},
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
				room : result.location,
				ccn  : result.ccn,
			};
			if (course.ccn == undefined) {
				course.ccn = that.ccn(course.name, course.time);
			}
			courses.push(course);
		});
		return courses;
	},
	split: function(course) {
		var split = [];
		var t = time.parse(course.time);
		for (i = 0; i < t.days.length; i++) {
			var session_time = t.days[i] + " " + t.start + " " + t.end;
			split.push({
				ccn   : course.ccn,
				desc  : course.desc,
				info  : course.info,
				limit : course.limit,
				name  : course.name,
				rec   : course.rec,
				room  : course.room,
				time  : session_time,
				units : course.units,
				enrolled : course.enrolled,
				waitlist : course.waitlist,
				sections : [],
			});
		}
		return split;
	}
};
