# HeleBears

This is the main repository for the HeleBears project of Computer Science 169, Fall 2015.

## Running the Application

Enter the `server/` folder. Once there, run the server using the following command:

	debug=server npm start

## Running Front End Tests

	/static/testing/index_test.html

Go to the above file to view the results. For code coverage, see below (The coverage shown on this page is not correct).

## Running Back End Tests

After the server is running, we can run the tests with the following
commands from the same `server/` folder. For unit tests,

	./node_modules/.bin/mocha tests/unit_tests/


For functional tests,

	./node_modules/.bin/mocha tests/functional_tests/


## Viewing Code Coverage:

First install `instanbul`.

	npm install -g istanbul

To view front end coverage, go to the `static/testing/` folder

	istanbul cover ./node_modules/.bin/_mocha tests/unit_tests/
	open coverage/lcov-report/index.html

To view back end coverage, go to the `server/` folder

	istanbul cover ./node_modules/.bin/_mocha tests/unit_tests/  ./node_modules/.bin/_mocha tests/functional_tests/
	open coverage/lcov-report/index.html

## Compiling ReactJS JSX Code

The `scripts/bundle.js` file is the compiled JSX code. It is compiled using the Babel compiler. This is such that local html/jsx/js can be used while using the
server that is located at protected-refugee. To compile the JSX, do the following:

	browserify -t [ babelify --presets [ react ] ] calendar.js -o bundle.js


## Contributors

* Ryan Kashi
* Alex Khodaverdian
* Andy Ouyang
* Nir Shtern
* Shai Yusov
