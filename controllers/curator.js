(function() {

    var module = angular.module('PlayerApp');

    module.controller('CuratorController', function($scope, $routeParams, API, Thirtify) {
        $scope.profileUsername = $routeParams.username;
        $scope.data = null;
        $scope.playlistError = null;
        $scope.isFollowing = false;
        $scope.isFollowHovered = false;
        Promise.all([
            Thirtify.getCuratorByIdentifier($scope.profileUsername),
            API.getUser($scope.profileUsername),
            API.getPlaylists($scope.profileUsername),
            API.isFollowing($scope.profileUsername, "user"),
        ]).then(function ([curator, user, userPlaylists, booleans, articles]) {
                if (!curator) {
                    curator = user;
                }
                console.log('got user', user);
                $scope.data = user;
                user.name = user.display_name;
                user.type = 'curator';
                user = {
                    ...user,
                    ...curator
                };
                $scope.data = user;
                $scope.userplaylists = userPlaylists;
                console.log('got user playlists', userPlaylists);
                let playlists = userPlaylists.slice(0, 28);
                console.log("Got following status for user: " + booleans[0]);
                $scope.isFollowing = booleans[0];
                $scope.$apply();
                console.log("TF");
                let img = document.createElement('img')
                img.crossOrigin = "Anonymous";
                img.src = $scope.data.images && $scope.data.images.length > 0 ? $scope.data.images[0].url : ''
                img.addEventListener('load', function() {
                    var vibrant = new Vibrant(img);

                    var swatches = vibrant.swatches()
                    let i = 0;

                    for (let swatch in swatches) {
                        if (i == 1) {
                            if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
                                let hex = swatches[swatch].getHex()
                                console.log(swatch, hex)
                                document.documentElement.style.setProperty('--vibrant-color', hex + '55')
                                console.log(hex)

                                break;
                            }
                        }
                        i++
                    }
                });
        }).catch(function (reasons) {
            console.log("got error", reasons);
            $scope.playlistError = true;
        });

        $scope.follow = function(isFollowing) {
            if (isFollowing) {
                API.unfollow($scope.profileUsername, "user").then(function() {
                    $scope.isFollowing = false;
                    $scope.data.followers.total--;
                });
            } else {
                API.follow($scope.profileUsername, "user").then(function() {
                    $scope.isFollowing = true;
                    $scope.data.followers.total++;
                });
            }
        };

    });

})();
