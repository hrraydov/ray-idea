'use strict';

angular.module('users').controller('UserShowController', ['$scope', '$http', '$stateParams',
	function($scope, $http, $stateParams) {
		var username = $stateParams.username;

		//holds the user to show
		$scope.user = {};
		$scope.active = 'personal';
		
		$scope.activate = function(value){
			$scope.active = value;
		};

		$http.get('/users/' + username).success(function(user){
			$scope.user = user;
		}).error(function(data){
			console.log(data);
		});
	}
]);