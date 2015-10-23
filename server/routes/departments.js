var express = require('express');
var router = express.Router();

var departments_models = require("../models/departments_model")
var departmentModel = departments_models.departmentModel
/* GET request for departments */
router.get('/', function(req, res) {
	var query_args = req.query;
	departmentModel.controller(query_args,'get',res)
});

module.exports = router;
