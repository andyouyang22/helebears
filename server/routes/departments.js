var express = require('express');
var router = express.Router();

var departments_models = require("../models/departments_model")
var departmentModel = departments_models.departmentModel
var Departments = departments_models.Departments

/* GET request for departments */
router.get('/', function(req, res) {
	var query_args = req.query;
	departmentModel.controller(query_args,'get',res)
});
router.post('/addDepartment', function(req, res){
	Departments.create(req.body).then(function(){
		res.send("Done")
	}).catch(function(err){
		console.log(err)
		res.send("Done")
	})
})

module.exports = router;