var assert = require('assert');
var course_model = require("../../models/course_models")
var departments_model = require("../../models/departments_model");
var professors_model = require("../../models/professors_model");
var courseModel = course_model.courseModel;
var Courses = course_model.Courses;
var Departments = departments_model.Departments;
var Professors = professors_model.Professors;





describe('============== Courses ==============', function() {
	it('Queried Courses Model Successfully with findAll()', function (done) {
  		Courses.findAll().then(function(departments){
  			assert(true)

  			done()

    	}).error(function(err){
    		assert(false)
    		done()
    	})
  	})
  	it('Queried Courses Model Successfully with findOne()', function (done) {
  		Courses.findOne().then(function(departments){
  			assert(true)

  			done()

    	}).error(function(err){
    		assert(false)
    		done()
    	})
  	})
  	it('Attempt to create a course with an invalid key', function(done){
  		Courses.create({departmento:"PleaseError"}).then(function(result){
  			throw "Courses did not properly error out"
  			done()
  		}).error(function(err){
  			done()
  		})
  	})
	it('Test postprocess fail()', function(done){
		res = {}
		res.json = function(v){}
		courseModel.postprocess(res, {asd: "!!!"})
		done()
	})

  	it('Test controller()', function(done){
  		res = {}
  		res.json = function(v){}
  		courseModel.controller(res, {})
  		done()
  	})
});


describe('======= Asynchronous Course Testing =======', function() {

	before(function() {
		// runs before all tests in this block
        Departments.create({department_name: 'TESTING'});
        Professors.create({professor_name: 'TESTING, TEST'});
		Courses.bulkCreate([
			{name_and_number:'200 1', professor_name:'TESTING, TEST', department_name:'TESTING', ccn: 2},
            {name_and_number:'300 1', professor_name:'TESTING, TEST', department_name:'TESTING', ccn: 3},
            {name_and_number:'400 1', professor_name:'TESTING, TEST', department_name:'TESTING', ccn: 4},
            {name_and_number:'100 1', professor_name:'TESTING, TEST', department_name:'TESTING', ccn: 1}
		]);
	});

	after(function() {
		// runs after all tests in this block
        Departments.destroy({
            where: {department_name: 'TESTING'}
        });
        Professors.destroy({

        });
		Courses.destroy({
			where: {department_name: 'TESTING'}
		});
	});

	beforeEach(function() {
		// runs before each test in this block
		Users.sync();

	});

	afterEach(function() {
		// runs after each test in this block
		Users.sync();
	});

	// test cases

	describe('Users Model Query Works ', function() {
		it('contain exactly one user with email: test1@email.com', function(done) {
			//
			Users.find({where: {email: 'test1@email.com'}})
					.then(function(user){
						if (!user)
							return done(err,'No User was found');

						user.dataValues.email.should.equal('test1@email.com');
						done();
					});
		});
	});

	describe('Add Two Users with same email', function() {
		it('Should not allow to add existing email', function(done) {
			Users.create({ username: 'TestUser', email: 'test2@email.com', password: 'password' })
					.then(function(user){
						done(err,'Allowed storing two user with same primary key email.')
					}).catch(function(error) {
				done();
			})
		});
	});

	describe('UserMethods validPassword works ', function() {
		it('It should reflect equlity', function(done) {
			assert.equal(UsersMethods.validPassword('password',UsersMethods.generateHash('password')),true);
			done();
		});
	});

});