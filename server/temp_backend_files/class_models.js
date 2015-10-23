/**
 * Created by nirshtern on 10/21/15.
 */

/**
 * Abstract model class to use a basic structure for other model classes.
 * @type {{dataValidation: Function, preprocess: Function, postprocess: Function, controller: Function}}
 */



function Class() {}
Class.prototype.construct = function() {};
Class.extend = function(def) {
    var classDef = function() {
        if (arguments[0] !== Class) { this.construct.apply(this, arguments); }
    };

    var proto = new this(Class);
    var superClass = this.prototype;

    for (var n in def) {
        var item = def[n];
        if (item instanceof Function) item.$ = superClass;
        proto[n] = item;
    }

    classDef.prototype = proto;

    //Give this new class the same static extend method
    classDef.extend = this.extend;
    return classDef;
};

var classModel = Class.extend({
    construct: function() { /* optional constructor method */ },

    getName: function() {
        return "BaseClass(" + this.getId() + ")";
    },

    getId: function() {
        return 1;
    },

    dataValidator: function(){

    },

    preprocess: function(){

    },

    postprocess: function(){

    }
});


module.exports.classModel = classModel;
module.exports.Class = Class;
module.exports = constants;



