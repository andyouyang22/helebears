/**
 * Created by nirshtern on 10/21/15.
 */


var sequelize_modules = require("./init")

var sequelize = sequelize_modules.sequelize
var Sequelize = sequelize_modules.Sequelize

var professors_model = require("./professors_model")
var Professors = professors_model.Professors;


var Reviews = sequelize.define("Reviews", {
    rating_1: Sequelize.INTEGER,
    rating_2: Sequelize.INTEGER,
    rating_3: Sequelize.INTEGER,
    review: Sequelize.STRING,
    professor_name: {
        type: Sequelize.STRING,
        references: {
            model: Professors,
            key: 'professor_name',
        }
    },
})
Reviews.sync()
a = Reviews.build({rating_1: 5, rating_2: 3, rating_3: 4, review: "Helloooo", professor_name:"Kozaki"})
a.save()

var reviewsModel = {
    getName: function () {

    },
    dataValidator: function (queryJSON, response) {
        var errors = [];


        if (Object.keys(queryJSON).length == 0) {
            errors.push('No arguments were provided');
        }
        var professor = queryJSON.professor;
        if ((!professor) || professor.length < 1 || professor.length > 128) {
            errors.push('Invalid professor name length.');
        }
        var rating_1 = queryJSON.rating_1;
        if ((!rating_1) || rating_1.length < 1 || rating_1.length > 128) {
            errors.push('Invalid professor name length.');
        }

        var rating_2 = queryJSON.rating_2;
        if ((!rating_2) || rating_2.length < 1 || rating_2.length > 128) {
            errors.push('Invalid rating_2 length.');
        }

        var rating_3 = queryJSON.rating_3;
        if ((!rating_3) || rating_3.length < 1 || rating_3.length > 128) {
            errors.push('Invalid rating_3 length.');
        }

        if (errors.length > 0) {
            response.status = -1;
            response.errors = errors;
        } else {
            response.status = 1;
        }
    },
    preprocess: function (query_args, filter,res) {
        filter['professor_name'] = query_args.professor;
        reviewsModel.searchQuery(filter,res)

    },

    searchQuery: function (filter, res) {
        Reviews.findAll({where: filter}).then(
            function (reviews) {
                var results = []
                for (var i = 0; i < reviews.length; i++) {
                    results.push(reviews[i].dataValues)
                }
                res.json({status: 1, "results": results})
            }).error(function (err) {
                res.json({status: -1, errors: [err]})
            })
    },

    postprocess: function (queryResults,res) {

    },

    controller: function (res, query_args) {
        // The controller is responsible to navigate between preprocess, process and postprocess and provide
        // the answer to the client the required format.
        var filter = {};
        reviewsModel.preprocess(query_args, filter, res)

    }
}


//var r = Reviews.build({rating_1:5, rating_2:3, rating_3:5, review:"Terrible", professor_name: "Deneros"})
//r.save()

module.exports.Reviews = Reviews;
module.exports.reviewsModel = reviewsModel;



