/**
 * The Results section of the page. Results contains a scrollable list of courses
 * that match the user's query.
 */

var React    = require('react');
var ReactDOM = require('react-dom');

var Reviews = require('./reviews.js');

var ajax = require('./ajax.js');
var time = require('./time.js');

var Results = React.createClass({
	getInitialState: function() {
		return {
			reviews : [],
		};
	},
	render: function() {
		var results = [];
		this.props.results.forEach(function(c) {
			results.push(
				<Results.Course key={c.ccn} course={c} />
			);
		});
		return (
			<div className='results'>
				{results}
			</div>
		);
	}
});

Results.Course = React.createClass({
	getInitialState: function() {
		return {
			review : {
				name    : "",
				ratings : [],
			},
		};
	},
	showReview: function(name, ratings) {
		var review = {
			name    : name,
			ratings : ratings,
		}
		this.setState({
			review : review,
		});
		var container = $(ReactDOM.findDOMNode(this)).find('.review-container');
		container.slideDown();
	},
	hideReview: function() {
		$(ReactDOM.findDOMNode(this)).find('.review-container').slideUp();
	},
	toggleSections: function() {
		$(ReactDOM.findDOMNode(this)).find('.results-course-sections').slideToggle();
	},
	render: function() {
		var c = this.props.course;
		return (
			<div className='results-course'>
				<Results.Course.Lecture name={c.name} desc={c.desc} inst={c.inst} time={c.time} room={c.room} ccn={c.ccn} toggleSections={this.toggleSections} showReview={this.showReview} />
				<Results.Course.Sections sections={this.props.course.sections} />
				<div className='review-container'>
					<Reviews review={this.state.review} hideReview={this.hideReview} />
				</div>
			</div>
		);
	}
});

Results.Course.Lecture = React.createClass({
	add: function() {
		var course = {
			name : this.props.name,
			room : this.props.room,
			time : this.props.time,
			ccn  : this.props.ccn,
		};
		CalendarAPI.insertCourse(course);
	},
	reviews: function() {
		var that = this;
		var onSuccess = function(data) {
			if (data.status == -1) {
				console.log("Failed to load professor reviews");
				console.log("Errors: " + data.errors);
			}
			var r = data.results;
			var ratings = [0, 0, 0];
			for (var i = 0; i < r.length; i++) {
				debugger
				ratings[0] += r[i].rating_1;
				ratings[1] += r[i].rating_2;
				ratings[2] += r[i].rating_3;
			}
			ratings[0] /= r.length;
			ratings[1] /= r.length;
			ratings[2] /= r.length;
			that.props.showReview(name, ratings);
		};
		var onFailure = function() {
			console.log("Failed to load professor reviews");
		};
		var prof = this.props.inst;
		ajax.get('/api/reviews?professor_name=' + prof, onSuccess, onFailure);
	},
	render: function() {
		var t = time.parse(this.props.time);
		var time = t.days + " " + time.display(t.start) + " - " + time.display(t.end);
		return (
			<div className='results-course-lecture'>
				<div className='results-course-lec-name' onClick={this.props.toggleSections}>{this.props.name}</div>
				<div className='results-course-lec-course-desc'>HIHIHI</div>
				<div className='results-course-lec-desc'>{this.props.desc}</div>
				<div className='results-course-lec-inst' onClick={this.reviews}>{this.props.inst}</div>
				<div className='results-course-lec-time'>{time}</div>
				<Results.Course.Lecture.Add add={this.add} />
			</div>
		);
	}
});

Results.Course.Lecture.Add = React.createClass({
	render: function() {
		return (
			<div className='results-course-lecture-add' onClick={this.props.add}>Add Course</div>
		);
	}
});

Results.Course.Sections = React.createClass({
	render: function() {
		var sections = {
			mon   : [],
			tues  : [],
			wed   : [],
			thurs : [],
			fri   : []
		}
		for (var i = 0; i < this.dprops.sections.length; i++) {
			var sec = this.props.sections[i];
			var time = time.parse(sec.time);
			switch (time.days) {
				case "M":
					sections.mon.push(<Results.Course.Sections.Section key={sec.ccn} time={sec.time}/>); break;
				case "T":
					sections.tues.push(<Results.Course.Sections.Section key={sec.ccn} time={sec.time}/>); break;
				case "W":
					sections.wed.push(<Results.Course.Sections.Section key={sec.ccn} time={sec.time}/>); break;
				case "R":
					sections.thurs.push(<Results.Course.Sections.Section key={sec.ccn} time={sec.time}/>); break;
				case "F":
					sections.fri.push(<Results.Course.Sections.Section key={sec.ccn} time={sec.time}/>); break;
			}
		}
		return (
			<div className='results-course-sections' style={{display: 'none'}}>
				<div className='results-course-sections-col'>
					<div className='results-course-sections-col-header'>Mon</div>
					{sections.mon}
				</div>
				<div className='results-course-sections-col'>
					<div className='results-course-sections-col-header'>Tues</div>
					{sections.tues}
				</div>
				<div className='results-course-sections-col'>
					<div className='results-course-sections-col-header'>Wed</div>
					{sections.wed}
				</div>
				<div className='results-course-sections-col'>
					<div className='results-course-sections-col-header'>Thurs</div>
					{sections.thurs}
				</div>
				<div className='results-course-sections-col'>
					<div className='results-course-sections-col-header'>Fri</div>
					{sections.fri}
				</div>
			</div>
		);
	}
});

Results.Course.Sections.Section = React.createClass({
	render: function() {
		var t = time.parse(this.props.time);
		var time = time.display(t.start) + " - " + time.display(t.end);
		return (
			<div className='results-course-sections-sec'>
				{time}
			</div>
		);
	}
});

module.exports = Results
