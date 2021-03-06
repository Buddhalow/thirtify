(function() {

    var module = angular.module('PlayerApp');

    module.controller('ArtistController', function($scope, $rootScope, API, PlayQueue, $routeParams, Auth) {
        $scope.creator = $routeParams.creator;

        $scope.currenttrack = PlayQueue.getCurrent();
        $scope.isFollowing = false;
        $scope.isFollowHovered = false;
        $rootScope.$on('playqueuechanged', function() {
            $scope.currenttrack = PlayQueue.getCurrent();
        });
        let totalNumImages = $('img').length

        $scope.release = null;
        Promise.all([
            API.getCreator($scope.creator),
            API.getCreatorArtists($scope.creator, Auth.getUserCountry()),

        ]).then(
            function(results) {
                let [creator, artists, toptracks, shows, creators, albums, booleans] = results
                console.log('got creator', creator);
                $scope.data = creator;
                let img = document.createElement('img');
                img.crossOrigin = "Anonymous";
                img.src = $scope.data.images && $scope.data.images.length > 0 ? $scope.data.images[0].url : ''

                img.addEventListener('load', function() {
                    var vibrant = new Vibrant(img);

                    var swatches = vibrant.swatches()
                    let i = 0;
                    for (var swatch in swatches) {
                        if (i == 1) {
                            if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
                                let hex = swatches[swatch].getHex()
                                console.log(swatch, hex)
                                // document.documentElement.style.setProperty('--vibrant-color', hex + '88')
                                break;
                            }
                        }
                        i++
                    }
                });
                if (shows)
                    $scope.shows = shows.shows.items.filter((obj) => {
                        return obj.publisher.indexOf($scope.creator.name) !== -1
                    })
                console.log('got creator', toptracks);
                $scope.toptracks = toptracks.tracks;
                $scope.shows = shows.shows.items.filter((obj) => {
                    return obj.publisher.indexOf($scope.creator.name) !== -1
                })
                console.log('got creator albums', albums);
                $scope.albums = [];
                $scope.singles = [];
                $scope.appearson = [];
                $scope.artists = creators.artists.slice(0, 8);

                albums.items.forEach(function(album) {
                    console.log(album);
                    if (album.album_type == 'album') {
                        $scope.albums.push(album);
                    }
                    if (album.album_type == 'single') {
                        $scope.singles.push(album);
                    }
                    if (album.album_type == 'appears-on') {
                        $scope.appearson.push(album);
                    }
                })
                let lastAlbum = $scope.albums[0];
                let lastSingle = $scope.singles[0];
                if (lastAlbum instanceof Object) {
                    if (lastSingle instanceof Object && new Date(lastSingle.release_date).getTime() < new Date(lastSingle.release_date).getTime()) {
                        $scope.release = lastSingle
                    } else {

                        $scope.release = lastAlbum
                    }
                }
                if (lastSingle instanceof Object) {
                    if (lastAlbum instanceof Object && new Date(lastAlbum.release_date).getTime() < new Date(lastAlbum.release_date).getTime()) {
                        $scope.release = lastAlbum
                    } else {

                        $scope.release = lastSingle
                    }
                }

                console.log("Got following status for creator: " + booleans[0]);
                $scope.isFollowing = booleans[0];
                $scope.loaded = true;
            }
        );

        $scope.playtoptrack = function(trackuri) {
            var trackuris = $scope.toptracks.map(function(track) {
                return track.uri;
            });
            PlayQueue.clear();
            PlayQueue.enqueueList(trackuris);
            PlayQueue.playFrom(trackuris.indexOf(trackuri));
        };

        $scope.playall = function(trackuri) {
            var trackuris = $scope.toptracks.map(function(track) {
                return track.uri;
            });
            PlayQueue.clear();
            PlayQueue.enqueueList(trackuris);
            PlayQueue.playFrom(0);
        };

        $scope.follow = function(isFollowing) {
            if (isFollowing) {
                API.unfollow($scope.creator, "creator").then(function() {
                    $scope.isFollowing = false;
                    $scope.data.followers.total--;
                });
            } else {
                API.follow($scope.creator, "creator").then(function() {
                    $scope.isFollowing = true;
                    $scope.data.followers.total++;
                });
            }
        };

        $scope.toggleFromYourMusic = function(index) {
            if ($scope.toptracks[index].inYourMusic) {
                API.removeFromMyTracks([$scope.toptracks[index].id]).then(function(response) {
                    $scope.toptracks[index].inYourMusic = false;
                });
            } else {
                API.addToMyTracks([$scope.toptracks[index].id]).then(function(response) {
                    $scope.toptracks[index].inYourMusic = true;
                });
            }
        };

    });

})();
