/**
 * The Search section of the page. The user inputs search criteria into this
 * section, which sends the query to the backend server.
 */

var React    = require('react');
var ReactDOM = require('react-dom');

var ajax = require('./util/ajax.js');
var time = require('./util/time.js');

var Search = React.createClass({
	convertCCN: function(ccn) {
		ccn = ccn + ""
		for (var i = ccn.length; i < 5; i++) {
			ccn = "0" + ccn;
		}
		return ccn;
	},
	convertTime: function(t) {
		var t = time.parse(t);
		// TODO: list all days for sections
		return t.days[0] + " " + t.start.slice(0, 4) + " " + t.end.slice(0, 4);
	},
	componentDidMount: function() {
		// Used to ensure 'this' is consistent during asynchronous callbacks
		var that = this;

		var courseCallback = function() {
			that.setState({
				courses : that.props.store.courses(),
			});
		};
		this.props.store.addCoursesListener(courseCallback);

		var deptCallback = function(depts) {
			that.setState({
				depts : depts,
			});
		};
		// Make a GET request for department names; update the Search form state
		// using the above callback when the HTTP response arrives
		ajax.getDepartments(deptCallback);
	},
	getInitialState: function() {
		return {
			depts   : [],
			courses : [],
		};
	},
	handleDeptChange: function(e) {
		var dept = e.target.value;
		this.props.store.setDepartment(dept);
	},
	handleSubmission: function(e) {
		e.preventDefault();
		var that = this
		var form = $(ReactDOM.findDOMNode(this));
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
			that.props.resultsDisplay(results);
		};
		var onFailure = function() {
			console.error("Failed to load search results");
		};
		ajax.get('/api/courses?' + request, onSuccess, onFailure);
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

module.exports = Search;
