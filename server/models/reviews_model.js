/**
 * Created by nirshtern on 10/21/15.
 */


var classModel = require("./models/class_models");

var Professors = sequelize.define('Professors', {
  professor_name: { type: Sequelize.STRING, primaryKey: true}
})

function professorsModel() {

};

// Inherit the method of superclass
professorsModel.prototype = new classModel();

//Override the parent method dataValidator
professorsModel.prototype.dataValidator = function() {

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

