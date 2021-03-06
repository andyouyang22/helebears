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

var ajax  = require('./util/ajax.js');
var time  = require('./util/time.js');
var parse = require('./util/parse.js');

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
	// Course that is currently selected in the Result section
	this._selected = null;
	// Reviews for the course that is currently selected
	this._reviews = null;
	// Sections for the course that is currently selected
	this._sections = null;
	// True if the user currently has the review form open; false otherwise
	this._reviewForm = false;
	// Course currently causing a conflict during addCourse
	this._conflict = null;
	// Course that is currently highlighted
	this._highlight = null;
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
	// Split each course, creating a copy of the course for each day of lecture
	var splits = []
	for (i = 0; i < schedule.length; i++) {
		var c = schedule[i];
		splits = splits.concat(parse.split(c));
	}
	this._schedule = splits;
	// Emit an event signaling the Calendar state has changed
	this.emit('schedule');
};

Store.prototype.addCourse = function(course) {
	// Turn conflict off in case it was previously on
	this.conflictOff();
	// Add one Calendar course for each day of lecture
	var split = parse.split(course);
	// Check for any conflicts
	for (i = 0; i < this._schedule.length; i++) {
		var c = this._schedule[i];
		for (j = 0; j < split.length; j++) {
			if (time.conflict(c, split[j])) {
				this.conflictOn(c);
				return;
			}
		}
	}
	this._schedule = this._schedule.concat(split);
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
			i--;
			removed = true;
		}
	}
	if (removed) {
		if (this._conflict != null && course.ccn == this._conflict.ccn) {
			this.conflictOff();
		}
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
	// Solve the 'MTWTF' problem (two Tuesdays)
	this.tmp_solution();
	// Emit an event signaling the Results state has changed
	this.emit('results');
};

Store.prototype.results = function() {
	return this._results;
};

// If a course is scheduled for all five days, automatically change the second
// 'T' to an 'R' to distinguish Tues and Thurs. This problem should be resolved
// lated in the backend.
Store.prototype.tmp_solution = function() {
	for (i = 0; i < this._results.length; i++) {
		var c = this._results[i];
		var t = time.parse(c.time);
		if (t.days.length == 5) {
			this._results[i].time = ["MTWRF", t.start, t.end].join(" ");
		}
	}
};

// ------------------------------- Selected ------------------------------- //

Store.prototype.select = function(course) {
	this._selected = course;
	this.emit('selected');
};

Store.prototype.unselect = function() {
	this._selected = null;
	this.emit('selected');
};

Store.prototype.selected = function() {
	return this._selected;
};

// ------------------------------- Reviews ------------------------------- //

/**
 * @param {string} inst The name of the professor
 */
Store.prototype.getReviews = function(inst) {
	ajax.getReviews(inst, this.setReviews.bind(this));
}

Store.prototype.setReviews = function(reviews) {
	this._reviews = reviews;
	this.emit('reviews');
};

Store.prototype.reviews = function() {
	return this._reviews;
};

// ------------------------------- ReviewForm ------------------------------- //

Store.prototype.openReviewForm = function() {
	this._reviewForm = true;
	this.emit('reviewform');
};

Store.prototype.closeReviewForm = function() {
	this._reviewForm = false;
	this.emit('reviewform');
};

Store.prototype.postReview = function(review) {
	var callback = function(review) {
		if (this._selected != null && this._selected.inst == review.inst) {
			this._reviews.unshift(review);
			this.emit('reviews');
		}
	}.bind(this);
	ajax.postReview(review, callback);
};

Store.prototype.formOpen = function() {
	return this._reviewForm;
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

// ------------------------------- Conflict ------------------------------- //

Store.prototype.highlight = function(course) {
	this._highlight = course;
	this.emit('highlight');
};

Store.prototype.unhighlight = function() {
	this._highlight = null;
	this.emit('highlight');
};

Store.prototype.highlighted = function() {
	return this._highlight;
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
 * Add a listener for the selection event. This event is emitted whenever the user
 * selects any clickable part of a result (except for "Add Course"). this._selected
 * is assigned to this result. The event is also emitted when the result loses
 * focus, and this._selected is set back to null.
 * @param (function) callback: Whenever a selection event is emitted, this
 *   callback is called.
 */
Store.prototype.addSelectedListener = function(callback) {
	this.on('selected', callback);
};

/**
 * Add a listener for the reviews-change event. This event is emitted when the
 * user selects the professor's name and when the result becomes unselected.
 */
Store.prototype.addReviewsListener = function(callback) {
	this.on('reviews', callback);
};

/**
 * Add a listener for the review-form-change event. This event is emitted when the
 * ReviewForm is either opened or closed, and when the result becomes unselected.
 */
Store.prototype.addReviewFormListener = function(callback) {
	this.on('reviewform', callback);
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

/**
 * Add a listener for the highlight event. When a user is hovering over a course,
 * all related lectures (same CCN) should be highlighted.
 */
Store.prototype.addHighlightListener = function(callback) {
	this.on('highlight', callback);
};

module.exports = Store;
