var parse = require('./parse.js');
var time  = require('./time.js');

var apiUrl = 'http://protected-refuge-7067.herokuapp.com';

var queryify = function(query) {
	query = JSON.stringify(query);
	return query
		.replace(/"/g,"")
		.replace(/{/g,'')
		.replace(/}/g,'')
		.replace(/:/g,'=')
		.replace(/,/g,'&')
		.replace(/ /g,'%20');
};

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
				return;
			}
			var courses = parse.schedule(data);
			callback(schedule);
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
				return;
			}
			var depts = parse.departments(data);
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
				return;
			}
			var courses = parse.courses(data);
			callback(courses);
		};
		var onFailure = function() {
			console.log("Failed to load courses for " + dept);
		};
		var deptQuery = queryify({
			department_name : dept,
		});
		this.get('/api/courses?' + deptQuery, onSuccess, onFailure);
	},

	/**
	 * Make a GET request for search results for the given form info.
	 * @param {function} callback: Takes in an array of results and performs an
	 *   action upon it.
	 */
	getResults: function(form, callback) {
		var request = queryify(form);
		var onSuccess = function(data) {
			if (data.status == -1) {
				console.log("Failed to load search results; status = -1");
				console.log("Errors: " + data.errors);
				return;
			}
			var results = parse.results(data);
			callback(results);
		};
		var onFailure = function() {
			console.error("Failed to load search results");
		};
		this.get('/api/courses?' + request, onSuccess, onFailure);
	}
};
