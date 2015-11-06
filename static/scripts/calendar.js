
/**
 * The Menu section of the page. This section displays the logo and may contain
 * additional menu buttons, such as the log-out button.
 */

var Menu = React.createClass({
	render: function() {
		return (
			<header>
				<Menu.Logo />
				<Menu.Buttons />
			</header>
		);
	}
});

Menu.Logo = React.createClass({
	render: function() {
		return (
			<a className='pure-menu-heading pure-menu-link'>HeleBears</a>
		);
	}
});

Menu.Buttons = React.createClass({
	render: function() {
		return (
			<ul className='pure-menu-list'></ul>
		);
	}
});


/**
 * The Calendar section of the page. This section graphically displays the user's
 * selected courses in calendar format, and is updated to reflect changes in the
 * user's schedule.
 */

var hours = [
	"0800", "0900", "1000", "1100", "1200", "1300", "1400",
	"1500", "1600", "1700", "1800", "1900", "2000", "2100"
];

var Calendar = React.createClass({
	getInitialState: function() {
		return {
			courses : this.props.courses,
		};
	},
	insertCourse: function(course) {
		// TODO: check for conflict
		// TODO: move time parsing to outside-most layer
		this.setState(function(state, props) {
			return {
				courses : state.courses.concat([course]),
			};
		});
	},
	render: function() {
		return (
			<div className='calendar'>
				<Calendar.Axis />
				<Calendar.Grid courses={this.state.courses} />
			</div>
		);
	}
});

