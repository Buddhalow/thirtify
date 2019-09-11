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
