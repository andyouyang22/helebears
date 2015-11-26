/**
 * The ReviewForm class. This is the form the user uses to submit a new review.
 */

var React    = require('react');
var ReactDom = require('react-dom');

var ReviewForm = React.createClass({
	render: function() {
		var placeholder = "Write a review, then tell your friends!";
		return (
			<div className='reviewform'>
				<fieldset>
					<ReviewForm.Rating for={'rating_1'} attr={"Difficulty"} />
					<ReviewForm.Rating for={'rating_2'} attr={"Engagement"} />
					<ReviewForm.Rating for={'rating_3'} attr={"Content"} />
					<textarea className='reviewform-textarea' placeholder={placeholder}></textarea>
				</fieldset>
				<ReviewForm.Submit />
			</div>
		);
	},
});

ReviewForm.Rating = React.createClass({
	render: function() {
		var className = 'reviewform-rating' + this.props.for;
		var options = [];
		for (i = 1; i <= 10; i++) {
			options.push(
				<option key={i} value={i}>
					{i}
				</option>
			);
		}
		return (
			<div className='reviewform-rating'>
				<label htmlFor={this.props.for}>
					{this.props.attr}
				</label>
				<select defaultValue='disabled'>
					<option className='default-option' value='disabled' disabled>
						{"0"}
					</option>
					{options}
				</select>
			</div>
		);
	},
});

ReviewForm.Submit = React.createClass({
	submit: function() {
		alert("back");
	},
	render: function() {
		return (
			<div className='reviewform-submit' href='#' onClick={this.submit}>
				{"Submit"}
			</div>
		);
	},
});

module.exports = ReviewForm;
