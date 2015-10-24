
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
		'8am'    : 33,
		'830am'  : 50,
		'9am'    : 67,
		'930am'  : 85,
		'10am'   : 102,
		'1030am' : 120,
		'11am'   : 137,
		'1130am' : 155,
		'12pm'   : 172,
		'1230pm' : 190,
		'1pm'    : 207,
		'130pm'  : 225,
		'2pm'    : 242,
		'230pm'  : 260,
		'3pm'    : 277,
		'330pm'  : 295,
		'4pm'    : 312,
		'430pm'  : 330,
		'5pm'    : 347,
		'530pm'  : 365,
		'6pm'    : 382,
		'630pm'  : 400,
		'7pm'    : 417,
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

		course.addClass("ccn-" + c.ccn);
		course.find('.course-name').text(c.name);
		course.find('.course-location').text(c.location);

		course.css({
			'top'    : courseTop[c.start],
			'height' : courseHeight[c.length + ""],
		});

		var courses = ".calenday-" + day[c.day] + " .calendar-col-courses";
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

	var start = function() {
		attachSectionsHandler("26601")

		course = $('.template.calendar-course');
		calendarCourseTemplate = course[0].outerHTML;

		result = $('.template.results-course');
		resultsCourseTemplate = result[0].outerHTML;

		sections = $('.template.results-sections');
		resultsSectionsTemplate = sections[0].outerHTML;
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
