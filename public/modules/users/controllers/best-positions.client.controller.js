'use strict';

angular.module('users').controller('BestPositionsController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {

		if(!Authentication.user){
			$location.path('/');
		}

		$scope.positions = [];

		$scope.loadPositions = function(){
			$http.get('/users/' + Authentication.user._id + '/best-positions')
			.success(function(data){
				$scope.positions = data;
			});
		};
	}
]);