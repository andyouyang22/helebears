var databaseManager = {
	queryModel : function(model, filter) {
        try {
        	var wait = model.findAll({where: filter})
        	return wait
        }
        catch(ex){
        	return {status: -1, error: ["Error Querying Model: " + ex]}
        }
    },
	writeModel : function(model, data) {
        
    }
}