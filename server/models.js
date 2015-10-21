var Sequelize = require('sequelize');

var con_string = process.env.DATABASE_URL || 'postgres://postgres:123@localhost:5432/postgres'
var sequelize = new Sequelize(con_string);
sequelize.sync()

var Departments = sequelize.define('Departments', {
  department: { type: Sequelize.STRING, primaryKey: true}
})
Departments.sync()