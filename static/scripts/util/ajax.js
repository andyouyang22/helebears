var parse = require('./parse.js');
var time  = require('./time.js');

//var apiUrl = 'https://protected-refuge-7067.herokuapp.com';
var apiUrl = '';
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
	post: function(url, data, onSuccess, onFailure) {
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
			//console.log(JSON.stringify(data));
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
	},

	/**
	 * Make a POST request to add the course with the given info.
	 */
	postAddCourse: function(course) {
		var onSuccess = function() {
			console.log("Successfully added course to user's schedule in backend");
		};
		var onFailure = function() {
			console.log("Failed to add course to user's schedule in backend");
		};
		var data = {
			name_and_number : course.name,
			course_time     : course.time,
			section_time    : course.time,
			lab_time        : course.time,
			ccn             : course.ccn
		};
		this.post('/api/schedules/add', data, onSuccess, onFailure);
	},

	/**
	 * Make a POST request to remove the course with the given info.
	 */
	postRemoveCourse: function(course) {
		var onSuccess = function(data) {
			if (data == -1) {
				console.log("Failed to removed course from user's schedule in backend");
				console.log("Errors: " + data.errors);
			} else {
				console.log("Successfully removed course from user's schedule");
			}
		};
		var onFailure = function() {
			console.log("Failed to removed course from user's schedule in backend");
		};
		var data = {
			name_and_number : course.name,
		};
		this.post('/api/schedules/remove', data, onSuccess, onFailure);
	},
};
