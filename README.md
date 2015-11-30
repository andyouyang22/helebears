# HeleBears

This is the main repository for the HeleBears project of Computer Science 169, Fall 2015.
Try out our app at http://protected-refuge-7067.herokuapp.com/

## Running the Application

Enter the `server/` folder. Once there, run the server using the following command:

	debug=server npm start

## Running Front End Tests

	/static/testing/index_test.html

Go to the above file to view the results. For code coverage, see below (The coverage shown on this page is not correct).

## Running Back End Tests

After the server is running, we can run the tests with the following commands from the same `server/` folder. For unit tests,

	./node_modules/.bin/mocha tests/unit_tests/


For functional tests,

	./node_modules/.bin/mocha tests/functional_tests/


## Viewing Code Coverage:

First install `instanbul`.

	npm install -g istanbul

To view front end coverage, go to the `static/testing/` folder

To view back end coverage, go to the `server/` folder

	> istanbul cover ./node_modules/.bin/_mocha tests/unit_tests/  ./node_modules/.bin/_mocha tests/functional_tests/
	> open coverage/lcov-report/index.html

In order to view the times every line was covered, you can use coverage/models where every model file is reported in depth

NOTE: The results from our run are available in the coverage folder of the repository (no need to run the testing to view)

## Selenium Testing
First, you must download and install the Selenium IDE for Firefox here:
http://www.seleniumhq.org/download/

Allow Firefox to install the addons.
Next, go into Tools -> Selenium IDE to start the IDE
Load the test suite inside of the Selenium Tests folder called:
'UI Tests with Selinium'

The number of tests will then pop up into Selenium.
Set the scroller to slowest to ensure ample time for the server to send data and for everything to render.

Select play-all to run all of the tests

## ReactJS DOM Structure

The following is the high-level class structure of `index.html`:

	+-----------------------------------------------+
	| Menu                                          |
	+-----------------------------------------------+
	+----------------------+ +----------------------+
	| Calendar             | | Query                |
	|                      | | +------------------+ |
	|                      | | | Search           | |
	|                      | | +------------------+ |
	|                      | | +------------------+ |
	|                      | | | Results          | |
	|                      | | |                  | |
	|                      | | |                  | |
	|                      | | |                  | |
	|                      | | +------------------+ |
	+----------------------+ +----------------------+

## Compiling ReactJS JSX Code

The `scripts/bundle.js` file is the result of compiling the React JSX code in `scripts/main.js`. This code is linked using `browserify` and compiled using Babel. `browserify` allows us to use Node-like `require` syntax to link JavaScript modules in the front end. Babel compiles the JSX code down to JavaScript. Running the `bundle.sh` script will compile `scripts/main.js` and link its dependencies:

	npm install
	npm install -g browserify  # May need 'sudo'

	cd static/
	chmod +x bundle.sh  # Make bundle.sh an executable
	./bundle.sh         # Link and compile ReactJS files

The output will be stored in `scripts/bundle.js`.

## Contributors

* Ryan Kashi
* Alex Khodaverdian
* Andy Ouyang
* Nir Shtern
