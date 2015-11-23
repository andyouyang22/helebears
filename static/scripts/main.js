
var React    = require('react');
var ReactDOM = require('react-dom');

var Menu     = require('./menu.js');
var Calendar = require('./calendar.js');
var Search   = require('./search.js');
var Results  = require('./results.js');

var ajax = require('./ajax.js');
var time = require('./time.js');

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
