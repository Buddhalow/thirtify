(function () {
    var app = angular.module('PlayerApp');

    app.directive('scroll', ['$rootScope', function ($rootScope) {
        return {
            link: function (scope, elem, attrs) {
                elem.on('scroll', function (e) {
                   $rootScope.scrollY = e.originalEvent.target.scrollTop;

                   $rootScope.$digest();
                   $rootScope.$broadcast(
                       'scroll'
                   )
                });
            }
        }
    }]);
})();
