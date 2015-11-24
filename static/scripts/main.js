
var React    = require('react');
var ReactDOM = require('react-dom');

var Menu     = require('./menu.js');
var Calendar = require('./calendar.js');
var Query    = require('./query.js');

var ajax = require('./ajax.js');
var time = require('./time.js');

var testUser = "username420";

var MenuAPI = ReactDOM.render(
	<Menu />,
	document.getElementById('container-top')
);

var CalendarAPI = ReactDOM.render(
	<Calendar courses={[]} user={testUser} />,
	document.getElementById('container-left')
);

var QueryAPI = ReactDOM.render(
	<Query />,
	document.getElementById('container-right')
);
