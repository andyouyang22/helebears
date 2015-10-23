var express = require('express');
var router = express.Router();

var reviews_models = require("../models/reviews_models");
var reviewsModel = reviews_models.reviewsModel;


/* GET request for getting reviews of a specific professor */
router.get('/', function(req, res) {
    var query_args = req.query;
    reviewsModel.controller(res,query_args,'get');
});

/* POST request for creating a review for a professor */
router.post('/create',function(req, res) {
    var query_args = req.body;
    reviewsModel.controller(res,query_args,'post');
});


module.exports = router;
