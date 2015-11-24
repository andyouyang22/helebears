/**
 * The Store constructor. The Store stores the global front-end state associated
 * with the index.html dashboard page.
 */

var EventEmitter = require('events');

var ajax = require('./ajax.js');

var Store = function() {
	// Courses currently displayed on the user's Calendar
	this._courses = [];
	// Results currently displayed in the Results section
	this._results = [];
};

Store.prototype = EventEmitter;

Store.prototype.courses = function() {
	return this._courses;
};

Store.prototype.addCourse = function(course) {
	this._courses.push(course);
	this.emit('courses');
};

Store.prototype.getCourses = function() {
	// Make AJAX call
};

Store.prototype.results = function() {
	return this._results;
};

Store.prototype.displayResults = function(results) {
	this._results = results;
	this.emit('results');
};

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
