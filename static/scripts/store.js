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
var time = require('./util/time.js');

/**
 * Note: course Objects should have the properties 'name', 'room', 'inst',
 * 'time', and 'ccn'.
 */

var Store = function() {
	// Courses currently displayed on the user's Calendar
	this._schedule = [];
	// Department currently selected in the Search form
	this._department = "";
	// Courses currently displayed in the Search form for a chosen department
	this._courses = [];
	// Results currently displayed in the Results section
	this._results = [];
	// Course currently causing a conflict during addCourse
	this._conflict = null;
};

// Inherit from the EventEmitter class
Store.prototype = EventEmitter.prototype;

// ------------------------------- Schedule ------------------------------- //

/**
 * Make a GET request for the user's schedule and update the local schedule state
 * if necessary.
 */
Store.prototype.getSchedule = function() {
	ajax.getSchedule(this.setSchedule.bind(this));
};

Store.prototype.setSchedule = function(schedule) {
	this._schedule = schedule;
	// Emit an event signaling the Calendar state has changed
	this.emit('schedule');
};

Store.prototype.addCourse = function(course) {
	// Check for any conflicts
	for (i = 0; i < this._schedule.length; i++) {
		var c = this._schedule[i];
		if (time.conflict(c, course)) {
			console.log("These courses conflict " + c + ", " + course);
			this.conflictOn(c);
			return;
		}
	}
	this._schedule.push(course);
	// Emit an event signaling the Calendar state has changed
	this.emit('schedule');
	ajax.postAddCourse(course);
};

Store.prototype.removeCourse = function(course) {
	// Remove all courses with the same ccn (there should only be one)
	var removed = false;
	for (i = 0; i < this._schedule.length; i++) {
		if (this._schedule[i].ccn == course.ccn) {
			this._schedule.splice(i, 1);
			removed = true;
		}
	}
	if (removed) {
		// Emit an event signaling the Calendar state has changed
		this.emit('schedule');
		ajax.postRemoveCourse(course);
	}
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
Store.prototype.getResults = function(form) {
	ajax.getResults(form, this.setResults.bind(this));
};

Store.prototype.setResults = function(results) {
	this._results = results;
	// Emit an event signaling the Results state has changed
	this.emit('results');
};

Store.prototype.results = function() {
	return this._results;
};

// ------------------------------- Conflict ------------------------------- //

Store.prototype.conflictOn = function(course) {
	this._conflict = course;
	this.emit('conflict');
};

Store.prototype.conflictOff = function() {
	this._conflict = null;
	this.emit('conflict');
};

Store.prototype.conflict = function() {
	return this._conflict;
};

// ------------------------------- Listeners ------------------------------- //

/**
 * Add a listener for the schedule-change event.
 * @param {function} callback: Whenever the schedule being displayed in the user's
 *   Calendar changes (e.g. a course is added), this callback is called.
 */
Store.prototype.addScheduleListener = function(callback) {
	this.on('schedule', callback);
};

/**
 * Add a listener for the courses-change event.
 * @param {function} callback: Whenever the courses being displayed in the form
 *   change (e.g. a new dept is selected), this callback is called.
 */
Store.prototype.addCoursesListener = function(callback) {
	this.on('courses', callback);
};

/**
 * Add a listener for the results-change event.
 * @param {function} callback: Whenever the results being displayed in the Results
 *   section changes (e.g. a new search occurs), this callback is called.
 */
Store.prototype.addResultsListener = function(callback) {
	this.on('results', callback);
};

/**
 * Add a listener for the conflict event. Whenever a conflict occurs, this event
 * will be emitted, and this._conflict will be set to the course in this_schedule
 * that causes the conflict. After the user submits a new search, this._conflict
 * will be reset to an empty object.
 * @param (function) callback: Whenever a conflict event is emitted, this callback
 *   is called. It should check the value of this._conflict to determine whether
 *   or not it should be executed.
 */
Store.prototype.addConflictListener = function(callback) {
	this.on('conflict', callback);
};

module.exports = Store;
