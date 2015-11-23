
var React = require('react');
var ReactDOM = require('react-dom');

var Menu = require('./menu.js');
var Calendar = require('./calendar.js');

var apiUrl = 'http://protected-refuge-7067.herokuapp.com';

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


/**
 * The Query section of the page. This section contains Search and Results.
 */

var queryify = function(query) {
	query = JSON.stringify(query);
	return query
		.replace(/"/g,"")
		.replace(/{/g,'')
		.replace(/}/g,'')
		.replace(/:/g,'=')
		.replace(/,/g,'&')
		.replace(/ /g,'%20');
}

var Query = React.createClass({
	clear: function() {
		this.setState({
			results : [],
		});
	},
	display: function(results) {
		this.setState({
			results : results,
		});
	},
	getInitialState: function() {
		return {
			results : [],
		};
	},
	render: function() {
		return (
			<div className='query'>
				<Search />
				<Results results={this.state.results} />
			</div>
		);
	}
});


/**
 * The Search section of the page. The user inputs search criteria into this
 * section, which sends the query to the backend server.
 */

var Search = React.createClass({
	convertCCN: function(ccn) {
		ccn = ccn + ""
		for (var i = ccn.length; i < 5; i++) {
			ccn = "0" + ccn;
		}
		return ccn;
	},
	convertTime: function(time) {
		var t = parseTime(time);
		// TODO: list all days for sections
		return t.days[0] + " " + t.start.slice(0, 4) + " " + t.end.slice(0, 4);
	},
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
			console.error("Failed to load list of departments");
		}
		makeGetRequest('/api/departments', onSuccess, onFailure);
		return {
			depts   : [],
			courses : [],
		};
	},
	handleDeptChange: function(e) {
		var that = this;
		var dept = queryify({
			department_name : e.target.value,
		});
		var onSuccess = function(data) {
			var courses = [];
			for (var i = 0; i < data.results.length; i++) {
				courses.push(data.results[i].name);
			}
			that.setState({
				courses : courses,
			});
		};
		var onFailure = function() {
			console.error("Failed to load courses for " + e.target.value);
		}
		makeGetRequest('/api/courses?' + dept, onSuccess, onFailure);
	},
	handleSubmission: function(e) {
		e.preventDefault();
		var that = this
		var form = $(ReactDOM.findDOMNode(this));
		// TODO: advanced search
		var request = queryify({
			department_name : form.find('.search-dept').val(),
			name            : form.find('.search-course').val(),
		});
		var onSuccess = function(data) {
			var results = [];
			data.results.forEach(function(lec) {
				var course = {
					name : lec.department_name + " " + lec.name,
					desc : lec.title,
					inst : lec.professor_name,
					room : lec.location,
					time : that.convertTime(lec.time),
					ccn  : that.convertCCN(lec.ccn),
					sections : [],
				};
				lec.sections.forEach(function(sec) {
					course.sections.push({
						time : that.convertTime(sec.time),
						ccn  : that.convertCCN(sec.ccn),
					});
				});
				results.push(course);
			});
			QueryAPI.display(results);
		};
		var onFailure = function() {
			console.error("Failed to load search results");
		};
		makeGetRequest('/api/courses?' + request, onSuccess, onFailure);
	},
	render: function() {
		return (
			<div className='search pure-form'>
				<fieldset className='pure-group'>
					<legend className='search-title'>Search Courses</legend>
					<Search.Dept depts={this.state.depts} onChange={this.handleDeptChange} />
					<Search.Course courses={[]} courses={this.state.courses} />
					<a className='pure-button search-submit' href='query.html' onClick={this.handleSubmission}>Search</a>
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

Search.Submit = React.createClass({
	render: function() {
		return (
			<input className='pure-button search-submit' type='submit' />
		);
	}
});

/**
 * The Results section of the page. Results contains a scrollable list of courses
 * that match the user's query.
 */

var Results = React.createClass({
	getInitialState: function() {
		return {
			reviews : [],
		};
	},
	render: function() {
		var results = [];
		this.props.results.forEach(function(c) {
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
	getInitialState: function() {
		return {
			review : {
				name    : "",
				ratings : [],
			},
		};
	},
	showReview: function(name, ratings) {
		var review = {
			name    : name,
			ratings : ratings,
		}
		this.setState({
			review : review,
		});
		var container = $(ReactDOM.findDOMNode(this)).find('.review-container');
		container.slideDown();
	},
	hideReview: function() {
		$(ReactDOM.findDOMNode(this)).find('.review-container').slideUp();
	},
	toggleSections: function() {
		$(ReactDOM.findDOMNode(this)).find('.results-course-sections').slideToggle();
	},
	render: function() {
		var c = this.props.course;
		return (
			<div className='results-course'>
				<Results.Course.Lecture name={c.name} desc={c.desc} inst={c.inst} time={c.time} room={c.room} ccn={c.ccn} toggleSections={this.toggleSections} showReview={this.showReview} />
				<Results.Course.Sections sections={this.props.course.sections} />
				<div className='review-container'>
					<Review review={this.state.review} hideReview={this.hideReview} />
				</div>
			</div>
		);
	}
});

Results.Course.Lecture = React.createClass({
	add: function() {
		var course = {
			name : this.props.name,
			room : this.props.room,
			time : this.props.time,
			ccn  : this.props.ccn,
		};
		CalendarAPI.insertCourse(course);
	},
	reviews: function() {
		var that = this;
		var onSuccess = function(data) {
			if (data.status == -1) {
				console.log("Failed to load professor reviews");
				console.log("Errors: " + data.errors);
			}
			var r = data.results;
			var ratings = [0, 0, 0];
			for (var i = 0; i < r.length; i++) {
				debugger
				ratings[0] += r[i].rating_1;
				ratings[1] += r[i].rating_2;
				ratings[2] += r[i].rating_3;
			}
			ratings[0] /= r.length;
			ratings[1] /= r.length;
			ratings[2] /= r.length;
			that.props.showReview(name, ratings);
		};
		var onFailure = function() {
			console.log("Failed to load professor reviews");
		};
		var prof = this.props.inst;
		makeGetRequest('/api/reviews?professor_name=' + prof, onSuccess, onFailure);
	},
	render: function() {
		var t = parseTime(this.props.time);
		var time = t.days + " " + displayTime(t.start) + " - " + displayTime(t.end);
		return (
			<div className='results-course-lecture'>
				<div className='results-course-lec-name' onClick={this.props.toggleSections}>{this.props.name}</div>
				<div className='results-course-lec-course-desc'>HIHIHI</div>
				<div className='results-course-lec-desc'>{this.props.desc}</div>
				<div className='results-course-lec-inst' onClick={this.reviews}>{this.props.inst}</div>
				<div className='results-course-lec-time'>{time}</div>
				<Results.Course.Lecture.Add add={this.add} />
			</div>
		);
	}
});

Results.Course.Lecture.Add = React.createClass({
	render: function() {
		return (
			<div className='results-course-lecture-add' onClick={this.props.add}>Add Course</div>
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
 * The Reviews section of the page. This area is only displayed when selected.
 */

var Review = React.createClass({
 	render: function() {
 		var r = this.props.review.ratings;
 		var overall = (r[0] + r[1] + r[2]) / 3
 		return (
			<div className="user-reviews-page-holder" id="user-reviews-page">
				<div className="hide-review" onClick={this.props.hideReview}>Hide</div>
				<div className='review review-overall'>
					<table className='pure-table review-values'>
						<thead>
							<tr className='row-1'>
								<th className='pure-group professor-name'>{this.props.name}</th>
								<th className='overall-rating'>{overall}</th>
							</tr>
						</thead>
						<tbody>
							<tr className='row-2'>
								<td>Clarity of Content</td>
								<td>{r[0]}</td>
							</tr>
							<tr className='row-3'>
								<td>Excitement Level</td>
								<td>{r[1]}</td>
							</tr>
							<tr className='row-4'>
								<td>Easiness</td>
								<td>{r[2]}</td>
							</tr>
						</tbody>
					</table>
				</div>
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

var testUser = "username420";

var MenuAPI = ReactDOM.render(
	<Menu />,
	document.getElementById('container-top')
);

var CalendarAPI = ReactDOM.render(
	<Calendar courses={[]} user={testUser} />,
	document.getElementById('container-left')
);

var QueryAPI = ReactDOM.render(
	<Query />,
	document.getElementById('container-right')
);
