var express = require('express');
var router = express.Router();

var departments_models = require("../models/departments_model")
var departmentModel = departments_models.departmentModel
/* GET request for departments */
router.get('/', function(req, res, next) {
	departmentModel.postprocess(res)
});

module.exports = router;
