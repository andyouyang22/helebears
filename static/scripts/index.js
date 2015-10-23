
var Home = function() {

	var departmentList;
	var templateDepartment;

	var courseList;
	var templateCourse;

	var basicSearchHolder;
	var advSearchHolder;

	//FROM RESULTS.JS
	var classSingle;
	var all_lasses;
	var classSingleTemplateHtml;
	var sectionTableTemplateHtml;
	var labTableTemplateHtml;


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

	var insertClass = function(cla){
		var i;
		var newElem = $(classSingleTemplateHtml);
		newElem.find('.header-table').find('td')[0].innerHTML = cla.course;
		newElem.find('.header-table').find('td').find('input').attr('value',cla.professor);
		newElem.find('.header-table').find('td')[2].innerHTML = cla.CCN;
		newElem.find('.header-table').find('td')[3].innerHTML = cla.time;

		var section_list = cla.sections;

		for(i = 0; i < section_list.length; i++){
			var newSectionLab = section_list[i];
			if(newSectionLab.type == 'section'){
				newElem.find('.section-table').find('td')[0].innerHTML = newSectionLab.type;
				newElem.find('.section-table').find('td')[1].innerHTML = newSectionLab.CCN;
				newElem.find('.section-table').find('td')[2].innerHTML = newSectionLab.time;
				newElem.find('.section-table').find('td')[3].innerHTML = newSectionLab.enrolled;
				newElem.find('.section-table').find('td')[4].innerHTML = newSectionLab.limit;
			};
			if(newSectionLab.type == 'lab'){
				newElem.find('.lab-table').find('td')[0].innerHTML = newSectionLab.type;
				newElem.find('.lab-table').find('td')[1].innerHTML = newSectionLab.CCN;
				newElem.find('.lab-table').find('td')[2].innerHTML = newSectionLab.time;
				newElem.find('.lab-table').find('td')[3].innerHTML = newSectionLab.enrolled;
				newElem.find('.lab-table').find('td')[4].innerHTML = newSectionLab.limit;
			};
		};
		if (newElem.find('.lab-table').find('td')[0].innerHTML == 'REMOVE')
			newElem.find('.lab-div').remove();
		if (newElem.find('.section-table').find('td')[0].innerHTML == 'REMOVE')
			newElem.find('.section-div').remove();
		all_classes.append(newElem);
	};


	var insertQueryResults = function(response){
		var j;
		for(j = 0; j < response.results.length; j++){
				console.log(j);
				insertClass(response.results[j]);
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
			//alert('inside attach handler');

		//DELETE ALL OF THIS WHEN BACKEND READY
		var res = {};
		res.results = [];
		response = {};
		response.course = 'course';
		response.professor = 'prof';
		response.CCN = '123123'
		response.time = 'time'
		var sections = [];
		var s1= {};
		var c1 = {};

		s1.type = 'section'
		s1.CCN = 'CCN'
		s1.time = 'asdf'
		s1.enrolled= 35;
		s1.limit = 24;
		sections.push(s1);

		c1.type = 'lab'
		c1.CCN = 'CCN'
		c1.time = 'asdf'
		c1.enrolled= 35;
		c1.limit = 24;
		sections.push(c1);
		response.sections = sections;
		res.results.push(response);
		res.results.push(response);
		insertQueryResults(res);
		//DELETE ALL OF THIS WHEN BACKEND READY

			var onSuccess = function(data){
				//Take the returned list of classes and insert each one.
				if(data.status == 1){
					insertQueryResults(data);
					$('#query-results-container').show();
					$('#home-page').hide();

				};
				if(data.status == -1){
					alert('there was an error returned from server');
				};
			
			};
			var onFailure = function(){
				console.error('could not get department list');
			};

		
		//GO AWAY WHEN BACKEND CONNECTED
		insertCourse('169');
		insertCourse('249A');

			//onSuccess check status code. pass the json and insert dat ish. hide #home-page show #query-results-page
			//makeGetRequest(/api/courses? + request + department_query, onSuccess, onFailure);

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

		//makeGetRequest(/api/courses?department=department_query, onSuccess, onFailure);
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
		
		//GET RID OF THIS WHEN READY FOR BACKEND
		insertDepartment('Computer Science');
		insertDepartment('Astronomy');
		insertDepartment('History');
		
	};

	var start = function() {

		//FROM ORIGINAL INDEX.HTML
		departmentList = $('.department-input');
		templateDepartment = $('.department-input .department-option')[0].outerHTML;
		courseList = $('.course-input');
		templateCourse = $('.course-input .course-option')[0].outerHTML;
		basicSearchHolder = $('.basic-search-form');
		advSearchHolder = $('.advanced-search-form');

		//FROM ORIGINAL RESULTS.JS HTML
		classSingle = $('.single-class');
		all_classes = $('.all-class-results');
		classSingleTemplateHtml = $(".all-class-results .single-class")[0].outerHTML;
		sectionTableTemplateHtml = $(".section-div")[0].outerHTML;
		labTableTemplateHtml = $(".lab-div")[0].outerHTML;
		all_classes.html('');




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
