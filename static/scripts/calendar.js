/**
 * The Calendar section of the page. This section graphically displays the user's
 * selected courses in calendar format, and is updated to reflect changes in the
 * user's schedule.
 */

var React    = require('react');
var ReactDOM = require('react-dom');

var ajax = require('./util/ajax.js');
var time = require('./util/time.js');

var hours = [
	"0800", "0900", "1000", "1100", "1200", "1300", "1400",
	"1500", "1600", "1700", "1800", "1900", "2000", "2100"
];

var Calendar = React.createClass({
	ccn: function(a, b) {
		// Hash to a CCN
		var hashCode = function(s) {
			return s.split("").reduce(function(a, b) {
				a = ((a << 5) - a) + b.charCodeAt(0);
				return a & a;
			}, 0);
		};
		return ((hashCode(a) * 1373 + hashCode(b) * 11) + "").slice(0, 5);
	},
	conflictsWith: function(newCourse) {
		return false;
		for (var i = 0; i < this.state.courses.length; i++) {
			var course = this.state.courses[i];
			var a  = time.parse(newCourse.time);
			var b  = time.parse(course.time);
			var aStart = parseInt(a.start);
			var aEnd   = parseInt(a.end);
			var bStart = parseInt(b.start);
			var bEnd   = parseInt(b.end);
			if (aStart >= bStart && aStart <= bEnd) {
				return true;
			} else if (aEnd >= bStart && aEnd <= bEnd) {
				return true;
			}
		}
		return false;
	},
	componentDidMount: function() {
		this.props.store.getSchedule();
	},
	getInitialState: function() {
		return {
			courses : [],
		};
	},
	render: function() {
		return (
			<div className='calendar'>
				<Calendar.Axis />
				<Calendar.Grid store={this.props.store} />
			</div>
		);
	},
});

Calendar.Axis = React.createClass({
	render: function() {
		var labels = [];
		for (var i = 0; i < hours.length; i++) {
			var tokens = time.display(hours[i]).split(":");
			var label = tokens[0] + tokens[1].substring(2, 4);
			labels.push(
				<div className='calendar-axis-label' key={i}>{label}</div>
			);
		}
		return (
			<div className='calendar-axis'>
				{labels}
			</div>
		);
	}
});

Calendar.Grid = React.createClass({
	componentDidMount: function() {
		var that = this;
		var callback = function() {
			var schedule = that.props.store.schedule();
			that.setState({
				courses : that.updatedCourses(schedule),
			});
		};
		this.props.store.addScheduleListener(callback);
	},
	getInitialState: function() {
		return {
			courses : {
				"M": [], "T": [], "W": [], "R": [], "F": [],
			}
		};
	},
	// @param course = {name, room, time, ccn}
	updatedCourses: function() {
		var courses = {
			"M": [], "T": [], "W": [], "R": [], "F": [],
		};
		this.props.store.schedule().forEach(function(course) {
			var t = time.parse(course.time);
			for (var i = 0; i < t.days.length; i++) {
				var day = t.days[i]
				var newCourse = {
					name : course.name,
					room : course.room,
					time : day + " " + t.start + " " + t.end,
					ccn  : course.ccn,
				};
				courses[day].push(newCourse);
			}
		});
		return courses;
	},
	render: function() {
		var columns = [];
		var courses = this.updatedCourses();
		for (var day in courses) {
			columns.push(
				<Calendar.Grid.Column store={this.props.store} key={day} day={day} courses={courses[day]} />
			);
		}
		return (
			<div className='calendar-grid'>
				{columns}
			</div>
		);
	}
});

Calendar.Grid.Column = React.createClass({
	// Render the static column of the Calendar and insert courses objects.
	render: function() {
		var cells = [];
		for (var i = 0; i < (hours.length - 1); i++) {
			cells.push(
				<div className='calendar-grid-column-cell' key={i}></div>
			);
		}
		var days = {
			"M": "Mon", "T": "Tues", "W": "Wed", "R": "Thurs", "F": "Fri",
		};
		return (
			<div className='calendar-grid-column'>
				<div className='calendar-grid-column-header'>
					{days[this.props.day]}
				</div>
				<Calendar.Grid.Column.Courses store={this.props.store} courses={this.props.courses} />
				{cells}
			</div>
		);
	}
});

Calendar.Grid.Column.Courses = React.createClass({
	// Graphically insert course into the Calendar. A conflict check should already
	// have occurred.
	render: function() {
		var that = this;
		var courses = [];
		this.props.courses.forEach(function(course) {
			courses.push(
				<Calendar.Course store={that.props.store} course={course} key={course.ccn} />
			);
		});
		return (
			<div className='calendar-grid-column-courses'>
				{courses}
			</div>
		);
	}
});

// http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
Calendar.Course = React.createClass({
	remove: function(e) {
		var c = this.props.course;
		this.props.store.removeCourse(c);
	},
	shorten: function(str) {
		var tokens = str.split(" ");
		var result = "";
		for (var i = 0; i < tokens.length - 1; i++) {
			result += tokens[i][0]
		}
		return result + " " + tokens[tokens.length - 1];
	},
	style: function() {
		var css = {};
		var c = this.props.course;
		var t = time.parse(c.time);
		// These are hard-coded appropriately to the static Calendar
		css.height = time.duration(t.start, t.end) * 32 / 60 - 1;
		css.top = time.duration("0800", t.start) * 34 / 60;
		return css;
	},
	render: function() {
		var c = this.props.course;
		var css = this.style();
		return (
			<div className='calendar-course' style={css}>
				<div className='calendar-course-name'>{this.shorten(c.name)}</div>
				<div className='calendar-course-type' hidden>{c.type}</div>
				<div className='calendar-course-room'>{c.room}</div>
				<div className='calendar-course-remove' onClick={this.remove}>
					X
				</div>
			</div>
		);
	}
});

module.exports = Calendar;
