/**
 * The Menu section of the page. This section displays the logo and may contain
 * additional menu buttons, such as the log-out button.
 */

var React    = require('react');
var ReactDOM = require('react-dom');
var ajax = require('./util/ajax.js');

var Menu = React.createClass({
	render: function() {
		return (
			<header>
				<Menu.Logo />
				<Menu.Buttons />
			</header>
		);
	}
});

Menu.Logo = React.createClass({
	render: function() {
		return (
			<a className='pure-menu-heading pure-menu-link'>HeleBears</a>
		);
	}
});

Menu.Buttons = React.createClass({
	LogOutRequest: function(){
		var onSuccess = function(data){
			console.log('logged out!');
		};
		
		var onFailure = function(){
			console.error('could not find path');
		};
		
		ajax.get('/logout',onSuccess, onFailure);
		//The bottom line is just to check if ajax requests are ever successful
		//ajax.get('/api/courses?department_name=Math%20Science&course_name=52', onSuccess, onFailure);
	},
	
	
	render: function() {
		return (
			<ul className='pure-menu-list'>
				<a className='pure-menu-link' onClick={this.LogOutRequest}>Log Out</a>
			</ul>
		);
	}
});

module.exports = Menu;
