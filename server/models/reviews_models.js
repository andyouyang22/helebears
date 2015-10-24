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

    postprocess: function (queryResults,res) {

    },

    controller: function (query_args,type,res) {
        // The controller is responsible to navigate between preprocess, process and postprocess and provide
        // the answer to the client the required format.
            reviewsModel.preprocess(query_args,type,res);


    }
}


//var r = Reviews.build({rating_1:9, rating_2:10, rating_3:9, review:"This Professor... overall good experience", professor_name: "Necula"})
//r.save()
//
//var r = Reviews.build({rating_1:7, rating_2:7, rating_3:8, review:"I like the way he explains...great lectures. ", professor_name: "Kashi"})
//r.save()
//var r = Reviews.build({rating_1:10, rating_2:9, rating_3:4, review:"Great presentation.", professor_name: "Alex"})
//r.save()
//var r = Reviews.build({rating_1:7, rating_2:8, rating_3:9, review:"", professor_name: "Jay"})
//r.save()
//var r = Reviews.build({rating_1:5, rating_2:7, rating_3:7, review:"Not every Professor gets a review from me...", professor_name: "Ben-David"})
//r.save()
//var r = Reviews.build({rating_1:8, rating_2:8, rating_3:8, review:"I hope you'll read this review.. it will help you decide about the class", professor_name: "Ben-David"})
//r.save()
//var r = Reviews.build({rating_1:7, rating_2:7, rating_3:5, review:"Awesome", professor_name: "Garcia"})
//r.save()
//var r = Reviews.build({rating_1:10, rating_2:7, rating_3:8, review:"Perfect", professor_name: "Garcia"})
//r.save()
//var r = Reviews.build({rating_1:5, rating_2:3, rating_3:9, review:"Terrible", professor_name: "Garcia"})
//r.save()
//var r = Reviews.build({rating_1:8, rating_2:6, rating_3:9, review:"ahhh..I'm not sure what to say", professor_name: "Benjamin Jones"})
//r.save()
//var r = Reviews.build({rating_1:10, rating_2:10, rating_3:10, review:"Should retire already...", professor_name: "Lenovo"})
//r.save()
//var r = Reviews.build({rating_1:4, rating_2:5, rating_3:6, review:"I like the topic, but...", professor_name: "McDavid"})
//r.save()


module.exports.Reviews = Reviews;
module.exports.reviewsModel = reviewsModel;



