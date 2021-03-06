/**
 * The Results section of the page. Results contains a scrollable list of courses
 * that match the user's query.
 */

var React    = require('react');
var ReactDOM = require('react-dom');
var PieChart = require("react-chartjs").Pie;

var Reviews  = require('./reviews.js');

var ajax  = require('./util/ajax.js');
var parse = require('./util/parse.js');
var time  = require('./util/time.js');

var Results = React.createClass({
	componentDidMount: function() {
		var that = this;

		// Respond appropriately when results change (e.g. new search)
		var resultsCallback = function() {
			that.setState({
				results : that.props.store.results(),
			});
		};
		this.props.store.addResultsListener(resultsCallback);

		// Respond appropriately when a result is selected
		var selectedCallback = function() {
			var selected = that.props.store.selected();
			var results = [selected];
			if (selected == null) {
				// If a result is unselected (loses focus), show all results again
				results = that.props.store.results();
			}
			that.setState({
				results  : results,
				selected : selected,
			});
		};
		this.props.store.addSelectedListener(selectedCallback);
	},
	getInitialState: function() {
		return {
			reviews  : [],
			results  : [],
			selected : null,
		};
	},
	render: function() {
		var that = this;
		var results = [];
		// If 'selected' is not null, something must be selected, and there will
		// only be one result to show
		if (this.state.selected != null) {
			var s = this.state.selected;
			results.push(
				<Results.Course store={that.props.store} key={s.ccn} course={s} selected={this.state.selected} />
			);
		}
		// Otherwise, generate all Results immediately after a search
		else {
			this.state.results.forEach(function(c) {
				results.push(
					<Results.Course store={that.props.store} key={c.ccn} course={c} />
				);
			});
		}
		return (
			<div className='results'>
				{results}
			</div>
		);
	}
});

Results.Course = React.createClass({
	componentDidMount: function() {
		this.props.store.addReviewsListener(this.showReviews);
	},
	getInitialState: function() {
		return {
			infoContent : [],
		};
	},
	showDescription: function() {
		var store = this.props.store;
		var course = this.props.course;
		store.select(course);
		this.setState({
			infoContent : <Results.Course.Description course={course} />
		});
	},
	showReviews: function() {
		var store = this.props.store;
		var course = this.props.course;
		if (store.selected().ccn == course.ccn) {
			var inst = course.inst;
			var ccn = course.ccn;
			var reviews = store.reviews();
			this.setState({
				infoContent : <Reviews store={store} inst={inst} reviews={reviews} />,
			});
		}
	},
	showSections: function() {
		var store = this.props.store;
		var course = this.props.course;
		store.select(course);
		this.setState({
			infoContent : <Results.Course.Sections sections={course.sections} />
		});
	},
	toggleVisual: function () {
		$(ReactDOM.findDOMNode(this)).find('.data-visualization').slideToggle();
	},

	render: function() {
		var info = [];
		if (this.props.selected) {
			// 'key' property needed to make React happy
			info.push(
				<Results.Course.Info key="420" store={this.props.store} info={this.state.infoContent} />
			);
		}
		return (
			<div className='results-course'>
				<Results.Course.Lecture store={this.props.store} course={this.props.course} selected={this.props.selected} sections={this.showSections} desc={this.showDescription} toggleVisual={this.toggleVisual} />
				{info}
			</div>
		);
	}
});


/**
 * Info is a container for information associated with this Course. It can contain
 * section information, reviews, or recommendations. Info is only displayed when its
 * corresponding Course is 'selected'.
 */
Results.Course.Info = React.createClass({
	render: function() {
		return(
			<div className='results-course-info'>
				{this.props.info}
			</div>
		);
	},
});

