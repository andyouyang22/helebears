
var Home = function() {

	var logIn;
	var signUp;

	var defaultColor = "#00b85c";
	var selectedColor = "#00a653"

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

	var attachAdvancedSearchHandler = function() {
		var show = $('.show-advanced-search');
		var hide = $('.hide-advanced-search');
		var form = $('.advanced-search');

		show.mouseover(function(e) {
			$(this).css('background-image', 'none');
		});

		show.on('click', function(e) {
			e.preventDefault();
			form.slideDown();
			show.slideUp();
		});

		hide.on('click', function(e) {
			e.preventDefault();
			form.slideUp();
			show.slideDown();
		});
	};

	var start = function() {
		logIn = $('.log-in');
		signUp = $('.sign-up');

		attachLogInHandler();
		attachSignUpHandler();
		attachAdvancedSearchHandler();
	};

	return {
		start: start
	};
}();
