(function() {

	var module = angular.module('PlayerApp');
	
	/**
	 * @from https://gist.github.com/gordonbrander/2230317
	 **/
	function generateId() {
		 // Math.random should be unique because of its seeding algorithm.
		  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
		  // after the decimal.
		return Math.random().toString(36).substr(2, 23);
		
	}
	module.factory('Thirtify', function(Auth, $q, $http) {
		return {
			getCuratorByIdentifier: function (identifier) {
				return new Promise((resolve, reject) => {
						fetch('/api/curators/' + identifier + "/view.json").then(r => r.json()).then(result => {
							console.log("RESULT", result);
						resolve(result);
					}).catch(err => reject(err));
				})
			},
			getArticlesByCurator: function (identifier) {
				return new Promise((resolve, reject) => {
					fetch('/api/curators/' + identifier + '/articles.json').then(r => r.json()).then(result => {
						console.log("RESULT", result);
						resolve(result);
					}).catch(err => reject(err));
				})
			},
			getCurators: function (identifier) {
				return new Promise((resolve, reject) => {
					fetch('/api/curators/list.json').then(r => r.json()).then(result => {
						console.log("RESULT", result);
						resolve(result);
					}).catch(err => reject(err));
				})
			},
			getChannelByIdentifier: function (identifier) {
				return new Promise(function (resolve, reject) {
					 	resolve({

						})
				})
			},
			getObjectsInChannel: function (identifier, time) {
				if (!time) time = new Date()
				var now = new Date()
				return new Promise(function (resolve, reject) {

				})
			},
			createChannel: function (name, description) {
				return new Promise(function (resolve, reject) {
					var channel = new Channel()
					channel.set('identifier', generateId())
					channel.set('name', name)
					channel.set('description', description)
					channel.save(function (channel) {
						resolve(channel)
					}, function (err) {
						reject(err)
					})
				})
			},
			removeFromChannelAtPosition: function (position, channel_id) {
				return new Promise(function (resolve, reject) {
					var change = new Change()
					change.set('type', 'remove')
					change.set('position', position)
					change.save().then(function (result) {
						resolve({
							type: 'remove',
							position: 'position'
						})
					}, function () { reject('Error') })
				})
			},
			insertObjectIntoChannel: function (object, position, channel_id) {
				return new Promise(function (resolve, reject) {
					var change = new Change()
					change.set('type', 'insert')
					change.set('position', position)
					change.set('object', object)
					change.save().then(function (result) {
						resolve()
					}, function () { reject('Error') })
				})
			}
		}
	})
})()