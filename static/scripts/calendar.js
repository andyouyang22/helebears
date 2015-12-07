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
	componentDidMount: function() {
		var that = this;
		var callback = function() {
			that.setState({
				conflict : that.props.store.conflict(),
			});
		};
		this.props.store.addConflictListener(callback);
		this.props.store.getSchedule();
	},
	conflictString: function() {
		var conflict = this.state.conflict;
		if (conflict != null) {
			return "There is a conflict with " + conflict.name;
		}
		return "";
	},
	getInitialState: function() {
		return {
			conflict  : null
		};
	},
	render: function() {
		return (
			<div className='calendar'>
				<div className='calendar-conflict'>
					{this.conflictString()}
				</div>
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

Calendar.Course = React.createClass({
	componentDidMount: function() {
		var that = this;

		var conflictCallback = function() {
			var course = that.props.course;
			var conflict = that.props.store.conflict();
			var conflicting = (conflict != null && conflict.ccn == course.ccn);
			that.setState({
				conflicting : conflicting,
			});
		};
		this.props.store.addConflictListener(conflictCallback);

		var highlightCallback = function() {
			var course = that.props.course;
			var highlight = that.props.store.highlighted();
			var highlighted = (highlight != null && highlight.ccn == course.ccn);
			that.setState({
				highlighted : highlighted,
			});
		}
		this.props.store.addHighlightListener(highlightCallback);
	},
	getInitialState: function() {
		return {
			conflicting : false,
			highlighted : false,
		};
	},
	remove: function(e) {
		var c = this.props.course;
		this.props.store.removeCourse(c);
		this.props.store.unhighlight();
	},
	shorten: function(str) {
		var tokens = str.split(" ");
		var result = "";
		for (var i = 0; i < tokens.length - 1; i++) {
			result += tokens[i][0]
		}
		return result + " " + tokens[tokens.length - 1];
	},
	position: function() {
		var c = this.props.course;
		var t = time.parse(c.time);
		// These are hard-coded appropriately to the static Calendar
		return {
			height : time.duration(t.start, t.end) * 32 / 60 - 1,
			top    : time.duration("0800", t.start) * 34 / 60 + 35,
		};
	},
	style: function() {
		var css = this.position();
		if (this.state.conflicting) {
			css['border'] = "2px solid red";
			css['left'] = "calc(4% - 1px)";
			css['top'] -= 1;
		}
		if (!this.state.highlighted && this.props.store.highlighted() != null) {
			css['opacity'] = 0.5
		}
		return css;
	},
	render: function() {
		var c = this.props.course;
		var store = this.props.store;
		var over = store.highlight.bind(store, c);
		var out = store.unhighlight.bind(store)
		return (
			<div className='calendar-course' style={this.style()} onMouseOver={over} onMouseOut={out}>
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
