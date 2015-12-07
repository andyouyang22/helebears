/**
 * Created by nirshtern on 11/25/15.
 */
/**
 * Created by nirshtern on 11/25/15.
 */
var assert = require('assert');
var should = require('chai').should();
var user_model = require("../../models/user_model")
var departments_model = require("../../models/departments_model");
var professors_model = require("../../models/professors_model");
var schedule_model = require("../../models/schedule_model");
var UsersMethods = user_model.UserMethods;
var Users = user_model.Users;
var Departments = departments_model.Departments;
var Professors = professors_model.Professors;
var Schedules = schedule_model.Schedules;


describe('======= Asynchronous Schedule + (Course, Department and Professor) Testing =======', function() {

    before(function(done) {
        // runs before all tests in this block
        Users.bulkCreate([
            {username:'TestUser', email:'test1@email.com', password:UsersMethods.generateHash('password')},
            {username:'TestUser', email:'test2@email.com', password:UsersMethods.generateHash('password')},
            {username:'TestUser', email:'test3@email.com', password:UsersMethods.generateHash('password')}
        ]);
        Departments.create({department_name: 'TESTING'});
        Professors.create({professor_name: 'TESTING, TEST'}).then(function(){
            Schedules.bulkCreate([
                {unique_id: 'TEST_ID', name_and_number: '200 1', ccn:2 },
                {unique_id: 'TEST_ID', name_and_number: '300 1', ccn:3 },
                {unique_id: 'TEST_ID', name_and_number: '400 1', ccn:4 },
                {unique_id: 'TEST_ID', name_and_number: '100 1', ccn:1 }
            ]).then(function(){
                done();
            });
        });
    });

    after(function() {
        // runs after all tests in this block
        Departments.destroy({
            where: {department_name: 'TESTING'}
        });
        Professors.destroy({
            where: {professor_name: 'TESTING, TEST'}
        });
        Users.destroy({
            where: {username: 'TestUser'}
        });
        Schedules.destroy({
            where: {unique_id:'TEST_ID'}
        });
    });

    beforeEach(function(done) {
        // runs before each test in this block
        Schedules.sync();
        done();

    });

    afterEach(function() {
        // runs after each test in this block
        Schedules.sync();
    });

    // test cases

    describe('After Environment setup', function() {
        context('Ensure testing data present is as expected', function(){

            it('contain exactly one department TESTING', function(done) {
                //
                Departments.find({where: {department_name: 'TESTING'}})
                    .then(function(department){
                        if (!department)
                            return done(err,'No department was found');

                        department.dataValues.department_name.should.equal('TESTING');
                        done();
                    });
            });

            it('contain exactly one professor TESTING, TEST', function(done) {
                //
                Professors.find({where: {professor_name: 'TESTING, TEST'}})
                    .then(function(professor){
                        if (!professor)
                            return done(err,'No professor was found');

                        professor.dataValues.professor_name.should.equal('TESTING, TEST');
                        done();
                    });
            });

            it('contain four courses with department TESTING', function(done) {
                //
                Users.findAll( {where: {username: 'TestUser'}})
                    .then(function(courses){
                        if (!courses)
                            return done(err,'No courses were found');

                        courses.length.should.equal(3);
                        done();
                    });
            });

            it('contain four courses in schedule of unique_id TEST_ID', function(done) {
                //
                Schedules.findAll({where: {unique_id: 'TEST_ID'}})
                    .then(function(courses){
                        if (!courses)
                            return done(err,'No courses were found in schedule');

                        courses.length.should.equal(4);
                        done();
                    });
            });

                it('Should not allow to add existing email', function(done) {
                    Users.create({ username: 'TestUser', email: 'test2@email.com', password: 'password' })
                        .then(function(user){
                            done(err,'Allowed storing two user with same primary key email.')
                        }).catch(function(error) {
                        done();
                    })
                });




        })
    });

});