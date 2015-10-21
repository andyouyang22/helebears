var Sequelize = require('sequelize');

var con_string = process.env.DATABASE_URL || 'postgres://postgres:123@localhost:5432/postgres'
var sequelize = new Sequelize(con_string);
sequelize.sync()

var Departments = sequelize.define('Departments', {
  department_name: { type: Sequelize.STRING, primaryKey: true}
})

var Professors = sequelize.define('Professors', {
  professor_name: { type: Sequelize.STRING, primaryKey: true}
})


var Courses = sequelize.define('Courses', {
  name: { type: Sequelize.STRING, primaryKey: true},
  number: { type: Sequelize.INTEGER, primaryKey: true},

  type:  Sequelize.STRING,
  title: Sequelize.STRING,
  ccn: Sequelize.INTEGER,
  units: Sequelize.DOUBLE,
  time: Sequelize.STRING,
  location: Sequelize.STRING,
  final_slot: Sequelize.INTEGER,
  limit: Sequelize.INTEGER,
  enrolled: Sequelize.INTEGER,
  waitlist: Sequelize.INTEGER,
  note: Sequelize.STRING

})

var Users = sequelize.define("Users", {
  name: { type: Sequelize.STRING, primaryKey: true},
  password: Sequelize.STRING

})
var Reviews = sequelize.define("Reviews", {
  rating_1: Sequelize.INTEGER,
  rating_2: Sequelize.INTEGER,
  rating_3: Sequelize.INTEGER,
  review: Sequelize.STRING

})
var Schedules = sequelize.define("Schedules", {
  unique_id: Sequelize.STRING

})
var Sections = sequelize.define("Sections", {
  discussion: {type: Sequelize.STRING, primaryKey: true},
  type: {type: Sequelize.STRING, primaryKey: true},
  instructor: Sequelize.STRING,
  ccn: Sequelize.INTEGER,
  time: Sequelize.STRING,
  location: Sequelize.STRING,
  limit: Sequelize.INTEGER,
  enrolled: Sequelize.INTEGER,
  waitlist: Sequelize.INTEGER

})

Courses.sync()
Departments.sync()
Professors.sync()
Reviews.sync()
Users.sync()
Schedules.sync()
Sections.sync()
