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
