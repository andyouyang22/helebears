
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
			<ul className='pure-menu-list'>
				<Menu.LogIn />
				<Menu.SignUp />
			</ul>
		);
	}
});

Menu.LogIn = React.createClass({
	render: function() {
		return (
			<li className='pure-menu-item button'>
				<a className='pure-menu-link log-in'>Log In</a>
			</li>
		);
	}
});

Menu.SignUp = React.createClass({
	render: function() {
		return (
			<li className='pure-menu-item button'>
				<a className='pure-menu-link sign-up'>Sign Up</a>
			</li>
		);
	}
});

Menu.LogIn.Form = React.createClass({
	render: function() {
		return (
			<form className='pure-form pure-form-aligned log-in-form drop-down-form' onsubmit="return false">
				<fieldset>
					<div className='pure-control-group'>
						<label for='username'>Username</label>
						<input type='text' name='username' placeholder="Username" required />
					</div>
					<div className='pure-control-group'>
						<label for='password'>Password</label>
						<input type='password' name='password' placeholder="Password" required />
					</div>
				</fieldset>
				<div className='pure-controls'>
					<label className='pure-checkbox' for='remember-me'>
						<input name='remember-me' type='checkbox' /> Remember me
					</label>
					<button className='pure-button submit-log-in' type='submit'>Log In</button>
				</div>
			</form>
		);
	}
});

Menu.SignUp.Form = React.createClass({
	render: function() {
		return (
			<form class='pure-form pure-form-aligned sign-up-form drop-down-form' onsubmit="return false">
				<fieldset>
					<div class='pure-control-group'>
						<label for='username'>Username</label>
						<input type='text' name='username' placeholder="Username" required />
					</div>
					<div class='pure-control-group'>
						<label for='password'>Enter password</label>
						<input type='password' name='password' placeholder="Password" required />
					</div>
					<div class='pure-control-group'>
						<label for='password'>Confirm password</label>
						<input type='password' name='password' placeholder="Password" required />
					</div>
				</fieldset>
				<div class='pure-controls'>
					<button class='pure-button submit-sign-up' type='submit'>Sign Up</button>
				</div>
			</form>
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
	removeCourse: function(ccn) {
		this.setState(function(state, props) {
			for (var i = 0; i < state.courses.length; i++) {
				if (state.courses[i].ccn == ccn) {
					state.courses.splice(i, 1);
				}
			}
			return {
				courses : state.courses,
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
		// These are hard-coded appropriately to the static Calendar
		css.height = duration(t.start, t.end) * 32 / 60 - 1;
		css.top = duration("0800", t.start) * 34 / 60;
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

var apiUrl = 'https://protected-refuge-7067.herokuapp.com';

var makeGetRequest = function(url, onSuccess, onFailure) {
	$.ajax({
		type: 'GET',
		url: apiUrl + url,
		dataType: "json",
		success: onSuccess,
		error: onFailure
	});
};

var makePostRequest = function(url, data, onSuccess, onFailure) {
	$.ajax({
		type: 'POST',
		url: apiUrl + url,
		data: JSON.stringify(data),
		contentType: "application/json",
		dataType: "json",
		success: onSuccess,
		error: onFailure
	});
};

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
	getInitialState: function() {
		var that = this;
		var onSuccess = function(data) {
			var depts = [];
			for (var i = 0; i < data.results.length; i++) {
				depts.push(data.results[i].department_name);
			}
			that.setState({
				depts : depts,
			});
		};
		var onFailure = function() {
			console.error("Could not get department list");
		}
		makeGetRequest('/api/departments', onSuccess, onFailure);
		return {
			depts   : [],
			courses : [],
		};
	},
	handleDeptChange: function() {
		var that = this;
		var dept = "Physics";
		var onSuccess = function(data) {
			// pineapple
			data = {"status":1,"results":[{"name":"18D","number":11,"name_and_number":"18D 11","professor_name":"Lenovo","department_name":"Physics","type":"LEC","title":"Computer Electricity","ccn":314,"units":4,"time":"MF 9000AM 1300PM","location":"WHEELER","final_slot":2,"limit":10,"enrolled":7,"waitlist":0,"note":"","createdAt":"2015-10-24T01:50:42.638Z","updatedAt":"2015-10-24T01:50:42.638Z","sections":[]}]}
			var courses = [];
			for (var i = 0; i < data.results.length; i++) {
				courses.push(data.results[i].name);
			}
			that.setState({
				courses : courses,
			});
		};
		var onFailure = function() {
			console.error("Could not get course list");
		}
		makeGetRequest('/api/courses?department_name=' + dept, onSuccess, onFailure);
	},
	render: function() {
		return (
			<div className='search pure-form'>
				<fieldset className='pure-group'>
					<legend className='search-title'>Search Courses</legend>
					<Search.Dept depts={this.state.depts} onChange={this.handleDeptChange} />
					<Search.Course courses={[]} courses={this.state.courses} />
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
		var depts = [];
		this.props.depts.forEach(function(dept) {
			depts.push(
				<option value={dept} key={dept}>{dept}</option>
			);
		});
		var change = this.props.onChange;
		return (
			<select className='search-dept' defaultValue='disabled' onChange={change}>
				<option className='default-option' value='disabled' disabled>
					Department
				</option>
				{depts}
			</select>
		);
	}
});

Search.Course = React.createClass({
	render: function() {
		var courses = [];
		this.props.courses.forEach(function(course) {
			courses.push(
				<option value={course} key={course}>{course}</option>
			);
		});
		return (
			<select className='search-course'>
				<option className='default-option' defaultValue='disabled' disabled>
					Course
				</option>
				{courses}
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
	},
	{
		name : "UGBA 104",
		room : "F295 Haas",
		time : "M 0930 1100",
		ccn  : "08085",
	},
	{
		name : "UGBA 106",
		room : "F295 Haas",
		time : "T 0800 0930",
		ccn  : "08133",
	},
	{
		name : "UGBA 115",
		room : "330 Cheit",
		time : "TR 1230 1400",
		ccn  : "08175",
	},
	{
		name : "UGBA 191I",
		room : "Memorial Std",
		time : "W 1400 1700",
		ccn  : "08304",
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
