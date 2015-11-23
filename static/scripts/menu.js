/**
 * The Menu section of the page. This section displays the logo and may contain
 * additional menu buttons, such as the log-out button.
 */

var React    = require('react');
var ReactDOM = require('react-dom');

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
	render: function() {
		return (
			<ul className='pure-menu-list'>
			</ul>
		);
	}
});

module.exports = Menu;
