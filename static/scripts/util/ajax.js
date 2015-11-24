var apiUrl = 'http://protected-refuge-7067.herokuapp.com';

module.exports = {
	get: function(url, onSuccess, onFailure) {
		$.ajax({
			type: 'GET',
			url: apiUrl + url,
			dataType: "json",
			success: onSuccess,
			error: onFailure
		});
	},
	make: function(url, data, onSuccess, onFailure) {
		$.ajax({
			type: 'POST',
			url: apiUrl + url,
			data: JSON.stringify(data),
			contentType: "application/json",
			dataType: "json",
			success: onSuccess,
			error: onFailure
		});
	},

	/**
	 * Make a GET request for the user's courses.
	 * @param {function} callback: Takes in an array of courses and performs an
	 *   action upon it.
	 */
	getCourses: function(callback) {
		var onSuccess = function(data) {
			if (data.status == -1) {
				console.log("Failed to load user's schedule; status = -1");
				console.log("Errors: " + data.errors);
				return
			}
			var courses = parse.courses(data);
			callback(courses);
		};
		var onFailure = function() {
			console.log("Failed to load user's schedule");
		};
		this.get('/api/schedules', onSuccess, onFailure);
	},

	/**
	 * Make a GET request for search results.
	 * @param {function} callback: Takes in an array of results and performs an
	 *   action upon it.
	 */
	getResults: function(callback) {
		return
	}
};
