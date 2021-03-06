(function() {

	var module = angular.module('PlayerApp');

	module.controller('ChannelController', function($scope, I18n, $rootScope, Thirtify, API, PlayQueue, $routeParams, Auth, $sce) {
		$scope.identifier = $routeParams.identifier
		Thirtify.getChannelByIdentifier($scope.identifier).then(function (channel) {
			$scope.data = channel
			Thirtify.getObjectsInChannel($scope.identifier).then(function (result) {
				$scope.objects = result.objects.map(function (obj) {
					if (obj.show) {
						obj.authors = [obj.show]
					}
					return obj
				})
					$rootScope.$emit('playlistsubscriptionchange');
			})
		})

		$scope.follow = function(isFollowing) {
			if (isFollowing) {
				let promise = $scope.username ? API.unfollowPlaylist($scope.username, $scope.playlist) : API.unfollowPlaylistById($scope.playlist)
				promise.then(function() {
					$scope.isFollowing = false;
					$rootScope.$emit('playlistsubscriptionchange');
				});
			} else {
				let promise = $scope.username ? API.followPlaylist($scope.username, $scope.playlist) : API.followPlaylistById($scope.playlist)
				promise.then(function () {
					$scope.isFollowing = true;
					$rootScope.$emit('playlistsubscriptionchange');
				});
			}
		};
		$scope.play = function(trackuri) {
			var trackuris = $scope.objects.map(function(object) {
				return object.object.uri;
			});
			PlayQueue.clear();
			PlayQueue.enqueueList(trackuris);
			PlayQueue.playFrom(trackuris.indexOf(trackuri));
			debugger
		};

		$scope.playall = function() {
			var trackuris = $scope.tracks.map(function(track) {
				return track.track.uri;
			});
			PlayQueue.clear();
			PlayQueue.enqueueList(trackuris);
			PlayQueue.playFrom(0);
		};

		$scope.toggleFromYourMusic = function(index) {
			if ($scope.tracks[index].track.inYourMusic) {
				API.removeFromMyTracks([$scope.tracks[index].track.id]).then(function(response) {
					$scope.tracks[index].track.inYourMusic = false;
				});
			} else {
				API.addToMyTracks([$scope.tracks[index].track.id]).then(function(response) {
					$scope.tracks[index].track.inYourMusic = true;
				});
			}
		};

		$scope.menuOptionsPlaylistTrack = function() {
			var menuItems = [
				[
					I18n.t('play'),
					function ($itemScope) {

					}
				],
				[
					I18n.t('copy'),
					function ($itemScope) {

					}
				]

			]
			if ($scope.username === Auth.getUsername()) {
				menuItems.push([
					'Delete',
					function ($itemScope) {
						var position = $itemScope.$index;
						let promise = 	API.removeObjectFromChannel(
							$scope.identifier,
							$itemScope.t.track, 
							position
						)

						promise.then(function() {
							$scope.tracks.splice(position, 1);
						});
					}])
			}
			return menuItems
		};

	});

})();
