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
};
