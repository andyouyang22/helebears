/**
 * Created by alexkhodaverdian on 10/21/15.
 */

/**
 * Class used for connecting sequelize to the database
 */
var Sequelize = require('sequelize');

var con_string = process.env.DATABASE_URL || 'postgres://postgres:123@localhost:5432/hb'

var sequelize = new Sequelize(con_string);
sequelize.sync();

module.exports.Sequelize = Sequelize;
module.exports.sequelize = sequelize;