Calendar.Axis = React.createClass({
	render: function() {
		var labels = [];
		for (var i = 0; i < hours.length; i++) {
			var tokens = displayTime(hours[i]).split(":");
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
		for (var i = 0; i < this.props.courses.length; i++) {
			this.insertCourse(this.props.courses[i]);
		}
	},
	getInitialState: function() {
		return {
			courses : {
				"M": [], "T": [], "W": [], "R": [], "F": [],
			}
		};
	},
	// @param course = {name, room, time, ccn}
	insertCourse: function(course) {
		var t =	parseTime(course.time);
		this.setState(function(state, props) {
			var updated = state.courses;
			// Create a course for each day (e.g. "TR" means two classes)
			for (var i = 0; i < t.days.length; i++) {
				var day = t.days[i]
				var newCourse = {
					name : course.name,
					room : course.room,
					time : day + " " + t.start + " " + t.end,
					ccn  : course.ccn,
				};
				updated[day].push(newCourse)
			}
			return {
				courses : updated,
			};
		});
	},
	render: function() {
		var columns = [];
		var courses = this.state.courses;
		for (var day in courses) {
			columns.push(
				<Calendar.Grid.Column key={day} day={day} courses={courses[day]} />
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
				<Calendar.Grid.Column.Courses courses={this.props.courses} />
				{cells}
			</div>
		);
	}
});

Calendar.Grid.Column.Courses = React.createClass({
	// Graphically insert course into the Calendar. A conflict check should already
	// have occurred.
	render: function() {
		var courses = [];
		this.props.courses.forEach(function(course) {
			courses.push(
				<Calendar.Course course={course} key={course.ccn} />
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
	style: function() {
		var css = {};
		var c = this.props.course;
		var t = parseTime(c.time);
		css.height = duration(t.start, t.end) * 32 / 60;
		css.top = duration("0800", t.start) * 34 / 60 - 1;
		return css;
	},
	render: function() {
		var c = this.props.course;
		var css = this.style();
		return (
			<div className='calendar-course' style={css}>
				<div className='calendar-course-name'>{c.name}</div>
				<div className='calendar-course-type' hidden>{c.type}</div>
				<div className='calendar-course-room'>{c.room}</div>
			</div>
		);
	}
});


/**
 * The Query section of the page. This section contains Search and Results.
 */

var Query = React.createClass({
	render: function() {
		return (
			<div className='query'>
				<Search />
				<Results courses={[]} />
			</div>
		);
	}
});


/**
 * The Search section of the page. The user inputs search criteria into this
 * section, which sends the query to the backend server.
 */

var Search = React.createClass({
	render: function() {
		return (
			<div className='search pure-form'>
				<fieldset className='pure-group'>
					<legend className='search-title'>Search Courses</legend>
					<Search.Dept depts={[]} />
					<Search.Course />
					<a className='pure-button search-submit' href='query.html'>Search</a>
				</fieldset>
			</div>
		);
	}
});

/**
 *  "Warning: Use the `defaultValue` or `value` props on <select> instead of setting
 * `selected` on <option>." - console
 */
Search.Dept = React.createClass({
	render: function() {
		return (
			<select className='search-dept'>
				<option className='default-option' selected disabled>Department</option>
				{this.props.depts}
			</select>
		);
	}
});

Search.Course = React.createClass({
	render: function() {
		return (
			<select className='search-course'>
				<option className='default-option' selected disabled>Course</option>
			</select>
		);
	}
});


/**
 * The Results section of the page. Results contains a scrollable list of courses
 * that match the user's query.
 */

var Results = React.createClass({
	clearResults: function() {
		this.state.results = [];
	},
	displayResults: function(results) {
		this.state.results = results;
	},
	getInitialState: function() {
		/* Should normally start empty; current non-empty for testing */
		return {results: testResults};
	},
	render: function() {
		var results = [];
		this.state.results.forEach(function(c) {
			results.push(
				<Results.Course key={c.ccn} course={c} />
			);
		});
		return (
			<div className='results'>
				{results}
			</div>
		);
	}
});

Results.Course = React.createClass({
	toggleSections: function() {
		$(ReactDOM.findDOMNode(this)).find('.results-course-sections').slideToggle();
	},
	render: function() {
		var c = this.props.course;
		return (
			<div className='results-course'>
				<Results.Course.Lecture name={c.name} desc={c.desc} inst={c.inst} time={c.time} toggleSections={this.toggleSections} />
				<Results.Course.Sections sections={this.props.course.sections} />
			</div>
		);
	}
});

Results.Course.Lecture = React.createClass({
	render: function() {
		var t = parseTime(this.props.time);
		var time = t.days + " " + displayTime(t.start) + " - " + displayTime(t.end);
		return (
			<div className='results-course-lecture'>
				<div className='results-course-lec-name' onClick={this.props.toggleSections}>{this.props.name}</div>
				<div className='results-course-lec-desc'>{this.props.desc}</div>
				<div className='results-course-lec-inst'>{this.props.inst}</div>
				<div className='results-course-lec-time'>{time}</div>
			</div>
		);
	}
});

Results.Course.Sections = React.createClass({
	render: function() {
		var sections = {
			mon   : [],
			tues  : [],
			wed   : [],
			thurs : [],
			fri   : []
		}
		for (var i = 0; i < this.props.sections.length; i++) {
			var sec = this.props.sections[i];
			var time = parseTime(sec.time);
			switch (time.days) {
				case "M":
					sections.mon.push(<Results.Course.Sections.Section key={sec.ccn} time={sec.time}/>); break;
				case "T":
					sections.tues.push(<Results.Course.Sections.Section key={sec.ccn} time={sec.time}/>); break;
				case "W":
					sections.wed.push(<Results.Course.Sections.Section key={sec.ccn} time={sec.time}/>); break;
				case "R":
					sections.thurs.push(<Results.Course.Sections.Section key={sec.ccn} time={sec.time}/>); break;
				case "F":
					sections.fri.push(<Results.Course.Sections.Section key={sec.ccn} time={sec.time}/>); break;
			}
		}
		return (
			<div className='results-course-sections' style={{display: 'none'}}>
				<div className='results-course-sections-col'>
					<div className='results-course-sections-col-header'>Mon</div>
					{sections.mon}
				</div>
				<div className='results-course-sections-col'>
					<div className='results-course-sections-col-header'>Tues</div>
					{sections.tues}
				</div>
				<div className='results-course-sections-col'>
					<div className='results-course-sections-col-header'>Wed</div>
					{sections.wed}
				</div>
				<div className='results-course-sections-col'>
					<div className='results-course-sections-col-header'>Thurs</div>
					{sections.thurs}
				</div>
				<div className='results-course-sections-col'>
					<div className='results-course-sections-col-header'>Fri</div>
					{sections.fri}
				</div>
			</div>
		);
	}
});

Results.Course.Sections.Section = React.createClass({
	render: function() {
		var t = parseTime(this.props.time);
		var time = displayTime(t.start) + " - " + displayTime(t.end);
		return (
			<div className='results-course-sections-sec'>
				{time}
			</div>
		);
	}
});


/**
 * Time-parsing-related helper functions.
 */

/**
 * Return a dictionary containing parsed time information. An example input string
 * is "TR 1400 1530".
 */
var parseTime = function(time) {
	var tokens = time.split(" ");
	return {
		days  : tokens[0],
		start : tokens[1],
		end   : tokens[2]
	};
};

/**
 * Return the AM/PM formatted string of a military-time input. For example, if the
 * input string was "1400", the function would return "2:00 pm"
 */
var displayTime = function(time) {
	var hour = time.substring(0, 2);
	var min  = time.substring(2, 4);
	var suffix = "am";

	var hour = parseInt(hour);

	if (hour >= 12) {
		suffix = "pm";
		hour -= 12;
	}
	if (hour == 0) {
		hour = "12";
	}

	return hour + ":" + min + suffix
};

var duration = function(start, end) {
	var dur = parseInt(end) - parseInt(start);
	return Math.floor(dur / 100) * 60 + ((dur % 100 != 0) ? 30 : 0);
};

/**
 * Sample data inputted into the application.
 */

var testCalendar = [
	{
		name : "CS 168",
		room : "155 Dwinelle",
		time : "TR 1700 1830",
		ccn  : "26601",
	},
	{
		name : "CS 169",
		room : "306 Soda",
		time : "TR 0930 1100",
		ccn  : "26646",
	}
];

var testResults = [
	{
		name : "Computer Science 168",
		desc : "Internet Architecture and Protocol",
		inst : "Scott Shenker",
		time : "TR 1700 1830",
		ccn  : "26601",
		sections : [
			{
				time : "T 1400 1530",
				ccn  : "26602",
			},
			{
				time : "R 1400 1530",
				ccn  : "26603",
			},
			{
				time : "R 1530 1700",
				ccn  : "26604",
			}
		],
	},
	{
		name : "Computer Science 169",
		desc : "Software Engineering",
		inst : "George Necula",
		time : "TR 0930 1100",
		ccn  : "26646",
		sections : [],
	},
	{
		name : "Computer Science 170",
		desc : "Efficient Algorithms and Intractable Problems",
		inst : "Prasat Raghavendra",
		time : "MW 1400 1530",
		ccn  : "26661",
		sections : [],
	},
	{
		name : "Computer Science 186",
		desc : "Introduction to Database Systems",
		inst : "Eric Brewer",
		time : "MW 1700 1830",
		ccn  : "26757",
		sections : [],
	},
	{
		name : "Computer Science 188",
		desc : "Introduction to Artifical Intelligence",
		inst : "Stewart Russell",
		time : "TR 1230 1400",
		ccn  : "26799",
		sections : [],
	},
	{
		name : "Computer Science 189",
		desc : "Introduction to Machine Learning",
		inst : "Alexei Efros",
		time : "TR 1230 1400",
		ccn  : "26847",
		sections : [],
	}
];

ReactDOM.render(
	<Menu />,
	document.getElementById('container-top')
);

ReactDOM.render(
	<Calendar courses={testCalendar} />,
	document.getElementById('container-left')
);

ReactDOM.render(
	<Query />,
	document.getElementById('container-right')
);
