/**
 * The Store class. The Store stores the global front-end state associated with
 *  the index.html dashboard page and offers an API for manipulating this state.
 */

var EventEmitter = require('events');

var ajax = require('./util/ajax.js');

var Store = function() {
	// Courses currently displayed on the user's Calendar
	this._schedule = [];
	// Courses currently displayed in the Search form for a chosen department
	this._courses = [];
	// Results currently displayed in the Results section
	this._results = [];
};

Store.prototype = EventEmitter.prototype;

Store.prototype.schedule = function() {
	return this._schedule;
};

Store.prototype.addCourse = function(course) {
	this._schedule.push(course);
	this.emit('schedule');
};

Store.prototype.setSchedule = function(schedule) {
	this._schedule = schedule;
	this.emit('schedule');
};

/**
 * Make a GET request for the user's schedule and update the local schedule state
 * if necessary.
 */
Store.prototype.getSchedule = function() {
	ajax.getSchedule(this.setSchedule);
};

Store.prototype.results = function() {
	return this._results;
};

Store.prototype.setResults = function(results) {
	this._results = results;
	this.emit('results');
};

/**
 * Make a GET request for search results based on the input query.
 */
Store.prototype.getResults = function() {
	// Make AJAX call
};

/**
 * Add a listening for the schedule-change event.
 * @param {function} callback: Whenever the schedule being displayed in the user's
 *   Calendar changes (e.g. a course is added), this callback is called.
 */
Store.prototype.addCoursesListener = function(callback) {
	this.on('schedule', callback);
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
