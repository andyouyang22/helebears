var databaseManager = {
	queryModel : function(model, filter) {
        try {
        	model.findAll({where: filter}).then(
                function(departments){
                    for(var i = 0; i < departments.length; i++){
                        console.log(departments[i].dataValues)
                    }
                    
                }).error(function(err) {
                    console.log("Found an error")
                })
        	return wait
        }
        catch(ex){
        	return {status: -1, error: ["Error Querying Model: " + ex]}
        }
    },
	writeModel : function(model, data) {
        
    }
}

var professors_model = require("./professors_model")

var Professors = professors_model.Professors;

databaseManager.queryModel(Professors, {})