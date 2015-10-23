
var logIn;
var signUp;

var defaultColor = "#00b85c";
var selectedColor = "#00a653";

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

var main = function() {
	// Prevent HeleBears logo click event from re-directing
	$('.pure-menu-link').on('click', function(e) {
		e.preventDefault();
	});

	logIn = $('.log-in');
	signUp = $('.sign-up');

	attachLogInHandler();
	attachSignUpHandler();
};

