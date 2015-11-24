/**
 * The Store class. The Store stores the global front-end state associated with
 *  the index.html dashboard page and offers an API for manipulating this state.
 */

var EventEmitter = require('events');

var ajax = require('./util/ajax.js');

var Store = function() {
	// Courses currently displayed on the user's Calendar
	this._courses = [];
	// Results currently displayed in the Results section
	this._results = [];
};

Store.prototype = EventEmitter.prototype;

Store.prototype.courses = function() {
	return this._courses;
};

Store.prototype.addCourse = function(course) {
	this._courses.push(course);
	this.emit('courses');
};

Store.prototype.setCourses = function(courses) {
	this._courses = courses;
	this.emit('courses');
};

/**
 * Make a GET request for the user's courses.
 */
Store.prototype.getCourses = function() {
	ajax.getCourses(this.setCourses);
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

Store.prototype.addCoursesListener = function(callback) {
	this.on('courses', callback);
};

Store.prototype.addResultsListener = function(callback) {
	this.on('results', callback);
};

module.exports = Store;
