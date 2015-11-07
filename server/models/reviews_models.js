/**
 * Created by nirshtern on 10/21/15.
 */


var sequelize_modules = require("./init");

var sequelize = sequelize_modules.sequelize;
var Sequelize = sequelize_modules.Sequelize;

var professors_model = require("./professors_model");
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
            key: 'professor_name'
        }
    },
})
Reviews.sync()

/**
 * ReviewsModel - responsible for all interaction with the database model, API communicates directly with this module.
 * @type {{getName: Function, dataValidator: Function, preprocess: Function, searchQuery: Function, createQuery: Function, postprocess: Function, controller: Function}}
 */
var reviewsModel = {
    preprocess: function (query_args,type,res) {
        if (type === 'get') {
            reviewsModel.searchQuery(query_args, res);
        }

        if (type === 'post'){
            reviewsModel.createQuery(query_args,res);
        }

    },

    searchQuery: function (filter, res) {
        Reviews.findAll({where: filter}).then(
            function (reviews) {
                var results = []
                for (var i = 0; i < reviews.length; i++) {
                    results.push(reviews[i].dataValues)
                }
                res.json({status: 1, results: results})
            }).catch(function (err) {
                res.json({status: -1, errors: ['Unable to get reviews',err]})
            })
    },

    createQuery: function (arguments,res) {
            var entry = {
                rating_1: parseInt(arguments.rating_1),
                rating_2: parseInt(arguments.rating_2),
                rating_3: parseInt(arguments.rating_3),
                review: arguments.review,
                professor_name: arguments.professor_name
            };
            Reviews.create(entry).then(function(results){
                res.json({
                    status:1,
                    review:[results]
                })
            }).catch(function(err){
                    res.json({status: -1, errors:['Unable to create new review',err]});
            });
    },

    controller: function (query_args,type,res) {
        // The controller is responsible to navigate between preprocess, process and postprocess and provide
        // the answer to the client the required format.
            reviewsModel.preprocess(query_args,type,res);


    }
}


module.exports.Reviews = Reviews;
module.exports.reviewsModel = reviewsModel;



