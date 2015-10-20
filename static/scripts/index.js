
var Home = function() {

	var logIn;
	var signUp;
	var departmentList;
	var templateDepartment;
	
	var courseList;
	var templateCourse;
	
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
			$(".advanced-search-form").trigger('reset');
		});
	};
	
	var insertCourse = function(course){
		var newElem = $(templateCourse);
		newElem.attr('value',course);
		newElem.html(course);
		newElem.removeAttr('selected');
		newElem.removeAttr('disabled');
		newElem.removeClass('default-option');
		newElem.addClass('course-added');
		courseList.append(newElem);
	};
	
	var insertCourseList = function(department){
		courseList.find('option').remove('.course-added')
		var onSuccess = function(data){
			//Take the returned list of classes and insert each one.
			/* var len data.classes.length()
			for(i=0; i < len; i++){
				insertClass(data.classes[i]);
			}
			*/
		};	
		var onFailure = function(){
			/*print error message
			console.error('could not get department list');
			*/
		};
		//makeGetRequest(url_to_get_classes, onSuccess, onFailure);
		//the bottom ones go away once we have ajax calls
		insertCourse('169');
		insertCourse('249A');
	};
	
	var attachCourseListHandler = function(){
		$(departmentList).on('change',function(){
			var department = $(this).val();
			alert('Send request to server for class list here');
			insertCourseList(department);
		});
	};
	
	var insertDepartment = function(dept){
		var newElem = $(templateDepartment);
		newElem.attr('value',dept);
		newElem.html(dept);
		newElem.removeAttr('selected');
		newElem.removeAttr('disabled');
		newElem.removeClass('default-option');
		newElem.addClass('department-added'); //This value is not actually used, however course-added is.
		//This might provide to be a useful handle later on, however.
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
		//makeGetRequest(url_to_get_departments, onSuccess, onFailure);
		//The bottom ones go away once we have ajax calls
		insertDepartment('Computer Science');
		insertDepartment('Astronomy');
		insertDepartment('History');
	};
	
	
	var start = function() {
		logIn = $('.log-in');
		signUp = $('.sign-up');
		departmentList = $('.department-input');
		templateDepartment = $('.department-input .department-option')[0].outerHTML;
		
		courseList = $('.course-input');
		templateCourse = $('.course-input .course-option')[0].outerHTML;
		//convert to outerHTML, then use $(templateDepartment) to essentially create a new
		//object to later attach. If you do not do outerHTML, it will not point your new var to
		//a new object, and when you try to add it into the html, it does not add properly.
		attachLogInHandler();
		attachSignUpHandler();
		attachAdvancedSearchHandler();
		attachCourseListHandler();
		insertDepartmentList();
	};

	return {
		start: start
	};
}();
