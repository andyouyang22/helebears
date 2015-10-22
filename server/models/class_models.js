/**
 * Created by nirshtern on 10/21/15.
 */

/**
 * Abstract model class to use a basic structure for other model classes.
 * @type {{dataValidation: Function, preprocess: Function, postprocess: Function, controller: Function}}
 */
function classModel() {

}

classModel.prototype.dataValidator = function(){
    throw new Error("Abstract method!");
};
classModel.prototype.preprocess = function(){
    throw new Error("Abstract method!");
};
classModel.prototype.postprocess = function(){
    throw new Error("Abstract method!");
};
classModel.prototype.controller = function(){
        throw new Error("Abstract method!");
    }

module.exports = classModel;



