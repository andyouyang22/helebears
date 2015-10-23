var Results = function() {

	var logIn;
	var signUp;
	var templateDepartment;
	var overallReview;
	var user_reviews;
	var userReviewTemplateHtml;
	var user_input;
	var name_of_professor;
	var classSingle;
	var all_classes;
	var classSingleTemplateHtml;
	var sectionTableTemplateHtml;
	var labTableTemplateHtml;
	
	var courseList;
	var templateCourse;
	
	var defaultColor = "#00b85c";
	var selectedColor = "#00a653"
	
	
	var response //delete me once ready!
	

	var makeGetRequest = function(url, onSuccess, onFailure) {
       $.ajax({
           type: 'GET',
           url: apiUrl + url,
           dataType: "json",
           success: onSuccess,
           error: onFailure
       });
   };
	
	var makePostRequest = function(url, data, onSuccess, onFailure) {
        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: onSuccess,
            error: onFailure
        });
    };
	
	var check_post_request = function(review){
		var error_list = [];
		if(review.professor.length == 0)
			error_list.push('Professor is empty!');
		if(review.professor.length > 64)
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
		
	}
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

	
	
	var insertRatingsOverall = function(ratings_dict){
		name_of_professor = ratings_dict.professor; //Store the name of the professor locally.
		//This is used so that when we call a post request to post a review, we do not have to call
		//overallReview.find('.professor-name').html() to do retreive the name.
		overallReview.find('.professor-name').html(ratings_dict.professor);
		var ratings_table = overallReview.find('.review-values')[0];
		ratings_table.rows[0].cells[1].innerHTML = ratings_dict.overall_rating_1
		ratings_table.rows[1].cells[1].innerHTML = ratings_dict.overall_rating_2;
		ratings_table.rows[2].cells[1].innerHTML = ratings_dict.overall_rating_3;
		
	};
	
	var insertUserRating = function(user_review){
		var newElem = $(userReviewTemplateHtml);
		newElem.attr('id',user_review.id);
		newElem.find('.time').text(user_review.time);
		newElem.find('.user-name').text(user_review.name);
		newElem.find('.row-1').find('td')[1].innerHTML = user_review.rating_1;
		newElem.find('.row-2').find('td')[1].innerHTML = user_review.rating_2;
		newElem.find('.row-3').find('td')[1].innerHTML = user_review.rating_3;
		newElem.find('.review-user-text').text(user_review.review);
		user_reviews.append(newElem);
		
	};
	
	var insertProfessorOverallRatings = function(professor_name){
		var onSuccess = function(data){
			//Return dictionary of {professor: prof_name, rating_1: value, rating_2: value, etc}
			insertRatingsOverall(data);
		};
		var onFailure = function(){
		//console.error('could not retreive overall ratings');	
		};
		//makeGetRequest(url_to_get_professor's ratings, onSuccess, onFailure);
		var ratings_dict = {};
		ratings_dict.professor = professor_name;
		ratings_dict.overall_rating_1 = 8;
		ratings_dict.overall_rating_2 = 9;
		ratings_dict.overall_rating_3 = 10;
		insertRatingsOverall(ratings_dict);
	};
	
	var insertProfessorUserRatings = function(professor_name){
		var onSuccess = function(data){
			/*
			for review in data:
				insertUserRating(review)
			*/
		};
		var onFailure = function(){
			//console.error('could not retrieve user ratings');		
		};
		//makeGetRequest(url_to_get_user_ratings_for_professor, onSuccess, onFailure);
		user_review = {};
		user_review.id = 123;
		user_review.time = 'Jan 15th, 2015';
		user_review.name = 'ya_boi_66';
		user_review.rating_1 = 5;
		user_review.rating_2 = 7;
		user_review.rating_3 = 10;
		user_review.review = 'a user review inputted through javascript (send the function 2ce)!';
		insertUserRating(user_review);
		insertUserRating(user_review);
	};

	/*
	var attachUserInputHandler = function(){
		user_input.on('click', '#submit-input', function (e) {
			e.preventDefault (); // Tell the browser to skip its default click action
			//var smile = {}; // Prepare the smile object to send to the server
			var review = {};
			review.professor = name_of_professor;
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
				//insertUserRating(data.review);
            };
			var onFailure = function() { 
               // console.error('unable to submit post'); 
            };
			var errors = check_post_request(review);
			if(errors.length){
				var error_string = "";
					for(i = 0; i < errors.length; i++)
						error_string = error_string + errors[i] + '\n';
					alert(error_string);
			}else{
				//makePostRequest(url_of_post_request,review,onSuccess,onFailure);
				insertUserRating(review);
				//note: The above line is removed when actually posting a review.
				//This is also why it does not have an id - becasue it is generated from the server.
				user_input.find('.review-box').trigger('reset');
			}
			
		});
	};
*/	
	
	var insertUserRating = function(user_review){
		var newElem = $(userReviewTemplateHtml);
		newElem.attr('id',user_review.id);
		newElem.find('.time').text(user_review.time);
		newElem.find('.user-name').text(user_review.name);
		newElem.find('.row-1').find('td')[1].innerHTML = user_review.rating_1;
		newElem.find('.row-2').find('td')[1].innerHTML = user_review.rating_2;
		newElem.find('.row-3').find('td')[1].innerHTML = user_review.rating_3;
		newElem.find('.review-user-tefunction(class)xt').text(user_review.review);
		user_reviews.append(newElem);
		
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
		if(newElem.find('.lab-table').find('td')[0].innerHTML == 'REMOVE')
			newElem.find('.lab-div').remove();
		if(newElem.find('.section-table').find('td')[0].innerHTML == 'REMOVE')
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
	
	var start = function() {
		//When this page is added onto the Query results page, we will call
		//insertProfessorOverallRatings when a professor name is clicked as well as
		//insertProfessorUserRatings to retreive the overall ratings and the individual user ratings.
		//All of the functions that attach handlers will be moved to the start function
		//On the query results page (because the contents inside of reviews.html will be placed inside of
		//query.html and hidden).
		//the vars will be moved inside of the other start function as well.

			
		classSingle = $('.single-class');
		all_classes = $('.all-class-results');
		classSingleTemplateHtml = $(".all-class-results .single-class")[0].outerHTML;
		sectionTableTemplateHtml = $(".section-div")[0].outerHTML;
		labTableTemplateHtml = $(".lab-div")[0].outerHTML;
					
		all_classes.html('');			
		
		//attachUserInputHandler();
		//attachLogInHandler();
		//attachSignUpHandler();
		
		//insertProfessorOverallRatings('prof_name');
		//insertProfessorUserRatings('prof_name');
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
	};

	return {
		start: start
	};
}();
