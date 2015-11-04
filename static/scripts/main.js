show_page = function(page_number){
	var h = $('#home-page');
	var q = $('#query-results-page');
	var u = $('#user-reviews-page');
	var l = $('#login-status-page');
	var page_list = [h, q, u, l]; //also put l into this
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
	//var successful_log_in;
	//var successful_sign_up;
	//var unsuccessful_log_in;
	
	var unsuccessful_log_in;
	var error_divTemplateHtml;

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
	
	var show_login_result = function(page_number){
		var sli = $('#successful-log-in');
		var ssu = $('#successful-sign-up');
		var uli = $('#unsuccessful-log-in');
		
		var page_list = [sli, ssu, uli];
		var count;
		for(count = 0; count < page_list.length; count++){
			if(count == page_number)
				page_list[count].show();
			else
				page_list[count].hide();
		};
		
		
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
			var onSuccess = function(data){
				if(data.status == 1){
					show_page(3);
					show_login_result(0);
					$('#log-in-sign-up-button-container').hide(); //Hide the login and signup buttons after successful login
					$('.log-in-form').slideToggle(); //Slide the form up
					
				}else if(data.status == -1){
					unsuccessful_log_in.find('div').remove('.error-div');
					var i;
					for(i = 0; i < data.errors.length; i++)
						insertError(data.errors[i]);
					show_page(3);
					show_login_result(2);
				};
			};
			var onFailure = function(){
				console.error('Error when trying to sign in');	
			};
			var testResponse = {};
			testResponse.status = 1;
			onSuccess(testResponse);
			
			//makePostRequest(requirements here)
		};
	});
	
};
	
	var insertError = function(error_string){
		var newElem = $(error_divTemplateHtml);
		newElem.html(error_string);
		unsuccessful_log_in.append(newElem);
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
				console.log('sign up can be sent to server');
				//onSuccess = function() <-- turn to account_created_page
				var onSuccess = function(data){
					if(data.status == 1){
						show_page(3);
						show_login_result(1);
						$('.sign-up-form').slideToggle();
					}else if(data.status == -1){
						unsuccessful_log_in.find('div').remove('.error-div');
						var i;
						insertError('Unable to Sign Up');
						for(i = 0; i < data.errors.length; i ++)
							insertError(data.errors[i]);
						show_page(3);
						show_login_result(2);
						$('.sign-up-form').slideToggle();
					};
				};
				var onFailure = function(){ //send list of errors to error log
					console.error('Error when trying to sign up');
				};
				
				var testResponse = {};
				testResponse.status = -1;
				testResponse.errors = ['error_1', 'error_2'];
				onSuccess(testResponse);
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
	unsuccessful_log_in = $('#unsuccessful-log-in');
	error_divTemplateHtml = $('.error-div')[0].outerHTML;
	unsuccessful_log_in.html('');
	
	
	
	attachSendLogInInfo();
	attachSendSignUpInfo();
	attachLogInHandler();
	attachSignUpHandler();
};
	return {
		start: start
	};

}();