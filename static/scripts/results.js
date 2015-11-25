/**
 * The Results section of the page. Results contains a scrollable list of courses
 * that match the user's query.
 */

var React    = require('react');
var ReactDOM = require('react-dom');
var PieChart = require("react-chartjs").Pie;

var Reviews = require('./reviews.js');

var ajax = require('./util/ajax.js');
var time = require('./util/time.js');

var Results = React.createClass({
	componentDidMount: function() {
		var that = this;
		var callback = function() {
			that.setState({
				results : that.props.store.results(),
			});
		};
		this.props.store.addResultsListener(callback);
	},
	getInitialState: function() {
		return {
			results : [],
			reviews : [],
		};
	},
	render: function() {
		var that = this;
		var results = [];
		this.state.results.forEach(function(c) {
			results.push(
				<Results.Course store={that.props.store} key={c.ccn} course={c} />
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
	toggleDescription: function () {
		$(ReactDOM.findDOMNode(this)).find('.results-course-description').slideToggle();
	},
	toggleVisual: function () {
		$(ReactDOM.findDOMNode(this)).find('.data-visualization').slideToggle();
	},

	render: function() {
		var c = this.props.course;
		return (
			<div className='results-course'>
				<Results.Course.Lecture store={this.props.store} units={c.units} enrolled={c.enrolled} limit={c.limit} waitlist={c.waitlist} recommendation={c.recommendation} course_description={c.course_description} name={c.name} desc={c.desc} inst={c.inst} time={c.time} room={c.room} ccn={c.ccn} toggleDescription={this.toggleDescription} toggleVisual={this.toggleVisual} toggleSections={this.toggleSections} showReview={this.showReview} />
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
		this.props.store.addCourse(course);
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
		t = t.days + " " + time.display(t.start) + " - " + time.display(t.end);
		return (
			<div className='results-course-lecture'>
				<div className='results-course-lec-name' onClick={this.props.toggleSections}>{this.props.name}</div>
				<div className='results-course-data-visualization' onClick={this.props.toggleVisual}>Recommended With</div>
				<div className='results-course-lec-course-desc' onClick={this.props.toggleDescription}>Course Info</div>
				<div className='results-course-lec-desc'>{this.props.desc}</div>
				<div className='results-course-lec-inst' onClick={this.reviews}>{this.props.inst}</div>
				<div className='results-course-lec-time'>{t}</div>
				<div className='results-course-description' style={{display: 'none'}}>
					<div className='results-course-lecture-add' id='close-button' onClick={this.props.toggleDescription}>Close</div>
					<div className='results-course-title ci-metadata'>{this.props.name}</div>
					<div className='results-course-time ci-metadata'>{t}</div>
					<div className='results-course-professor ci-metadata'>{this.props.prof}</div>
					<div className='results-course-enrolled ci-metadata'>Enrolled: {this.props.enrolled}</div>
					<div className='results-course-limit ci-metadata'>Limit: {this.props.limit}</div>
					<div className='results-course-waitlist ci-metadata'>Waitlist: {this.props.limit}</div>
					<div className='results-course-ccn ci-metadata'>CCN: {this.props.ccn}</div>
					<div className='ci-metadata' id='locationid'> Location: {this.props.room}</div>
					<p className='long-description ci-metadata'>{this.props.course_description}</p>
				</div>
				<div className='results-course-lecture-add' onClick={this.add}>
					Add Course
				</div>
				<div className='data-visualization'>
					<Results.Course.Lecture.RecommendationChart recommendation={this.props.recommendation}/>
				</div>
			</div>
		);
	}
});

Results.Course.Lecture.RecommendationChart = React.createClass({
	render: function() {
		var temp = this.props.recommendation;
		if(temp != null){
		var recc_courses = Object.keys(temp);
		var chartData = [];
		for (var i = 0; i < recc_courses.length; i++){
			tempDict = {};
			tempDict['label'] = recc_courses[i];
			tempDict['value'] = temp[recc_courses[i]];
			var letters = '0123456789ABCDEF'.split('');
    		var color = '#';
			for (var j = 0; j < 6; j++ )
        		color += letters[Math.floor(Math.random() * 16)];

			tempDict['color'] = color;
			chartData.push(tempDict);
		}
		//console.log(JSON.stringify(chartData));
		/*chartData = [{value:300, label:'test1', color:'#F7464A'}, {value:150, label:'test2', color:'#235497'}];*/
		return (
				<PieChart data={chartData} />
			);
		}else{
			//var emptyChart = [{value:1, label:'Be the first to take this course!', color:'#F7464A'}];
			//<PieChart data={emptyChart} />
		return (
				<div>Be the first to take this course!</div>
			);
		}
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
		t = time.display(t.start) + " - " + time.display(t.end);
		return (
			<div className='results-course-sections-sec'>
				{t}
			</div>
		);
	}
});

module.exports = Results
