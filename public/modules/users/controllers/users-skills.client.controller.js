'use strict';

angular.module('users').controller('UsersSkillsController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		var user = Authentication.user;
		console.log(user);
		if (!user) $location.path('/');

		var loadSkills = function(){
			$http.get('/users/' + user.username + '/skills').success(function(data){
				$scope.skills = data;
			});
		};

		$scope.skills = [];
		$scope.newSkill = {};

		loadSkills();		

		$scope.addSkill = function(){
			$http.put('/users/skills/add-skill', $scope.newSkill).success(function(data){
				$scope.newSkill = {};
				loadSkills();
			});
		};

		$scope.removeSkill = function(skill){
			$http.put('/users/skills/remove-skill', skill).success(function(data){
				loadSkills();
			});
		};


	}
]);