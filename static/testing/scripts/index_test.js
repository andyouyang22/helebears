Home = function() {

	var departmentList;
	var templateDepartment;

	var courseList;
	var templateCourse;
    /* Login/Signup handlers */
    var logIn;
    var signUp;
    var defaultColor = "#00b85c";
    var selectedColor = "#00a653";

	var basicSearchHolder;
	var advSearchHolder;

	//FROM ORIGINAL RESULTS.JS
	var classSingle;
	this.all_classes;
	var classSingleTemplateHtml;
	var sectionTableTemplateHtml;
	var labTableTemplateHtml;
	var section_trTemplateHtml;
	var lab_trTemplateHtml;

	//FOR RESULTS.JS
	var course_header;

	//FOR REVIEWS.JS
	var user_input;
	var overallReview;
	this.user_reviews;
	var userReviewTemplateHtml;

	var query_results_page;
	this.user_reviews_page;
	var home_page;
	var helebears_button;
	var bigUrl = 'https://protected-refuge-7067.herokuapp.com';
	//var bigUrl = '';

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

	var attachSignUpHandler = function() {
		signUp.on('click', function() {
			logIn.css('background-color', defaultColor);
			signUp.css('background-color', selectedColor);
			$('.log-in-form').slideUp(function() {
				$('.sign-up-form').slideToggle();
			});
		});
	};
*/
	this.check_post_request = function(review){
		var error_list = [];
		if(review.professor_name.length == 0)
			error_list.push('Professor is empty!');
		if(review.professor_name.length > 64)
			error_list.push('Professor name must be 64 characters or less!');
		if((review.rating_1 < 1)||(review.rating_1 > 10))
			error_list.push('rating_1 must be between 1 and 10!');
		if((review.rating_2 < 1)||(review.rating_2 > 10))
			error_list.push('rating_2 must be between 1 and 10!');
		if((review.rating_3 < 1)||(review.rating_3 > 10))
			error_list.push('rating_3 must be between 1 and 10!');
		if(review.review.length < 1)
			error_list.push('review is empty!');
		if(review.review.length > 2048)
			error_list.push('review must be 2048 characters or less!');
		return error_list;

	};


	this.attachAdvancedSearchHandler = function() {
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

	this.insertUserRating = function(user_review){
		var newElem = $(userReviewTemplateHtml);
		newElem.attr('id',user_review.id);
		//var tempDate = new Date(user_review.createdAt);
		//newElem.find('.time').text(tempDate.toDateString());
		//newElem.find('.user-name').text(user_review.name);
		newElem.find('.user-name').text('User Review');
		newElem.find('.row-1').find('td')[1].innerHTML = user_review.rating_1;
		newElem.find('.row-2').find('td')[1].innerHTML = user_review.rating_2;
		newElem.find('.row-3').find('td')[1].innerHTML = user_review.rating_3;
		newElem.find('.review-user-text').text(user_review.review);
		this.user_reviews.append(newElem);

	};


	this.clear_dict_key = function(del_value,request){
		for(var key in request) {
			if(request[key] == del_value) {
			delete request[key];
			};
		};
	};

	this.insertRatingsOverall = function(ratings_dict){
		name_of_professor = ratings_dict.professor; //Store the name of the professor locally.
		// This is used so that when we call a post request to post a review, we do
		// not have to call overallReview.find('.professor-name').html() to do
		// retreive the name.
		overallReview.find('.professor-name').html(ratings_dict.professor);
		var ratings_table = overallReview.find('.review-values')[0];
		ratings_table.rows[0].cells[1].innerHTML = ratings_dict.overall_rating_1
		ratings_table.rows[1].cells[1].innerHTML = ratings_dict.overall_rating_2;
		ratings_table.rows[2].cells[1].innerHTML = ratings_dict.overall_rating_3;

	};

	//REMOVE?
	this.insertProfessorOverallRatings = function(professor_name){
		var onSuccess = function(data){
			//Return dictionary of {professor: prof_name, rating_1: value, rating_2: value, etc}
			insertRatingsOverall(data);
		};
		var onFailure = function(){
		//console.error('could not retreive overall ratings');
		};
		//makeGetRequest(url_to_get_professor's ratings, onSuccess, onFailure);
		var ratings_dict = {};

		//REMOVE BELOW WHEN READY FOR AJAX

		/*
		ratings_dict.professor = professor_name;
		ratings_dict.overall_rating_1 = 10;
		ratings_dict.overall_rating_2 = 10;
		ratings_dict.overall_rating_3 = 10;
		*/
		//REMOVE ABOVE WHEN READY FOR AJAX
		insertRatingsOverall(ratings_dict);
	};
	//REMOVE?

	this.insertProfessorUserRatings = function(professor_name){
		var onSuccess = function(data){
			//$('#query-results-container').hide();
			//$('#user-reviews-page').show();
			//$('#home-page').hide();
			show_page(2);

			var ratings_dict = {};

			//REMOVE BELOW WHEN READY FOR AJAX
			ratings_dict.professor = professor_name;
			ratings_dict.overall_rating_1 = 10;
			ratings_dict.overall_rating_2 = 10;
			ratings_dict.overall_rating_3 = 10;
			//REMOVE ABOVE WHEN READY FOR AJAX
			insertRatingsOverall(ratings_dict);


			//query_results_page.hide();
			//this.user_reviews_page.show();
			//home_page.hide();

			if(data.status == 1){

				var leng = data.results.length;
				var m;
				for(m=0; m < leng; m++){
					insertUserRating(data.results[m]);
				};
			if(data.status == -1){
				//alert("error returned from the server");
				console.error('error returned from the server');
			};
		};
	};
		this.onFailure = function(){
			console.error('could not retrieve user ratings');
		};

		//DELETE BELOW WHEN READY FOR AJAX
		/*
		user_review = {};
		user_review.id = 123;
		user_review.time = 'Jan 15th, 2015';
		user_review.name = 'ok good';
		user_review.rating_1 = 10;
		user_review.rating_2 = 10;
		user_review.rating_3 = 10;
		user_review.review = 'a user review inputted through javascript (send the function 2ce)!';
		insertUserRating(user_review);
		insertUserRating(user_review);
		*/
		//DELETE ABOVE WHEN READY FOR AJAX
		//makeGetRequest(/api/overallreviews?professor = professor_name, onSuccess, onFailure);
		makeGetRequest('/api/reviews?professor_name=' + professor_name, onSuccess, onFailure);

	};



	this.attachLoadProfessorReviewsHandler = function(){
		course_header.on('click', '.professor-button', function (e) {
			e.preventDefault();
			var prof_name = $(this).attr('value');
			this.user_reviews.html('');
			//insertProfessorOverallRatings(prof_name);
			insertProfessorUserRatings(prof_name);
			//INSERT OVERALL RATINGS
			//INSERT USER RATINGS

		});
	};

	this.insertClass = function(cla){
		var i;
		var newElem = $(classSingleTemplateHtml);
		newElem.find('.header-table').find('td')[0].innerHTML = cla.department_name + ': ' + cla.name_and_number;
		newElem.find('.header-table').find('td').find('input').attr('value',cla.professor_name);
		newElem.find('.header-table').find('td')[2].innerHTML = 'CCN: '+ cla.ccn;
		newElem.find('.header-table').find('td')[3].innerHTML = cla.time;


		var section_list = cla.sections;

		for(i = 0; i < section_list.length; i++){
			var newSectionLab = section_list[i];
			if(newSectionLab.type == 'Discussion'){
				var section_tr = $(section_trTemplateHtml);
				//if this doesnt work, replace all section_tr.find('td') with:
				//newElem.find('.section-table').find('td')
				section_tr.find('td')[0].innerHTML = newSectionLab.type;
				section_tr.find('td')[1].innerHTML = newSectionLab.ccn;
				section_tr.find('td')[2].innerHTML = newSectionLab.time;
				section_tr.find('td')[3].innerHTML = newSectionLab.instructor;
				section_tr.find('td')[4].innerHTML = newSectionLab.limit;
				newElem.find('.section-table').find('tbody').append(section_tr);
			};
			if(newSectionLab.type == 'Lab'){
				var lab_tr = $(lab_trTemplateHtml);
				lab_tr.find('td')[0].innerHTML = newSectionLab.type;
				lab_tr.find('td')[1].innerHTML = newSectionLab.ccn;
				lab_tr.find('td')[2].innerHTML = newSectionLab.time;
				lab_tr.find('td')[3].innerHTML = newSectionLab.instructor;
				lab_tr.find('td')[4].innerHTML = newSectionLab.limit;
				newElem.find('.lab-table').find('tbody').append(lab_tr);
			};
		};
		//if (newElem.find('.lab-table').find('td')[0].innerHTML == 'REMOVE')
		//	newElem.find('.lab-div').remove();
		//if (newElem.find('.section-table').find('td')[0].innerHTML == 'REMOVE')
		//	newElem.find('.section-div').remove();
		newElem.find('.lab-table').find('tr')[0].remove();
		newElem.find('.section-table').find('tr')[0].remove();
		
		this.all_classes.append(newElem);
	};


	this.insertQueryResults = function(response){
		var j;
		for(j = 0; j < response.results.length; j++){
				console.log(j);
				this.insertClass(response.results[j]);
			};
	};


	this.attachSubmitSearchHandler = function(){
		advSearchHolder.on('click', '.submit-search', function (e){
			e.preventDefault();
			var request = {};
			var classDays = ['M','T','W','R','F','S'];
			var dayList = advSearchHolder.find('.days');
			var classDaysChecked = '';
			request.department_name = basicSearchHolder.find('.department-input').val();
			request.name = basicSearchHolder.find('.course-input').val();
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
			//alert(JSON.stringify(request) + ' Send get request here');
			request = request;
			//alert('inside attach handler');

		//DELETE ALL OF THIS WHEN BACKEND READY
		/*
		this.all_classes.html('');
		var res = {};
		res.results = [];
		response = {};
		response.course = 'course';
		response.professor = 'prof_1';
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
		course_header = $('.course-header-element');
		attachLoadProfessorReviewsHandler();
		*/
		//DELETE ALL OF THIS ABOVE WHEN BACKEND READY

			var onSuccess = function(data){
				//Take the returned list of classes and insert each one.
				if(data.status == 1){
					this.all_classes.html('');
					insertQueryResults(data);
					course_header = $('.course-header-element');
					attachLoadProfessorReviewsHandler();
					//$('#query-results-container').show();
					//$('#home-page').hide();
					//query_results_page.show();
					//this.user_reviews_page.hide();
					//home_page.hide();
					show_page(1);
					

				};
				if(data.status == -1){
					//alert('there was an error returned from server');
					console.error('there was an error returned from server');
				};

			};
			var onFailure = function(data){
				console.error('could not get course list');
				console.log(JSON.stringify(data));
			};


		//DELETE BELOW WHEN READY FOR AJAX
		/*
		insertCourse('169');
		insertCourse('249A');
		*/
		//DELETE ABOVE WHEN READY FOR AJAX

			//onSuccess check status code. pass the json and insert dat ish. hide #home-page show #query-results-page
			makeGetRequest('/api/courses?' + request, onSuccess, onFailure);

		});

	};

	this.insertCourse = function(course){
		var newElem = $(templateCourse);
		newElem.attr('value',course);
		newElem.html(course);
		newElem.removeAttr('selected');
		newElem.removeAttr('disabled');
		newElem.removeClass('default-option');
		newElem.addClass('course-added');
		courseList.append(newElem);
	};

	this.insertCourseList = function(department_query){
		courseList.find('option').remove('.course-added');
		//top line removes old list
		var onSuccess = function(data){
			//Take the returned list of classes and insert each one.
			var len = data.results.length;
			for(i=0; i < len; i++){
				insertCourse(data.results[i].name);
			}

		};
		var onFailure = function(){
			console.error('could not get department list');
		};

		makeGetRequest('/api/courses?department_name=' + department_query, onSuccess, onFailure);
		//the bottom ones go away once we have ajax calls
		/*
		//DELETE BELOW WHEN READY FOR AJAX
		insertCourse('169');
		insertCourse('249A');
		//DELETE ABOVE WHEN READY FOR AJAX
		*/
	};

	this.attachCourseListHandler = function(){
		$(departmentList).on('change',function(){
			var department = $(this).val();
			department = department.replace(/ /g,'%20');
			var query = department;
			//alert(query);
			insertCourseList(department);
		});
	};

	this.insertDepartment = function(dept){
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
	this.insertDepartmentList = function() {
		var onSuccess = function(data){
			var k;
			//Take the returned list of departments and insert each one.
			var len = data.results.length;
			for(k=0; k < len; k++){
				insertDepartment(data.results[k].department_name);
			}

		};
		var onFailure = function(data){
			console.error('could not get department list');
			console.log(JSON.stringify(data));
		};
		makeGetRequest('/api/departments', onSuccess, onFailure);
		// The bottom ones go away once we have ajax calls


		//DELETE BELOW WHEN READY FOR AJAX
		/*
		insertDepartment('Computer Science');
		insertDepartment('Astronomy');
		insertDepartment('History');
		*/
		//DELETE ABOVE WHEN READY FOR AJAX
	};

	this.attachHelebearsButtonHandler = function(){
		helebears_button.on('click',function(e){
			e.preventDefault();
			$(".basic-search-form").trigger('reset');
			$(".advanced-search-form").trigger('reset');
			//query_results_page.hide();
			//this.user_reviews_page.hide();
			//home_page.show();
			show_page(0);
		});

	};

	this.attachUserInputHandler = function(){
		user_input.on('click', '#submit-input', function (e) {
			e.preventDefault (); // Tell the browser to skip its default click action
			var review = {};
			review.professor_name = name_of_professor;
			review.review = user_input.find('.rating-input-text').val();
			review.rating_1 = user_input.find('.rating-input-1').val();
			review.rating_2 = user_input.find('.rating-input-2').val();
			review.rating_3 = user_input.find('.rating-input-3').val();

			// smile.title = create.find('.title-input').val();
			//smile.space = smileSpace; //smileSpace
			//smile.story = create.find('.story-input').val();
			//smile.happiness_level = parseInt(create.find('.happiness-level-input').val());
			var onSuccess = function(data) {
				//check for errors
				//alert('successful post');
				insertUserRating(data.review[0]);
				user_input.find('.review-box').trigger('reset');
			};
			var onFailure = function() {
			   console.error('unable to submit post');
			};
			var errors = check_post_request(review);
			if(errors.length){
				var error_string = "";
					for(i = 0; i < errors.length; i++)
						error_string = error_string + errors[i] + '\n';
					alert(error_string);
			}else{
				makePostRequest('/api/reviews/create',review,onSuccess,onFailure);
				//insertUserRating(review);
				//note: The above line is removed when actually posting a review.
				//This is also why it does not have an id - becasue it is generated from the server.
				//user_input.find('.review-box').trigger('reset');
			}

		});
	};

	this.attachCancelHandler = function() {
		button = $('#cancel-review');
		button.on('click', function(e) {
			e.preventDefault();
			this.user_reviews_page.slideUp();
			home_page.slideUp();
			query_results_page.slideDown();
			//show_page(1);
		});
	};


	this.start = function() {

		//FROM ORIGINAL INDEX.JS
        logIn = $('.log-in');
        signUp = $('.sign-up');
		departmentList = $('.department-input');
		templateDepartment = $('.department-input .department-option')[0].outerHTML;
		courseList = $('.course-input');
		templateCourse = $('.course-input .course-option')[0].outerHTML;
		basicSearchHolder = $('.basic-search-form');
		advSearchHolder = $('.advanced-search-form');

		//ADDED BUT WOULD BE ON RESULTS.JS
		course_header = $('.course-header-element');

		//FROM ORIGINAL RESULTS.JS
		classSingle = $('.single-class');
		this.all_classes = $('.all-class-results');
		classSingleTemplateHtml = $(".all-class-results .single-class")[0].outerHTML;
		section_trTemplateHtml = $('.section-tr')[0].outerHTML;
		lab_trTemplateHtml = $('.lab-tr')[0].outerHTML;
		sectionTableTemplateHtml = $(".section-div")[0].outerHTML;
		labTableTemplateHtml = $(".lab-div")[0].outerHTML;
		this.all_classes.html('');

		//FROM ORIGINAL REVIEWS.JS
		user_input = $('.review-input');
		overallReview = $('.review-overall');
		this.user_reviews = $('.all-user-reviews');
		userReviewTemplateHtml = $(".all-user-reviews .single-review")[0].outerHTML;
		this.user_reviews.html('');

		query_results_page = $('#query-results-page');
		this.user_reviews_page = $('#user-reviews-page');
		home_page = $('#home-page');

		helebears_button = $('#helebears-button');

		// convert to outerHTML, then use $(templateDepartment) to essentially
		// create a new object to later attach. If you do not do outerHTML, it will
		// not point your new var to a new object, and when you try to add it into
		// the html, it does not add properly.
      //  attachLogInHandler();
     //   attachSignUpHandler();
		this.attachAdvancedSearchHandler();
		this.attachCourseListHandler();
		this.attachSubmitSearchHandler();
		this.attachLoadProfessorReviewsHandler();
		this.attachUserInputHandler();
		this.insertDepartmentList();
		this.attachHelebearsButtonHandler();

/*
		query_results_page.hide();
		this.user_reviews_page.hide();
		home_page.show();
*/
		show_page(10);
		this.attachCancelHandler();

		//remove everything below this when ready
		/*
		query_results_page.show();
		this.user_reviews_page.show();
		home_page.show();
		*/
	};

	/*return {
		start: start
		//check_post_request: check_post_request
	};*/
};
