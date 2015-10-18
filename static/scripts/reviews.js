var Reviews = function() {

	var logIn;
	var signUp;
	var departmentList;
	var templateDepartment;
	var overallReview;
	
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
/*	
	var attachLogInHandler = function() {
		logIn.on('click', function() {
			signUp.css('background-color', defaultColor);
			logIn.css('background-color', selectedColor);
			$('.sign-up-form').slideUp(function() {
				$('.log-in-form').slideToggle();
			});
		});
	};
*/
	
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
	
	var insertRatingsOverall = function(ratings_dict){
		overallReview.find('.professor-name').html(ratings_dict.professor);
		var ratings_table = overallReview.find('.review-values')[0];
		ratings_table.rows[0].cells[1].innerHTML = ratings_dict.value_1;
		ratings_table.rows[1].cells[1].innerHTML = ratings_dict.value_2;
		ratings_table.rows[2].cells[1].innerHTML = ratings_dict.value_3;
		
	};
	
	var insertProfessorOverallRatings = function(){
		var onSuccess = function(data){
			//Return dictionary of {rating_1: value, rating_2: value, etc}
			insertRatingsOverall(data);
		}
		var onFailure = function(){
		//console.error('could not retreive overall ratings');	
		};
		var ratings_dict = {};
		ratings_dict.professor = 'Javascript Insert Prof';
		ratings_dict.value_1 = 8;
		ratings_dict.value_2 = 9;
		ratings_dict.value_3 = 10;
		insertRatingsOverall(ratings_dict);
	};
	
	var start = function() {
		logIn = $('.log-in');
		signUp = $('.sign-up');
	//	departmentList = $('.department-input');
	//	templateDepartment = $('.department-input .department-option')[0].outerHTML;
		
		overallReview = $('.review-overall');
		
		
		attachCourseListHandler();
		insertDepartmentList();
		insertProfessorOverallRatings();
	};

	return {
		start: start
	};
}();
