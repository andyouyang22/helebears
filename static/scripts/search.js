/**
 * The Search section of the page. The user inputs search criteria into this
 * section, which sends the query to the backend server.
 */

var React    = require('react');
var ReactDOM = require('react-dom');

var ajax = require('./util/ajax.js');
var time = require('./util/time.js');

/**
 * Remove all key-value entries in 'dict' where the value is equal to 'val'.
 */
var clear_dict_key = function(val, dict){
	for (var key in dict) {
		if (dict[key] == val) {
			delete dict[key];
		};
	}
};

var Search = React.createClass({
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
		var that = this;
		var formDOM = $(ReactDOM.findDOMNode(this));
		var form = {
			department_name : formDOM.find('.search-dept').val(),
			name            : formDOM.find('.search-course').val(),
		};
		clear_dict_key(null, form);
		clear_dict_key('', form);
		this.props.store.getResults(form);

		// Remove the conflict indicator on the Calendar after moving on to new course
		this.props.store.conflictOff();
		// Unselect after a search to display new search results
		this.props.store.unselect();
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
