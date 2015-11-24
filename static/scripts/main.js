
/**
 * The central script that renders the React components of index.html and stores
 * the global page state.
 */

var React    = require('react');
var ReactDOM = require('react-dom');

var Menu     = require('./menu.js');
var Calendar = require('./calendar.js');
var Query    = require('./query.js');

var ajax = require('./ajax.js');
var time = require('./time.js');

var Store = require('./store.js');

var store = new Store();

var testUser = "username420";

var MenuAPI = ReactDOM.render(
	<Menu />,
	document.getElementById('container-top')
);

var CalendarAPI = ReactDOM.render(
	<Calendar store={store} user={testUser} />,
	document.getElementById('container-left')
);

var QueryAPI = ReactDOM.render(
	<Query store={store} />,
	document.getElementById('container-right')
);
