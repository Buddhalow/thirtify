(function() {

    var module = angular.module('PlayerApp');

    module.directive('spItem', function() {
        return {
            restrict: 'E',
            scope: {
                data: '=ngModel',
                isRound: '=round'
            },
            templateUrl: '/partials/item.html'
        };
    });
})();
