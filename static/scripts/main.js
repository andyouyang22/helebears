show_page = function(page_number){
	var h = $('#home-page');
	var q = $('#query-results-page');
	var u = $('#user-reviews-page');
	var page_list = [h, q, u];
	var count;
	for(count = 0; count < page_list.length; count++){
		if(count == page_number)
			page_list[count].show();
		else
			page_list[count].hide();
	};
	
};


var Main = function(){

var logIn;
var signUp;

var defaultColor = "#00b85c";
var selectedColor = "#00a653";
var submit_log_in;
	var submit_sign_up;

	var makeGetRequest = function(url, onSuccess, onFailure) {
	   $.ajax({
		   type: 'GET',
		   url: bigUrl + url,
		   dataType: "json",
		   success: onSuccess,
		   error: onFailure
	   });
   };

   var makePostRequest = function(url, data, onSuccess, onFailure) {
		$.ajax({
			type: 'POST',
			url: bigUrl + url,
			data: JSON.stringify(data),
			contentType: "application/json",
			dataType: "json",
			success: onSuccess,
			error: onFailure
		});
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

var attachSendLogInInfo = function(){
	submit_log_in.on('click', function(e){
		var form_holder = $(this).parent().parent();
		var username_password = form_holder.find('.pure-control-group');
		var uname = $(username_password[0]).find('input').val();
		var pw = $(username_password[1]).find('input').val();
		if(uname == '' || pw == '')
			console.log('User did not input account and/or password');
		else{
			console.log('send post request here');
			//onSuccess = function() <-- turn to login_results_page
			//onFailure = function() <-- turn to login_failure_page
			//makePostRequest(requirements here)
		};
	});
	
};
	
	var attachSendSignUpInfo = function(){
		submit_sign_up.on('click', function(e){
			var form_holder = $(this).parent().parent();
			var upp = form_holder.find('.pure-control-group');
			var uname = $(upp[0]).find('input').val();
			var pw = $(upp[1]).find('input').val();
			var rpw = $(upp[2]).find('input').val();
			if(uname == '' || pw == '' || rpw == '')
				console.log('User did not fill in all required areas');
			else{
				console.log('sign up can be setn to server');
				//onSuccess = function() <-- turn to account_created_page
				//onFailure = function() turn to sign_up_failure page
				//makePostRequest(requirements here)
			};
		});
		
		
	};
	
var start = function() {
	// Prevent HeleBears logo click event from re-directing
	$('.pure-menu-link').on('click', function(e) {
		e.preventDefault();
	});

	logIn = $('.log-in');
	signUp = $('.sign-up');
	submit_log_in = $('.submit-log-in');
	submit_sign_up = $('.submit-sign-up');
	
	attachSendLogInInfo();
	attachSendSignUpInfo();
	attachLogInHandler();
	attachSignUpHandler();
};
	return {
		start: start
	};

}();