# HeleBears

This is the main repository for the HeleBears project of Computer Science 169, Fall 2015.

How to run:

Enter the server folder.
Once there, run the server using the following command:

	debug=server npm start

After the server is running, we can run the tests with the following
commands from the same folder (/server):
Unit Tests:

	./node_modules/.bin/mocha tests/unit_tests/
	

Functional Tests:

	./node_modules/.bin/mocha tests/functional_tests/

Front End Unit and Functional Tests:

	/static/testing/index_test.html
	
	Go to the above file to view the results.
	(For code coverage, see below. The coverage shown on this page is not correct).


To View Code Coverage:

	First install instanbul.
	npm install -g istanbul
	
	FRONTEND:
	go to testing folder
	
	istanbul cover ./node_modules/.bin/_mocha tests/unit_tests/
	open coverage/lcov-report/index.html
	
	BACKEND:
	go to server folder
	
	istanbul cover ./node_modules/.bin/_mocha tests/unit_tests/  ./node_modules/.bin/_mocha tests/functional_tests/
	open coverage/lcov-report/index.html
	

## Contributors

* Ryan Kashi
* Alex Khodaverdian
* Andy Ouyang
* Nir Shtern
* Shai Yusov
