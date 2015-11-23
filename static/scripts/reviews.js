/**
 * The Reviews section of the page. This area is only displayed when selected.
 */

var ajax = require('./ajax.js');
var time = require('./time.js');

var Reviews = React.createClass({
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

module.exports = Reviews;
