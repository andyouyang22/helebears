var assert = require('assert');
var user_model = require("../../models/user_models")

var Users = user_model.Users;
var UsersMethods = user_model.UserMethods;



describe('============== Users ==============', function() {
    it('Queried Users Model Successfully with findAll()', function (done) {
        Users.findAll().then(function(users){
            assert(true)

            done()

        }).error(function(err){
            assert(false)
            done()
        })
    })
    it('Queried Courses Model Successfully with findOne()', function (done) {
        Users.findOne().then(function(users){
            assert(true)

            done()

        }).error(function(err){
            assert(false)
            done()
        })
    })
    it('Attempt to create a course with an invalid key', function(done){
        Users.create({useron:"PleaseError"}).then(function(result){
            throw "Users did not properly error out"
            done()
        }).error(function(err){
            done()
        })
    })
    //it('Test preprocess()', function(done){
    //    res = {}
    //    res.json = function(v){}
    //    courseModel.preprocess(res, {})
    //    done()
    //})
    //it('Test controller()', function(done){
    //    res = {}
    //    res.json = function(v){}
    //    courseModel.controller(res, {})
    //    done()
    //})
})

describe('hooks', function() {

    before(function() {
        // runs before all tests in this block
    });

    after(function() {
        // runs after all tests in this block
    });

    beforeEach(function() {
        // runs before each test in this block
    });

    afterEach(function() {
        // runs after each test in this block
    });

    // test cases
});
