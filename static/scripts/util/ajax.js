var parse = require('./parse.js');

var apiUrl = 'http://protected-refuge-7067.herokuapp.com';

module.exports = {
	get: function(url, onSuccess, onFailure) {
		$.ajax({
			type: 'GET',
			url: apiUrl + url,
			dataType: "json",
			success: onSuccess,
			error: onFailure
		});
	},
	make: function(url, data, onSuccess, onFailure) {
		$.ajax({
			type: 'POST',
			url: apiUrl + url,
			data: JSON.stringify(data),
			contentType: "application/json",
			dataType: "json",
			success: onSuccess,
			error: onFailure
		});
	},

	/**
	 * Make a GET request for the user's schedule.
	 * @param {function} callback: Takes in an array of courses and performs an
	 *   action upon it.
	 */
	getSchedule: function(callback) {
		var onSuccess = function(data) {
			if (data.status == -1) {
				console.log("Failed to load user's schedule; status = -1");
				console.log("Errors: " + data.errors);
				return
			}
			var courses = parse.schedule(data);
			callback(courses);
		};
		var onFailure = function() {
			console.log("Failed to load user's schedule");
		};
		this.get('/api/schedules', onSuccess, onFailure);
	},

	/**
	 * Make a GET request for all departments.
	 * @param {function} callback: Takes in an array of department names and
	 *   performs an action upon it.
	 */
	getDepartments: function(callback) {
		var onSuccess = function(data) {
			if (data.status == -1) {
				console.log("Failed to load departments into form; status = -1");
				console.log("Errors: " + data.errors);
				return
			}
			depts = parse.departments(data);
			callback(depts);
		};
		var onFailure = function() {
			console.log("Failed to load list of departments");
		};
		this.get('/api/departments', onSuccess, onFailure);
	},

	/**
	 * Make a GET request for the courses listed for the given department.
	 * @param {function} callback: Takes in an array of course listings and
	 *   performs an action upon it.
	 */
	getCourses: function(dept, callback) {
		var onSuccess = function(data) {
			if (data.status == -1) {
				console.log("Failed to load courses into form; status = -1");
				console.log("Errors: " + data.errors);
				return
			}
			courses = parse.courses(data);
			callback(courses);
		};
		var onFailure = function() {
			console.log("Failed to load courses for " + dept);
		};
		this.get('/api/courses?' + dept, onSuccess, onFailure);
	},

	/**
	 * Make a GET request for search results.
	 * @param {function} callback: Takes in an array of results and performs an
	 *   action upon it.
	 */
	getResults: function(callback) {
		return
	}
};
