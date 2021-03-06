(function() {

    var module = angular.module('PlayerApp');

    module.directive('spEntry', function() {
        return {
            restrict: 'E',
            scope: {
                data: '=ngModel',
                isRound: '=round'
            },
            templateUrl: '/partials/entry.html'
        };
    });
})();
