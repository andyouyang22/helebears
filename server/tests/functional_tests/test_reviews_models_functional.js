var assert = require('assert');
var reviews_models = require("../../models/reviews_models")

var reviewsModel = reviews_models.reviewsModel
var Reviews = reviews_models.Reviews


describe('============== Reviews FUNCTIONAL TESTS ==============', function() {

      it('Test double review okay', function(done){
        var professors_model = require("../../models/professors_model")
        var Professors = professors_model.Professors
        Professors.create({professor_name:" 7 "}).then(function(prof_name){
          Reviews.create({rating_1: 5, rating_2: 5, rating_3: 6, review:" ", professor_name: " 7 "}).then(function(r1){
             Reviews.create({rating_1: 5, rating_2: 5, rating_3: 6, review:" ", professor_name: " 7 "}).then(function(r2){
                r1.destroy({ force: true }).then(function(){
                  r2.destroy({ force: true }).then(function(){
                    prof_name.destroy({force: true})
                    done()
                  })
                })
                
                
             })
          })
    })
  })
});