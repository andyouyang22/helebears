/**
 * Helper functions for parsing HTTP response data. This was mainly a refactoring
 * effort to keep the code in the core files a bit cleaner.
 */

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

	},
};
