
var Calendar = function() {

	var logIn;
	var signUp;

	// HTML template for inserting courses into the calendar
	var template;

	var defaultColor = "#00b85c";
	var selectedColor = "#00a653";
	var courseColor = "#3399ff";

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

	var courseDay = {
		'm' : '.calendar-monday',
		't' : '.calendar-tuesday',
		'w' : '.calendar-wednesday',
		'r' : '.calendar-thursday',
		'f' : '.calendar-friday',
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
	var addCourse = function(c) {
		var course = $(template);
		course.addClass("ccn-" + c.ccn);
		course.css({
			'top'    : courseTop[c.start],
			'height' : courseHeight[c.length + ""],
		});
		course.find('.course-name').text(c.name);
		course.find('.course-location').text(c.location);

		var courses = courseDay[c.day] + " .calendar-col-courses";
		$(courses).append(course);
		course.slideDown();

		/* Make POST request to backend to add class */
	};

	/**
	 * Remove the course with the specified CCN from the calendar.
	 * @param {string} ccn
	 */
	var removeCourse = function(ccn) {
		ccn = ".calendar-course.ccn-" + ccn;
		$(ccn).slideUp(function() {
			$(ccn).remove();
		});
		return ccn
	};

	var attachLogInHandler = function() {
		logIn.on('click', function() {
			signUp.css('background-color', defaultColor);
			logIn.css('background-color', selectedColor);
			$('.sign-up-form').slideUp(function() {
				$('.log-in-form').slideToggle();
			});
		});
	};

	var attachSignUpHandler = function() {
		signUp.on('click', function() {
			logIn.css('background-color', defaultColor);
			signUp.css('background-color', selectedColor);
			$('.log-in-form').slideUp(function() {
				$('.sign-up-form').slideToggle();
			});
		});
	};

	var start = function() {
		course = $('#template.calendar-course');
		course.removeAttr('id');
		template = course[0].outerHTML;

		logIn = $('.log-in');
		signUp = $('.sign-up');

		attachLogInHandler();
		attachSignUpHandler();
	};

	return {
		start        : start,
		addCourse    : addCourse,
		removeCourse : removeCourse,
	};
}();
