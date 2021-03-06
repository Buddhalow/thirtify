(function() {

    var module = angular.module('PlayerApp');

    module.directive('trackAnnouncement', function() {
        return {
            restrict: 'E',
            scope: {
                data: '=ngModel',
            },
            templateUrl: '/partials/track_announcement.html'
        };
    });
})();
