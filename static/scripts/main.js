
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
