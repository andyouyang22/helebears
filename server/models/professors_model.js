/**
 * Created by nirshtern on 10/21/15.
 */


var classModel = require("./class_models");

var sequelize_modules = require("./init")
var sequelize = sequelize_modules.sequelize;
var Sequelize = sequelize_modules.Sequelize;

var Professors = sequelize.define('Professors', {
  professor_name: { type: Sequelize.STRING, primaryKey: true}
})

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

function professorsModel() {

};

// Inherit the method of superclass
professorsModel.prototype = new classModel();

//Override the parent method dataValidator
professorsModel.prototype.dataValidator.create = function(queryJSON) {
    var errors = [];
    var response = {};

    if (Object.keys(queryJSON).length == 0){
        errors.push('No arguments were provided');
    }
    var professor = queryJSON.professor;
    if ((!professor) || professor.length < 1 || professor.length > 128){
        errors.push('Invalid professor name length.');
    }
    var rating_1 = queryJSON.rating_1;
    if ((!rating_1) || rating_1.length < 1 || rating_1.length > 128){
        errors.push('Invalid professor name length.');
    }

    var rating_2 = queryJSON.rating_2;
    if ((!rating_2) || rating_2.length < 1 || rating_2.length > 128){
        errors.push('Invalid rating_2 length.');
    }

    var rating_3 = queryJSON.rating_3;
    if ((!rating_3) || rating_3.length < 1 || rating_3.length > 128){
        errors.push('Invalid rating_3 length.');
    }

    if (errors.length > 0){
        response.status = constants.STATUS_ERROR;
        response.errors = errors;
    } else {
        response.status = constants.STATUS_SUCCESS;
    }
};

professorsModel.prototype.dataValidator.get = function(queryJSON) {
    var errors = [];
    var response = {};

    if (Object.keys(queryJSON).length == 0){
        errors.push('No arguments were provided');
    }
    var professor = queryJSON.professor;
    if ((!professor) || professor.length < 1 || professor.length > 128){
        errors.push('Invalid professor name length.');
    }

    if (errors.length > 0){
        response.status = STATUS_ERROR;
        response.errors = errors;
    } else {
        response.status = STATUS_SUCCESS;
    }
};



//Override the parent method dataValidator
professorsModel.prototype.preprocess = function() {

};

//Override the parent method dataValidator
professorsModel.prototype.postprocess = function() {

};

//Override the parent method dataValidator
professorsModel.prototype.controller = function() {

};

professorsModel.prototype.getReviews = function(prof_name) {

};

professorsModel.prototype.createReviews = function(prof_name) {

};

module.exports = professorsModel;

