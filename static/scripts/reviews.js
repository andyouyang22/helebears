/**
 * The Reviews section of the page. This area is only displayed when selected.
 */

var React    = require('react');
var ReactDOM = require('react-dom');

var ReviewForm = require('./review-form.js');

var ajax = require('./util/ajax.js');
var time = require('./util/time.js');

var Reviews = React.createClass({
 	render: function() {
 		var reviews = this.props.reviews;
 		var inst = this.props.inst;
 		var store = this.props.store;
 		return (
 			<div className='reviews'>
 				<Reviews.Overall reviews={reviews} inst={inst} />
 				<Reviews.Entries reviews={reviews} inst={inst} store={store} />
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
			avgs[0] += (r.rating_1 / reviews.length);
			avgs[1] += (r.rating_2 / reviews.length);
			avgs[2] += (r.rating_3 / reviews.length);
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
	back: function() {
		this.setState({
			create : false,
		});
	},
	create: function() {
		this.setState({
			create : true,
		});
	},
	content: function() {
		if (this.state.create) {
			return (
				<div>
					<Reviews.Back back={this.back} />
					<ReviewForm store={this.props.store} inst={this.props.inst} back={this.back} />
				</div>
			);
		}
		else {
			return (
				<div>
					<Reviews.Create create={this.create} />
					<div className='reviews-entries-container'>
						{this.entries()}
					</div>
				</div>
			);
		}
	},
	entries: function() {
		var entries = [];
		for (i = 0; i < this.props.reviews.length; i++) {
			r = this.props.reviews[i];
			entries.push(
				<Reviews.Entry key={i} review={r} />
			);
		}
		if (entries.length == 0) {
			entries = (
				<div className='reviews-entries-none'>
					{"None"}
				</div>
			);
		}
		return entries;
	},
	componentDidMount: function() {
		var that = this;
		var callback = function() {
			if (that.props.store.selected() == null) {
				that.setState({
					create : false,
				});
			}
		};
		this.props.store.addSelectedListener(callback);
	},
	getInitialState: function() {
		return {
			create : false,
		};
	},
	render: function() {
		var header = "Reviews";
		if (this.state.create) {
			header = "Write a review"
		}
		return (
			<div className='reviews-entries'>
				<div className='reviews-entries-header'>
					{header}
				</div>
				{this.content()}
			</div>
		);
	}
});

Reviews.Create = React.createClass({
	render: function() {
		return (
			<div className='reviews-create' onClick={this.props.create}>
				{"+"}
			</div>
		);
	},
});

Reviews.Back = React.createClass({
	render: function() {
		return (
			<div className='reviews-back' onClick={this.props.back}>
				{"Back"}
			</div>
		);
	}
});

Reviews.Entry = React.createClass({
	render: function() {
		return (
			<div className='reviews-entry'>
				{this.props.review.review}
			</div>
		);
	},
});

module.exports = Reviews;
