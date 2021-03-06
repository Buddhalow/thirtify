(function() {

	var module = angular.module('PlayerApp');

	module.controller('ChannelsController', function($scope, I18n, API, $location, PlayQueue, $routeParams) {
		$scope.query = $location.search().q || '';
		$scope.type = $location.search().type || null;
		$scope.tracks = [];
		$scope.data = {
			type: I18n.t('channels'),
			name: I18n.t('channels')
		}
		API.getChannels($scope.query).then(function(results) {
			console.log('got search results', results);
		
		});

		$scope.play = function(trackuri) {
			var trackuris = $scope.tracks.map(function(track) {
				return track.uri;
			});
			PlayQueue.clear();
			PlayQueue.enqueueList(trackuris);
			PlayQueue.playFrom(trackuris.indexOf(trackuri));
		};

		$scope.toggleFromYourMusic = function(index) {
			if ($scope.tracks[index].inYourMusic) {
				API.removeFromMyTracks([$scope.tracks[index].id]).then(function(response) {
					$scope.tracks[index].inYourMusic = false;
				});
			} else {
				API.addToMyTracks([$scope.tracks[index].id]).then(function(response) {
					$scope.tracks[index].inYourMusic = true;
				});
			}
		};
	});

})();
