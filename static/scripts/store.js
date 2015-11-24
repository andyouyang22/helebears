/**
 * The Store class. The Store stores the global front-end state associated with
 * the index.html dashboard page and offers an API for manipulating this state.
 * For example, the Store stores the courses currently displayed in the Calendar
 * (this._schedule). Clicking 'Add' on a new course results in an API call that
 * updates this course state. The Calendar, which will add itself as a listener
 * for schedule updates, reacts to this in a manner specified by calendar.js.
 * This provides a sort of abstraction between the Store and the View.
 *
 * See https://facebook.github.io/flux/docs/todo-list.html for inspiration.
 */

var EventEmitter = require('events');

var ajax = require('./util/ajax.js');

var Store = function() {
	// Courses currently displayed on the user's Calendar
	this._schedule = [];
	// Department currently selected in the Search form
	this._department = "";
	// Courses currently displayed in the Search form for a chosen department
	this._courses = [];
	// Results currently displayed in the Results section
	this._results = [];
};

Store.prototype = EventEmitter.prototype;

// ------------------------------- Schedule ------------------------------- //

/**
 * Make a GET request for the user's schedule and update the local schedule state
 * if necessary.
 */
Store.prototype.getSchedule = function() {
	ajax.getSchedule(this.setSchedule);
};

Store.prototype.setSchedule = function(schedule) {
	this._schedule = schedule;
	// Emit an event signaling the Calendar state has changed
	this.emit('schedule');
};

Store.prototype.addCourse = function(course) {
	this._schedule.push(course);
	// Emit an event signaling the Calendar state has changed
	this.emit('schedule');
};

Store.prototype.schedule = function() {
	return this._schedule;
};

// ------------------------------- Department ------------------------------- //

/**
 * Updates the state containing the currently selected department in the Search
 * form and makes a GET request for the department's courses.
 */
Store.prototype.setDepartment = function(dept) {
	if (this._department == dept) {
		return
	}
	this._department = dept;
	this.getCourses(dept);
};

// ------------------------------- Courses ------------------------------- //

/**
 * Make a GET request for the courses listed for the input departmet.
 */
Store.prototype.getCourses = function(dept) {
	ajax.getCourses(dept, this.setCourses.bind(this));
};

Store.prototype.setCourses = function(courses) {
	this._courses = courses;
	// Emit an event signaling the Courses state has changed
	this.emit('courses');
};

Store.prototype.courses = function() {
	return this._courses;
};

// ------------------------------- Results ------------------------------- //

/**
 * Make a GET request for search results based on the input query.
 */
Store.prototype.getResults = function() {
	// Make AJAX call
};

Store.prototype.setResults = function(results) {
	this._results = results;
	// Emit an event signaling the Results state has changed
	this.emit('results');
};

Store.prototype.results = function() {
	return this._results;
};

// ------------------------------- Listeners ------------------------------- //

/**
 * Add a listening for the schedule-change event.
 * @param {function} callback: Whenever the schedule being displayed in the user's
 *   Calendar changes (e.g. a course is added), this callback is called.
 */
Store.prototype.addScheduleListener = function(callback) {
	this.on('schedule', callback);
};

/**
 * Add a listening for the courses-change event.
 * @param {function} callback: Whenever the courses being displayed in the form
 *   change (e.g. a new dept is selected), this callback is called.
 */
Store.prototype.addCoursesListener = function(callback) {
	this.on('courses', callback);
};

/**
 * Add a listening for the results-change event.
 * @param {function} callback: Whenever the results being displayed in the Results
 *   section changes (e.g. a new search occurs), this callback is called.
 */
Store.prototype.addResultsListener = function(callback) {
	this.on('results', callback);
};

module.exports = Store;
