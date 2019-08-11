(function() {
	Parse.initialize("jg3ppjH3gNLZL1yqHNxyccDVADr8djiVkhC3gQFk", "19c6eH5SBHmNpElJmjLJH1BePAiwZmRa09zhVKnQ"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
	Parse.serverURL = "https://parseapi.back4app.com/";

	var Channel = Parse.Object.extend('Channel')
	var Change = Parse.Object.extend('Change')
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
			getChannelByIdentifier: function (identifier) {
				return new Promise(function (resolve, reject) {
					new Parse.Query('Channel').equalTo('identifier', identifier).first().then(function (channel) {
						resolve({
							id: channel.get('slug'),
							name: channel.get('name'),
							type: channel.get('type'),
							description: channel.get('description'),
							images: channel.get('images'),
							user: {
								id: '',
								name: '',
								type: 'user'
							},
							description: channel.get('description')
						})
					}, function (error) { reject(error)})
				})
			},
			getObjectsInChannel: function (identifier, time) {
				if (!time) time = new Date()
				var now = new Date()
				return new Promise(function (resolve, reject) {
					var query = new Parse.Query('Change')
					query.equalTo('channelId', identifier)
					query.find().then(
						function (changes) {
							var objects = []
							for (var i = 0; i < changes.length; i++) {
								var change = changes[i]
								var time = change.get('time')
								if (time.getTime() < now.getTime()) {
									switch (change.get('type')) {
										case 'insert': {
											objects.splice(change.get('position'), 0, {
												position: change.get('position'),
												time: change.get('time'),
												object: change.get('object')
											})
											break
										}
										case 'remove': {
											objects.splice(change.get('position'), 1)
											break
										}
									}
								}
							}
							resolve({
								objects: objects
							})
						},
						function (err) {
							debugger
							reject(err)
						}
					)					
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