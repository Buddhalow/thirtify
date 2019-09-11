(function() {

  var module = angular.module('PlayerApp');

  module.controller('BrowseController', function($scope, API, Auth, $routeParams, Thirtify) {

    function pad(number) {
      if ( number < 10 ) {
        return '0' + number;
      }
      return number;
    }
    $scope.data = {
      name: 'Browse',
      announcement: {
        "collaborative": false,
        "description": "This is Dr. Sounds. The essential tracks, all in one playlist.",
        "external_urls": {
          "spotify": "https://open.spotify.com/playlist/37i9dQZF1DZ06evO1xiBmH"
        },
        "followers": {
          "href": null,
          "total": 89
        },
        "href": "https://api.spotify.com/v1/playlists/37i9dQZF1DZ06evO1xiBmH",
        "id": "37i9dQZF1DZ06evO1xiBmH",
        "images": [{
          "height": null,
          "url": "https://thisis-images.scdn.co/37i9dQZF1DZ06evO1xiBmH-default.jpg",
          "width": null
        }],
        "name": "This Is Dr. Sounds",
        "owner": {
          "display_name": "Spotify",
          "external_urls": {
            "spotify": "https://open.spotify.com/user/spotify"
          },
          "href": "https://api.spotify.com/v1/users/spotify",
          "id": "spotify",
          "type": "user",
          "uri": "spotify:user:spotify"
        },
        "type": "playlist",
        "primary_color": null,
        "public": false,
        "snapshot_id": "MjYwOTEzNTcsMDAwMDAwMDAzMGUyNzVjMDQxMWQ0MDEzY2E1Zjc2ZDdhYmU5Mzc3NA=="
      }
    }

    /**
     * Returns an ISO string containing the local time for the user,
     * clearing minutes and seconds to improve caching
     * @param  Date date The date to format
     * @return string The formatted date
     */
    function isoString(date) {
      return date.getUTCFullYear() +
        '-' + pad( date.getUTCMonth() + 1 ) +
        '-' + pad( date.getUTCDate() ) +
        'T' + pad( date.getHours() ) +
        ':' + pad( 0 ) +
        ':' + pad( 0 )
    }

    API.getFeaturedPlaylists(Auth.getUserCountry(), isoString(new Date())).then(function(results) {
      $scope.featuredPlaylists = results.playlists.items;
      $scope.message = results.message;
    });

    API.getNewReleases(Auth.getUserCountry()).then(function(results) {
      // @todo: description, follower count
      $scope.newReleases = results.albums.items;
    });

    Thirtify.getCurators().then(function (result) {
      $scope.curators = result.curators.items;
    })

    API.getBrowseCategories().then(function(results) {
      $scope.genresMoods = results.categories.items;
      $scope.genresMoods = $scope.genresMoods.map(g => ({
        ...g,
        type: 'category'
      }));
    });
  });

})();
