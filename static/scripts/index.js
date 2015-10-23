
var Home = function() {

	var departmentList;
	var templateDepartment;

	var courseList;
	var templateCourse;

	var basicSearchHolder;
	var advSearchHolder;

	var makeGetRequest = function(url, onSuccess, onFailure) {
	   $.ajax({
		   type: 'GET',
		   url: apiUrl + url,
		   dataType: "json",
		   success: onSuccess,
		   error: onFailure
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


	var clear_dict_key = function(del_value,request){
		for(var key in request) {
			if(request[key] == del_value) {
			delete request[key];
			};
		};
	};

	var attachSubmitSearchHandler = function(){
		advSearchHolder.on('click', '.submit-search', function (e){
			e.preventDefault();
			var request = {};
			var classDays = ['M','T','W','R','F','S'];
			var dayList = advSearchHolder.find('.days');
			var classDaysChecked = '';
			request.department = basicSearchHolder.find('.department-input').val();
			request.courseID = basicSearchHolder.find('.course-input').val();
			request.classStartTime = advSearchHolder.find('.start-time').val();
			request.classEndTime = advSearchHolder.find('.end-time').val();
			for(i = 0; i < classDays.length; i++){
				if(dayList[i].checked)
					classDaysChecked = classDaysChecked + classDays[i];
			};
			request.classDays = classDaysChecked;
			clear_dict_key(null,request);
			clear_dict_key('',request);
			request = JSON.stringify(request);
			request = request.replace(/"/g,"");
			request = request.replace(/{/g,'');
			request = request.replace(/}/g,'');
			request = request.replace(/:/g,'=');
			request = request.replace(/,/g,'&');
			request = request.replace(/ /g,'%20');
			alert(JSON.stringify(request) + ' Send get request here');
			request = request;


			var onSuccess = function(data){
				//Take the returned list of classes and insert each one.
				var len = data.results.length()
				for(i=0; i < len; i++){
					insertCourse(data.results[i].name);
				};
			
			};
			var onFailure = function(){
				console.error('could not get department list');
			};

		//makeGetRequest(/api/courses? + department_query, onSuccess, onFailure);
		//the bottom ones go away once we have ajax calls
		insertCourse('169');
		insertCourse('249A');
	};

			//onSuccess check status code. pass the json and insert dat ish. hide #home-page show #query-results-page
			//makeGetRequest = function(url? + request, onSuccess, onFailure)

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

	var insertCourseList = function(department_query){
		courseList.find('option').remove('.course-added');
		//top line removes old list
		var onSuccess = function(data){
			//Take the returned list of classes and insert each one.
			var len = data.results.length()
			for(i=0; i < len; i++){
				insertCourse(data.results[i].name);
			}
			
		};
		var onFailure = function(){
			console.error('could not get department list');
		};

		//makeGetRequest(/api/courses? + department_query, onSuccess, onFailure);
		//the bottom ones go away once we have ajax calls
		insertCourse('169');
		insertCourse('249A');
	};

	var attachCourseListHandler = function(){
		$(departmentList).on('change',function(){
			var department = $(this).val();
			department = department.replace(/ /g,'%20');
			var query = department;
			alert(query);
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
			var k;
			//Take the returned list of departments and insert each one.
			var len = data.results.length()
			for(k=0; k < len; k++){
				insertDepartment(data.results.department_name[i]);
			}
			
		};
		var onFailure = function(){
			console.error('could not get department list');
		};
		// makeGetRequest('/api/departments, onSuccess, onFailure);
		// The bottom ones go away once we have ajax calls
		
		
		insertDepartment('Computer Science');
		insertDepartment('Astronomy');
		insertDepartment('History');
		
	};

	var start = function() {
		departmentList = $('.department-input');
		templateDepartment = $('.department-input .department-option')[0].outerHTML;

		courseList = $('.course-input');
		templateCourse = $('.course-input .course-option')[0].outerHTML;
		basicSearchHolder = $('.basic-search-form');
		advSearchHolder = $('.advanced-search-form');

		// convert to outerHTML, then use $(templateDepartment) to essentially
		// create a new object to later attach. If you do not do outerHTML, it will
		// not point your new var to a new object, and when you try to add it into
		// the html, it does not add properly.
		attachAdvancedSearchHandler();
		attachCourseListHandler();
		attachSubmitSearchHandler();
		insertDepartmentList();
	};

	return {
		start: start
	};
}();
