# HeleBears - ReactJS Branch

This branch focused primarily on the development of the Calendar page using the ReactJS framework. The HTML framework for this page is in `static/calendar.html`.

## Opening the Calendar Page

Note the new `server-react.js` and `package.json` files in the `static/` directory. `server-react.js` is a very basic Node.js server intended solely to serve GET requests for the `calendar.html` page. `package.json` contains its NPM dependencies.

These files are necessary because we can't test Calendar by opening the local file directly in the browser; to my understanding, ReactJS requires that the files be delivered to the browser via HTTP (among other protocols). First, set up the server

	cd static/
	npm install

Start the server

	node server-react.js

which will create a server listening locally on port 3001. To see the web page, go to your browser (I've been developing in Chrome) and open up `localhost:3001`.

## Calendar in ReactJS

The Calendar page is currently split into two sections, the Calendar section and the Query section. The Query section contains a Search section and a Results section.

Right now, I'm not sure if the current Calendar implementation (as an HTML table) is the best option. Last iteration, I tried using five separate `div`s for columns, each having 14 `div`s for hour blocks and additional `Course` objects for courses scheduled on the corresponding day. I think this implementation would make it easier to insert courses into the Calendar, which is something I'm putting off for now.

Currently, the static React framework is there, but most of the functionality is missing.
