
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.get('/', function(req, res) {
	res.sendFile(__dirname + "/calendar.html");
});

app.use(express.static(__dirname));

var server = app.listen(app.listen(3001), function() {
	console.log("Listening on localhost:3001");
});
