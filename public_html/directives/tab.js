(function() {
	var module = angular.module('PlayerApp');
	module.directive('tabbarTab', function($location) {
		return {
			restrict: 'E',
			scope: {
				section: '=section',
				label: '@'
			},
			templateUrl: '/partials/tab.html'
		};
	});
})();
