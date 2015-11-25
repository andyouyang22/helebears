/**
 * The Reviews section of the page. This area is only displayed when selected.
 */

var React    = require('react');
var ReactDOM = require('react-dom');

var ajax = require('./util/ajax.js');
var time = require('./util/time.js');

var Reviews = React.createClass({
 	render: function() {
 		var reviews = this.props.reviews;
 		return (
 			<div className='reviews'>
 				<Reviews.Overall reviews={reviews} inst={this.props.inst} />
 				<Reviews.Entries reviews={reviews} />
 			</div>
 		);
 	}
});

Reviews.Overall = React.createClass({
	averages: function() {
		var avgs = [0, 0, 0];
		var reviews = this.props.reviews;
		for (i = 0; i < reviews.length; i++) {
			var r = reviews[i];
			avgs[0] += (r.rating_1 / review.length);
			avgs[1] += (r.rating_2 / review.length);
			avgs[2] += (r.rating_3 / review.length);
		}
		return avgs;
	},
	render: function() {
		var avgs = this.averages();
		var overall = (avgs[0] + avgs[1] + avgs[2]) / 3;
		return (
			<div className='reviews-overall'>
				<div className='reviews-overall-header'>
					<span className='reviews-overall-inst'>
	 					{this.props.inst}
	 				</span>
	 				<span className='reviews-overall-overall'>
	 					{overall}
	 				</span>
 				</div>
 				<Reviews.Overall.Table averages={avgs} />
			</div>
		);
	},
});

Reviews.Overall.Table = React.createClass({
	render: function() {
		return (
			<table className='reviews-overall-table'>
				<tbody>
					<tr>
						<td className='reviews-overall-table-left'>Difficulty</td>
						<td className='reviews-overall-table-right'>
							{this.props.averages[0]}
						</td>
					</tr>
					<tr>
						<td className='reviews-overall-table-left'>Engagement</td>
						<td className='reviews-overall-table-right'>
							{this.props.averages[1]}
						</td>
					</tr>
					<tr>
						<td className='reviews-overall-table-left'>Content</td>
						<td className='reviews-overall-table-right'>
							{this.props.averages[2]}
						</td>
					</tr>
				</tbody>
			</table>
		);
	},
});

Reviews.Entries = React.createClass({
	render: function() {
		var entries = [];
		for (i = 0; i < this.props.reviews.length; i++) {
			r = this.props.reviews[i];
			entries.push(
				<Reviews.Entry key={i} review={r} />
			);
		}
		if (entries.length == 0) {
			entries.push(
				<div className='reviews-entries-none'>
					{"None"}
				</div>
			);
		}
		return (
			<div className='reviews-entries'>
				<div className='reviews-entries-header'>
					Reviews
				</div>
				<div className='reviews-entries-container'>
					{entries}
				</div>
			</div>
		);
	}
});

Reviews.Entry = React.createClass({
	render: function() {
		return (
			<div className='reviews-entry'>
				<table className='reviews-entry-table'>
					<tbody>
						<tr>
							<td className='reviews-entry-table-left'>Difficulty</td>
							<td className='reviews-entry-table-right'>
								{this.props.review.rating_1}
							</td>
						</tr>
						<tr>
							<td className='reviews-entry-table-left'>Engagement</td>
							<td className='reviews-entry-table-right'>
								{this.props.review.rating_2}
							</td>
						</tr>
						<tr>
							<td className='reviews-entry-table-left'>Content</td>
							<td className='reviews-entry-table-right'>
								{this.props.review.rating_3}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	},
});

module.exports = Reviews;