Results.Course.Lecture = React.createClass({
	add: function() {
		var course = this.props.course;
		this.props.store.addCourse(course);
	},
	back: function() {
		this.props.store.unselect();
	},
	description: function() {
		this.select();
		this.props.desc()
	},
	sections: function() {
		this.select();
		this.props.sections();
		var course = this.props.course;
	},
	reviews: function() {
		this.select();
		var inst = this.props.course.inst;
		this.props.store.getReviews(inst);
	},
	select: function() {
		var course = this.props.course;
		this.props.store.select(course);
	},
	render: function() {
		var back = [];
		if (this.props.selected) {
			back.push(
				<div className='results-course-lecture-back' key="420" onClick={this.back}>
					{"Return to results"}
				</div>
			);
		}
		var showSections = [];
		if (!this.props.selected) {
			showSections = (
				<div className='results-course-show-sections' onClick={this.sections}>
					{"Show sections"}
				</div>
			);
		}
		var c = this.props.course;
		var t = time.parse(c.time);
		t = t.days + " " + time.display(t.start) + " - " + time.display(t.end);
		return (
			<div className='results-course-lecture'>
				{back}
				<div className='results-course-lec-name' onClick={this.description}>{c.name}</div>
				{showSections}
				<div className='results-course-lec-desc'>{c.desc}</div>
				<div className='results-course-lec-inst' onClick={this.reviews}>{parse.normalCase(c.inst)}</div>
				<div className='results-course-lec-time'>{t}</div>
				<div className='results-course-lecture-add' onClick={this.add}>
					{"Add Course"}
				</div>
			</div>
		);
	}
});

Results.Course.Lecture.RecommendationChart = React.createClass({
	render: function() {
		var rec = this.props.recommendation;
		if (rec == null) {
			return (
				<div></div>
			);
		}

		var recc_courses = Object.keys(rec);
		var chartData = [];
		for (var i = 0; i < recc_courses.length; i++) {
			tempDict = {};
			tempDict['label'] = recc_courses[i];
			tempDict['value'] = rec[recc_courses[i]];
			var letters = '0123456789ABCDEF'.split('');
    		var color = '#';
			for (var j = 0; j < 6; j++ ) {
        		color += letters[Math.floor(Math.random() * 16)];
			}
			tempDict['color'] = color;
			chartData.push(tempDict);
		}
		return (
			<div className='data-vis'>
				<div className='data-vis-label'>
					{"Other people took..."}
				</div>
				<PieChart data={chartData} />
			</div>
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
		for (var i = 0; i < this.props.sections.length; i++) {
			var sec = this.props.sections[i];
			var t = time.parse(sec.time);
			switch (t.days) {
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
		for (d in sections) {
			if (sections[d].length == 0) {
				sections[d] = (
					<div className='results-course-sections-none'>
						{"None"}
					</div>
				);
			}
		}
		return (
			<div className='results-course-sections'>
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
		t = time.display(t.start) + " - " + time.display(t.end);
		return (
			<div className='results-course-sections-sec'>
				{t}
			</div>
		);
	}
});

Results.Course.Description = React.createClass({
	render: function() {
		var c = this.props.course;
		var t = time.parse(c.time);
		t = t.days + " " + time.display(t.start) + " - " + time.display(t.end);
		return (
			<div className='results-course-description'>
				<div className='results-course-title ci-metadata'>
					{"Course Description"}
				</div>
				<div className='alignment-container'>
					<div className='results-course-desc-container'>
						<table className='desc-table'>
						<tbody>
							<tr>
								<td className='desc-left'>Professor</td>
								<td className='desc-right'>{parse.normalCase(c.inst)}</td>
							</tr>
							<tr>
								<td className='desc-left'>Time</td>
								<td className='desc-right'>{t}</td>
							</tr>
							<tr>
								<td className='desc-left'>Location</td>
								<td className='desc-right'>{parse.normalCase(c.room)}</td>
							</tr>
							<tr>
								<td className='desc-left'>Enrolled</td>
								<td className='desc-right'>{c.enrolled + " / " + c.limit}</td>
							</tr>
							<tr>
								<td className='desc-left'>Waitlist</td>
								<td className='desc-right'>{c.waitlist}</td>
							</tr>
							<tr>
								<td className='desc-left'>CCN</td>
								<td className='desc-right'>{c.ccn}</td>
							</tr>
						</tbody>
						</table>
						<p className='long-description ci-metadata'>{c.info}</p>
					</div>
					<div className='data-visualization'>
						<Results.Course.Lecture.RecommendationChart recommendation={c.rec}/>
					</div>
				</div>
			</div>
		);
	},
});

module.exports = Results
