/**
 * Created by nirshtern on 10/31/15.
 */


    describe('Asynchronous Users Testing', function() {

        before(function () {
            // runs before all tests in this block
            Users.bulkCreate([
                {username: 'TestUser', email: 'test1@email.com', password: UsersMethods.generateHash('password')},
                {username: 'TestUser', email: 'test2@email.com', password: UsersMethods.generateHash('password')},
                {username: 'TestUser', email: 'test3@email.com', password: UsersMethods.generateHash('password')}
            ]);
        });

        after(function () {
            // runs after all tests in this block
            Users.destroy({
                where: {username: 'TestUser'}
            });
        });

        beforeEach(function () {
            // runs before each test in this block
            Users.sync(done);
        });

        afterEach(function () {
            // runs after each test in this block
            Users.sync(done);
        });

        // test cases
        describe('Users Model Query Works ', function () {
            it('contain exactly one user with email: test1@email.com', function (done) {
                //
                Users.find({where: {email: 'test1@email.com'}})
                    .then(function (user) {
                        if (!user)
                            return done(err, 'No User was found');

                        user.dataValues.email.should.equal('test1@email.com');
                        done();
                    });
            });
        });
    });




