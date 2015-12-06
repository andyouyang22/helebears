var assert = require('assert');
var user_model = require("../../models/user_model")
var should = require('chai').should();
var Users = user_model.Users;
var UsersMethods = user_model.UserMethods;



describe('============== Users ==============', function() {
    it('Queried Users Model Successfully with findAll()', function (done) {
        Users.findAll().then(function (users) {
            assert(true)

            done()

        }).error(function (err) {
            assert(false)
            done()
        })
    });
    it('Queried Users Model Successfully with findOne()', function (done) {
        Users.findOne().then(function (users) {
            assert(true)
            done()

        }).error(function (err) {
            assert(false)
            done()
        })
    });
    it('Attempt to create a course with an invalid key', function (done) {
        Users.create({id: "PleaseError"}).then(function (result) {
            throw "Users did not properly error out"
            done()
        }).error(function (err) {
            done()
        })
    });
});

describe('Asynchronous Users Testing', function() {

    before(function() {
        // runs before all tests in this block
        Users.bulkCreate([
            {username:'TestUser', email:'test1@email.com', password:UsersMethods.generateHash('password')},
            {username:'TestUser', email:'test2@email.com', password:UsersMethods.generateHash('password')},
            {username:'TestUser', email:'test3@email.com', password:UsersMethods.generateHash('password')}
        ]);
    });

    after(function() {
        // runs after all tests in this block
        Users.destroy({
            where: {username: 'TestUser'}
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


    describe('UserMethods validPassword works ', function() {
        it('It should reflect equlity', function(done) {
            assert.equal(UsersMethods.validPassword('password',UsersMethods.generateHash('password')),true);
            done();
        });
    });

});




