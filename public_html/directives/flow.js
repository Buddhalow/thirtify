(function() {

    var module = angular.module('PlayerApp');

    module.directive('spFlow', function() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
            },
            templateUrl: '/partials/flow.html'
        };
    });
})();
