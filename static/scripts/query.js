/**
 * The Query section of the page. This section contains Search and Results.
 */

var React = require('react');

var Search  = require('./search.js');
var Results = require('./results.js');

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
				<Search store={this.props.store} />
				<Results store={this.props.store} />
			</div>
		);
	}
});

module.exports = Query;
