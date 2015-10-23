var Sequelize = require('sequelize');


var con_string = process.env.DATABASE_URL || 'postgres://postgres:123@localhost:5432/hb'

var sequelize = new Sequelize(con_string);
sequelize.sync()

var Departments = sequelize.define('Departments', {
  department_name: { type: Sequelize.STRING, primaryKey: true}
})

var Professors = sequelize.define('Professors', {
  professor_name: { type: Sequelize.STRING, primaryKey: true}
})


var Courses = sequelize.define('Courses', {
  name: { type: Sequelize.STRING},
  number: { type: Sequelize.INTEGER},
  name_and_number: {type:Sequelize.STRING, primaryKey: true},
  professor_name: {
    type: Sequelize.STRING,
    primaryKey: true,
    references: {
      model: Professors,
      key: 'professor_name',
   }
  },
  department_name: {
    type: Sequelize.STRING,
    primaryKey: true,
    references: {
      model: Departments,
      key: 'department_name',
   }
  },
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
  review: Sequelize.STRING,
  professor_name: {
    type: Sequelize.STRING,
    references: {
      model: Professors,
      key: 'professor_name',
   }
  },
})
var Schedules = sequelize.define("Schedules", {
  unique_id: {type: Sequelize.STRING, primaryKey: true},
  name_and_number: {
    type: Sequelize.STRING,
    references: {
      model: Courses,
      key: 'name_and_number',
   }
  }
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
  waitlist: Sequelize.INTEGER,
  name_and_number: {
    type: Sequelize.STRING,
    references: {
      model: Courses,
      key: 'name_and_number',
   }
  }
})

Courses.sync()
Departments.sync()
Professors.sync()
Reviews.sync()
Users.sync()
Schedules.sync()
Sections.sync()