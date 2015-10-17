
var Home = function() {

	var logIn;
	var signUp;
	var departmentList;
	var templateDepartment;
	
	var defaultColor = "#00b85c";
	var selectedColor = "#00a653"

	var makeGetRequest = function(url, onSuccess, onFailure) {
       $.ajax({
           type: 'GET',
           url: apiUrl + url,
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
	var insertDepartment = function(dept){
		var newElem = $(templateDepartment);
		newElem.attr('value',dept);
		newElem.html(dept);
		newElem.removeAttr('selected');
		newElem.removeAttr('disabled');
		newElem.removeClass('default-option');
		departmentList.append(newElem);
		
	};
	var insertDepartmentList = function() {
		var onSuccess = function(data){
			//Take the returned list of departments and insert each one.
			/* var len data.departments.length()
			for(i=0; i < len; i++){
				insertDepartment(data.departments[i]);
			}
			*/
		};
		var onFailure = function(){
			/*print error message
			console.error('could not get department list');
			*/
		};
		//makeGetRequest(url_to_get_departments (main page), onSuccess, onFailure);
		insertDepartment('Computer Science');
		insertDepartment('Astronomy');
		insertDepartment('History');
	};
	
	var start = function() {
		logIn = $('.log-in');
		signUp = $('.sign-up');
		departmentList = $('.department-input');
		templateDepartment = $('.department-input .department-option')[0].outerHTML;
		//departmentList.remove(templateDepartment);
		//departmentList.html('');
		attachLogInHandler();
		attachSignUpHandler();
		attachAdvancedSearchHandler();
		insertDepartmentList();
	};

	return {
		start: start
	};
}();
