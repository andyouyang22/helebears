/**
 * Created by nirshtern on 10/21/15.
 */



var sequelize_modules = require("./init");

var sequelize = sequelize_modules.sequelize;
var Sequelize = sequelize_modules.Sequelize;

var Professors = sequelize.define('Professors', {
  professor_name: { type: Sequelize.STRING, primaryKey: true}
});

Professors.sync();

var professorsModel = {
    preprocess: function(query_args,type,res) {
        if (type === 'get') {
            professorsModel.searchQuery(query_args, res);
        }

    },


    searchQuery: function(filter,res) {
        Professors.findAll({where: filter}).then(
            function (professors) {
                var results = []
                for (var i = 0; i < professors.length; i++) {
                    results.push(professors[i].dataValues)
                }
                res.json({status: 1, results: results})
            }).catch(function (err) {
                res.json({status: -1, errors: ['Unable to get reviews',err]})
            })
    },

    controller: function(query_args,type,res) {
        // The controller is responsible to navigate between preprocess, process and postprocess and provide
        // the answer to the client the required format.
        professorsModel.preprocess(query_args,type,res);

    }

};

module.exports.Professors = Professors;
module.exports.professorsModel = professorsModel;



