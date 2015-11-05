var expect = chai.expect;
var should = chai.should();

$(document).ready(function() {

describe('Compare Numbers', function() {
	home_object = new Home();
	home_object.start();
	it('1 should equal 1', function(){
		expect(1).to.equal(1);
	});
	
	it('2 should be greater than 1', function(){
		expect(2).to.be.greaterThan(1);
	});

});
	
	describe('Is Even Tests', function() {
		it('Should always return a boolean',function(){
			expect(isEven(2)).to.be.a('boolean');
		});
	});
	
	
	describe('Testing Error Catching on Posting a Review', function() {
		var review = {};
		review.professor_name = 'prof name';
		review.rating_1 = 1;
		review.rating_2 = 10;
		review.rating_3 = 5;
		review.review = 'non-empty review';
		var review_2 = $.extend({},review);
		
		
		it('Valid reviews return empty list', function(){
			expect(home_object.check_post_request(review)).to.be.empty;
		});
		review_2.rating_1 = 11;
		
		it('Catch rating 1 too high', function(){
			expect(home_object.check_post_request(review_2)).to.be.eql(["rating_1 must be between 1 and 10!"]);
		});
		
		var review_3 = $.extend({},review_2);
		review_3.review = '';
		it('User review too long',function(){
			expect(home_object.check_post_request(review_3)).to.be.eql(["rating_1 must be between 1 and 10!",'review is empty!']);
			//done();
		});
	});
	
	describe('User Ratings Properly Inserted',function(){
		var user_review = {};
		user_review.id = 123;
		user_review.rating_1 = 1;
		user_review.rating_2 = 2;
		user_review.rating_3 = 10;
		user_review.review = 'asdf';
		it('Insert a user review',function(){
			home_object.insertUserRating(user_review);
			expect($(home_object.user_reviews).find('.single-review')).to.have.length(1);	
		});
		
		it('Insert a second review', function(){
			home_object.insertUserRating(user_review);
			expect($(home_object.user_reviews).find('.single-review')).to.have.length(2);
		});
	
	});
	
	describe('Class results properly Inserted',function(){
		home_object.all_classes.html('');
		var res = {};
		res.results = [];
		response = {};
		response.department_name = 'dept';
		response.name_and_number = 'cd 123'
		response.professor_name = 'prof_1';
		response.ccn = '123123'
		response.time = 'time'
		var sections = [];
		var s1= {};
		var c1 = {};

		s1.type = 'Discussion'
		s1.ccn = 'CCN'
		s1.time = 'asdf'
		s1.instructor = 35;
		s1.limit = 24;
		sections.push(s1);

		c1.type = 'Discussion'
		c1.ccn = 'CCN'
		c1.time = 'asdf'
		c1.instructor = 35;
		c1.limit = 24;
		sections.push(c1);
		response.sections = sections;
		res.results.push(response);
		//res.results.push(response);
		//home_object.insertQueryResults(res);
		home_object.insertQueryResults(res);
		var all_classes = $('.all-class-results');
		var class_name = all_classes.find('.course-header-element').find('td')[0].innerHTML;
		var number_of_sections = all_classes.find('.section-table').find('tr').length;
		var number_of_labs = all_classes.find('.lab-table').find('tr').length
		
		it('Overall course data inserted properly',function(){
			
			expect(class_name).to.be.eql('dept: cd 123');
			//expect(number_of_sections).to.be.eql(2);	
		});
		it('Number of sections inserted properly',function(){
			expect(number_of_sections).to.be.eql(2);
		});
		it('Number of labs inserted is equal to 0', function(){
			expect(number_of_labs).to.be.eql(0);
		});
		
		it('Length of all_classes is equal to 1', function(){
			var number_of_classes = all_classes.find('.single-class').length;
			expect(number_of_classes).to.be.eql(1);
		});
		
		it('Inserting multiple classes properly appends (should now have length 2)',function(){
			//res.results.push(response);
			home_object.insertQueryResults(res);
			//insertClass(res.results[0]);
			var num_classes = all_classes.find('.single-class').length;
			expect(num_classes).to.be.eql(2);
		});
		
		
	});
	
	
	
	
});