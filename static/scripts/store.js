/**
 * The Store constructor. The Store stores the global front-end state associated
 * with the index.html dashboard page.
 */

var EventEmitter = require('events');

var Store = function() {
	this._courses = [];
	this._results = [];
};

Store.prototype = EventEmitter;

Store.prototype.displayResults = function(results) {
	this._results = results;
};

Store.prototype.getResults = function(results) {
	return this._results;
}

Store.prototype.addCourse = function(course) {
	this._courses.push(course);
};

Store.prototype.getCourses = function() {
	return this._courses;
}

Store.prototype.addCoursesListener = function(callback) {
	this.on('courses', callback);
}

Store.prototype.addResultsListener = function(callback) {
	this.on('results', callback);
}

module.exports = Store;
