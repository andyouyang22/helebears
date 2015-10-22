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
    references: {
      model: Professors,
      key: 'professor_name',
   }
  },
  department_name: {
    type: Sequelize.STRING,
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
// var Schedules = sequelize.define("Schedules", {
//   unique_id: {type: Sequelize.STRING, primaryKey: true},
//   name: {
//     type: Sequelize.STRING,
//     references: {
//       model: Courses,
//       key: 'name',
//       deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
//    }
//   },
//   number: {
//     type: Sequelize.INTEGER,
//     references: {
//       model: Courses,
//       key: 'number',
//       deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
//    }
//   }
// })
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
//Schedules.drop()
//Schedules.sync()
//Sections.drop()
//Sections.drop()
//Sections.sync()
//var p = Professors.build({professor_name: "Kozai"})
//p.save()

//var d = Departments.build({department_name: "Math Science"})
//d.save()
//var c = Courses.build({name: "62C", number:11, name_and_number:"62C 11",professor_name:"Kozai", department_name:"Math Science", type: "LEC", title: "Datastructure", ccn: 5, units: 2.5, time: "MW", location: "WHEELER", final_slot: 5, limit: 10, enrolled: 5, waitlist: 0, note: ""})
//c.save()
//var r = Reviews.build({rating_1:5, rating_2:3, rating_3:5, review:"Terrible", professor_name: "Denero"})
//r.save()
//var c = Sections.build({discussion: "11.185", type: "5", name_and_number:"62C 11", instructor: "END", ccn: 5, time:"MW", location: "as", limit: 10, enrolled: 5, waitlist: 10})
//c.save()
// var s = Schedules.build({discussion: "99.123", name:"1233", number: 001})
// s.save()

Sections.findAll().then(function(courses){console.log(courses)})
