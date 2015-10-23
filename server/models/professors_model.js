/**
 * Created by nirshtern on 10/21/15.
 */



var sequelize_modules = require("./init")

var sequelize = sequelize_modules.sequelize
var Sequelize = sequelize_modules.Sequelize

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
Professors.sync()
Reviews.sync()

var professorsModel = {
    getName: function() {

    },
        dataValidator: function(queryJSON) {
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
    },
    preprocess: function() {

    },

    postprocess: function() {

    },

    controller: function() {

    }

};

module.exports = professorsModel;
module.exports.Professors = Professors;



