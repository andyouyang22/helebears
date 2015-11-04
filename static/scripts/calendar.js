
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
	"0800",
	"0900",
	"1000",
	"1100",
	"1200",
	"1300",
	"1400",
	"1500",
	"1600",
	"1700",
	"1800",
	"1900",
	"2000",
	"2100"
];

var Calendar = React.createClass({
	getInitialState: function() {
		return {courses: this.props.courses}
	},
	render: function() {
		return (
			<div className='calendar'>
				<Calendar.Axis />
				<table className='calendar-grid'>
					<Calendar.Header />
					<Calendar.Body />
				</table>
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

Calendar.Header = React.createClass({
	render: function() {
		return (
			<thead className='calendar-header'>
				<tr>
					<th>Mon</th>
					<th>Tues</th>
					<th>Wed</th>
					<th>Thurs</th>
					<th>Fri</th>
				</tr>
			</thead>
		);
	}
});

Calendar.Body = React.createClass({
	componentDidMount: function() {
		var courses = this.state.courses;
		for (var i = 0; i < courses.length; i++) {
			this.insertCourse(courses[i]);
		}
	},
	/* Compare the input course against the current schedule and return true
	 * if there is a conflict */
	hasConflict: function(course) {
		return false;
	},
	getInitialState: function() {
		/* Should normally start empty; current non-empty for testing */
		return {courses: testCalendar};
	},
	insertCourse: function(course) {
		var t = parseTime(course.time);
		var rowIndex = Math.floor((parseInt(t.start) - 800) / 100);
		var colIndex = 0;
		switch (t.days) {
			case "M": colIndex = 0; break;
			case "T": colIndex = 1; break;
			case "W": colIndex = 2; break;
			case "R": colIndex = 3; break;
			case "F": colIndex = 4; break;
		}
		var row = $(ReactDOM.findDOMNode(this)).children().eq(rowIndex)
		var cell = row.children().eq(colIndex);
		/* Work still needs to be done here. Should I use jQuery or React? */
	},
	render: function() {
		var rows = [];
		for (var i = 0; i < hours.length - 1; i++) {
			rows.push(
				<tr className='calendar-row' key={i}>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
			);
		}
		return (
			<tbody className='calendar-body'>
				{rows}
			</tbody>
		);
	}
});

// http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
Calendar.Course = React.createClass({
	render: function() {
		var c = this.props.course;
		return (
			<div className='calendar-course'>
				<div className='calendar-course-name'>{c.name}</div>
				<div className='calendar-course-type'>{c.type}</div>
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

var timeBetween = function(time) {

};

/**
 * Sample data inputted into the application.
 */

var testCalendar = [
	{
		name : "CS 169",
		room : "306 Soda",
		time : "T 0930 1100"
	},
	{
		name : "CS 169",
		room : "306 Soda",
		time : "R 0930 1100"
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
	<Calendar courses={[]} />,
	document.getElementById('container-left')
);

ReactDOM.render(
	<Query />,
	document.getElementById('container-right')
);
