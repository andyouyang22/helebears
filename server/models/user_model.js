/**
 * Created by nirshtern on 10/21/15.
 */



var sequelize_modules = require("./init")
var sequelize = sequelize_modules.sequelize;
var Sequelize = sequelize_modules.Sequelize;

var Users = sequelize.define("Users", {
  name: { type: Sequelize.STRING, primaryKey: true},
  password: Sequelize.STRING

})
Users.sync()

var usersModel = {
    getName: function() {

    },
        dataValidator: function(queryJSON) {
        var errors = [];
        var response = {};

        if (Object.keys(queryJSON).length != 0){
            errors.push('No arguments were received');
        }

        var username = queryJSON.username;
        if ((!username) || username.length < 1 || username.length > 128){
            errors.push('Invalid size of username');
        }
        var password = queryJSON.password;
        if ((!password) || password.length < 1 || password.length > 128){
            errors.push('Invalid size of password');
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