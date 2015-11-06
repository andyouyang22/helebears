/**
 * Created by alexkhodaverdian on 11/5/15.
 */

var assert = require('assert');
var schedules_model = require("../../models/schedule_model")
var scheduleModel = schedules_model.scheduleModel

var Schedule = schedules_model.Schedules

describe('============== Schedule ==============', function() {
    it('Queried Schedule Model Successfully with findAll()', function (done) {
        Schedule.findAll().then(function(departments){
            assert(true)

            done()

        }).error(function(err){
            assert(false)
            done()
        })
    })
    it('Queried Schedule Model Successfully with findOne()', function (done) {
        Schedule.findOne().then(function(departments){
            assert(true)

            done()

        }).error(function(err){
            assert(false)
            done()
        })
    })
    it('Attempt to create a schedule with an invalid key', function(done){
        Schedule.create({departmento:"PleaseError"}).then(function(result){
            throw "Courses did not properly error out"
            done()
        }).error(function(err){
            done()
        })
    })
    it('Test searchQuery()', function(done){
        res = {}
        res.json = function(v){}
        scheduleModel.searchQuery("",res)
        done()
    })
    it('Test createQuery()', function(done){
        res = {}
        res.json = function(v){}
        scheduleModel.createQuery({},res)
        done()
    })
    it('Test removeQuery()', function(done){
        res = {}
        res.json = function(v){}
        scheduleModel.removeQuery({"unique_id": ""},res)
        done()
    })
})