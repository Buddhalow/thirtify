(function() {

    var module = angular.module('PlayerApp');
    var isSearching = false;

    module.controller('SearchController', function ($scope, $location, API, Auth, $routeParams, Thirtify) {
        $scope.loadsearch = function () {

            console.log('search for', $scope.query);
            if ($scope.query.indexOf('#') === 0) {
                $scope.query = 'spotify:hashtag:' + $scope.query.substr(1)
            }
            if ($scope.query.indexOf('spotify:') == 0) {
                let path = '/' + $scope.query.substr('spotify:'.length).replace(/\:/, '/')
                console.log(path)
                $location.path(path)
            } else {
                console.log($scope.query);
                $location.path('/search').search({q: $scope.query}).replace();
            }

        };
    });

})();
