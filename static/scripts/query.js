/**
 * The Query section of the page. This section contains Search and Results.
 */

var React    = require('react');
var ReactDOM = require('react-dom');

var Search   = require('./search.js');
var Results  = require('./results.js');

var Query = React.createClass({
	clear: function() {
		this.setState({
			results : [],
		});
	},
	resultsDisplay: function(results) {
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
				<Search resultsDisplay={this.resultsDisplay} />
				<Results results={this.state.results} />
			</div>
		);
	}
});

module.exports = Query;
