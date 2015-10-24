
var Calendar = function() {

	// HTML template for inserting courses into the calendar
	var calendarCourseTemplate;
	// HTML template for inserting courses into the results
	var resultsCourseTemplate;
	// HTML template for inserting sections into the results
	var resultsSectionsTemplate;

	var courseColor = "#3399ff";

	// Hard-coding the position of classes based on starting time
	var courseTop = {
		'0800am' : 33,
		'0830am' : 50,
		'0900am' : 67,
		'0930am' : 85,
		'1000am' : 102,
		'1030am' : 120,
		'1100am' : 137,
		'1130am' : 155,
		'1200pm' : 172,
		'1230pm' : 190,
		'0100pm' : 207,
		'0130pm' : 225,
		'0200pm' : 242,
		'0230pm' : 260,
		'0300pm' : 277,
		'0330pm' : 295,
		'0400pm' : 312,
		'0430pm' : 330,
		'0500pm' : 347,
		'0530pm' : 365,
		'0600pm' : 382,
		'0630pm' : 400,
		'0700pm' : 417,
	};

	var courseHeight = {
		'60'  : 32,
		'90'  : 49,
		'120' : 66,
		'180' : 102,
	};

	var day = {
		'm' : 'monday',
		'M' : 'monday',
		't' : 'tuesday',
		'T' : 'tuesday',
		'w' : 'wednesday',
		'W' : 'wednesday',
		'r' : 'thursday',
		'R' : 'thursday',
		'f' : 'friday',
		'F' : 'friday',
	};

	var abbrev = {
		'Astronomy': 'Astro',
		'Chemistry': 'Chem',
		'Computer Science': 'CS',
		'History': 'Hist',
		'Statistics': 'Stat',
		'Undergraduate Business Administration': 'UGBA',
	};

	// A list of the courses currently loaded in the frontend
	var results = [];

	// A list of the courses currently shown in the schedule
	var schedule = [];

	var makeGetRequest = function(url, onSuccess, onFailure) {
	   $.ajax({
		   type: 'GET',
		   url: apiUrl + url,
		   dataType: "json",
		   success: onSuccess,
		   error: onFailure
	   });
   };

	var makePostRequest = function(url, data, onSuccess, onFailure) {
		$.ajax({
			type: 'POST',
			url: url,
			data: JSON.stringify(data),
			contentType: "application/json",
			dataType: "json",
			success: onSuccess,
			error: onFailure
		});
	};

	/**
	 * Adds the course with the given information to the calendar.
	 * @param {Object} c dictionary containing the following information:
	 *   {string} name
	 *   {string} location
	 *   {string} day (e.g. m, t, w, r, f)
	 *   {string} start (e.g. 9am, 1230pm)
	 *   {number} length (in minutes)
	 *   {string} ccn
	 */
	var addCourseToCalendar = function(c) {
		var course = $(calendarCourseTemplate);
		course.removeClass('template');
		course.css('display', 'none');

		course.addClass("ccn-" + c.ccn);
		course.find('.course-name').text(c.name);
		course.find('.course-location').text(c.location);

		course.css({
			'top'    : courseTop[c.start],
			'height' : courseHeight[c.length + ""],
		});

		var courses = ".calendar-" + day[c.day] + " .calendar-col-courses";
		$(courses).append(course);
		course.slideDown();

		/* Make POST request to backend to add class */
	};

	/**
	 * Remove the course with the specified CCN from the calendar.
	 * @param {string} ccn
	 */
	var removeCourseFromCalendar = function(ccn) {
		ccn = ".calendar-course.ccn-" + ccn;
		$(ccn).slideUp(function() {
			$(ccn).remove();
		});
	};

	/**
	 * Adds the course with the given information to the results body.
	 * @param {Object} c dictionary containing the following information:
	 *   {string} name (e.g. Computer Science 169)
	 *   {string} description (e.g. Software Engineering)
	 *   {string} location
	 *   {string} days (e.g. MWF)
	 *   {string} time (e.g. 12:30-2PM)
	 *   {string} ccn
	 */
	var addCourseToResults = function(c) {
		var result = $(resultsCourseTemplate);
		result.removeClass('template');

		result.addClass("ccn-" + c.ccn);
		result.find('.course-name').text(c.name);
		result.find('.course-description').text(c.description);
		result.find('.course-instructor').text(c.instructor);
		time = c.days + " " + c.time;
		result.find('.course-time').text(time);

		$('.results').prepend(result);
		result.slideDown();
	}

	/**
	 * Adds a list of sections for the lecture with the given ccn.
	 * @param {string} ccn 'parent' lecture of the given sections
	 * @param {Object} s list of section objects with the following fields:
	 *   {string} day (e.g. W)
	 *   {string} time (e.g. 12:30-2PM)
	 */
	var addSectionsToResults = function(ccn, s) {
		ccn = ".results-course.ccn-" + ccn;
		sections = $(resultsSectionsTemplate);
		sections.removeClass('template');
		sections.css('display', 'none');

		for (i = 0; i < s.length; i++) {
			col = ".results-sections-" + day[s[i].day];
			section = $('<div class="results-section"></div>');
			section.text(s[i].time);

			sections.find(col).append(section)
		};

		$(ccn).after(sections);
		// Extract just the 5-digit CCN, not the whole class string
		attachSectionsHandler(ccn.slice(ccn.length - 5));
	};

	/**
	 * Remove the course with the specified CCN from the calendar, as well as its
	 * associated sections list.
	 * @param {string} ccn
	 */
	var removeCourseFromResults = function(ccn) {
		ccn = ".results-course.ccn-" + ccn;
		next = $(ccn).next('.results-sections');
		next.slideUp(function() {
			next.remove();
		});
		$(ccn).slideUp(function() {
			$(ccn).remove();
		});
	};

	/**
	 * Add functionality to results entry so that when a course title is clicked,
	 * its list of sections is expanded (if any).
	 * @param {stirng} ccn the lecture for which we wish to add this functionaltiy
	 */
	var attachSectionsHandler = function(ccn) {
		course = ".results-course.ccn-" + ccn;
		header = course + " .course-name";
		next = $(course).next('.results-sections');

		$(header).on('click', function() {
			next.slideToggle();
		});
	};

	/**
	 * Add functionality to add course to the calendar when the corresponding
	 * results entry is selected.
	 * @param {string} ccn the lecture which we are trying to add to the calendar
	 */
	var attachAddCourseHandler = function(ccn) {
		ccn = ".results-course.ccn-" + ccn;

		$(ccn).find('.add-course').on('click', function() {
			// This is VERY temporary
			course = {
				'name'     : 'CS 170',
				'location' : '155 Dwinelle',
				'day'      : 'W',
				'start'    : '0500pm',
				'length'   : 90,
				'ccn'      : ccn,
			}
			addCourseToCalendar(course);
			course = {
				'name'     : 'CS 170',
				'location' : '155 Dwinelle',
				'day'      : 'F',
				'start'    : '0500pm',
				'length'   : 90,
				'ccn'      : ccn,
			}
			addCourseToCalendar(course);
		});
	}

	var attachWriteReviewHandler = function(ccn) {
		ccn = ".results-course.ccn-" + ccn;

		$(ccn).find('.write-review').on('click', function() {
			$(ccn).next('results-sections').slideUp();
		});
	}

	var start = function() {
		attachSectionsHandler("26601")

		course = $('.template.calendar-course');
		calendarCourseTemplate = course[0].outerHTML;

		result = $('.template.results-course');
		resultsCourseTemplate = result[0].outerHTML;

		sections = $('.template.results-sections');
		resultsSectionsTemplate = sections[0].outerHTML;

		attachAddCourseHandler("26661")
	};

	return {
		start                    : start,

		addCourseToCalendar      : addCourseToCalendar,
		removeCourseFromCalendar : removeCourseFromCalendar,

		addCourseToResults       : addCourseToResults,
		addSectionsToResults     : addSectionsToResults,
		removeCourseFromResults  : removeCourseFromResults,
	};
}();
