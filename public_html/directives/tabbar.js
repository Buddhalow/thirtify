(function() {
    var module = angular.module('PlayerApp');

    module.directive('tabBar', ['$location', '$rootScope', function($location, $rootScope) {
        return {
            restrict: 'E',

            compile: function (element, attributes) {
                //linkFunction is linked with each element with scope to get the element specific data.
                var linkFunction = function($scope, element, attributes) {

                    $rootScope.$on('scroll', function () {
                        /*if ($rootScope.scrollY > 200 ? $rootScope.scrollY - 200 : 0) {
                            element.addClass('sticky-tabbar');
                            element.css({
                                transform: 'translate(0px, ' + ($rootScope.scrollY - 200) + 'px)'
                            });

                        } else {
                            element.removeClass('sticky-tabbar');
                            element.css({
                                transform: 'translate(0pt, 0px)'
                            });
                        }*/
                    })
                }
                return linkFunction;

            }
          };
    }]);
})();
