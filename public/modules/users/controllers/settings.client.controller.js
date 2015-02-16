'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'FileUploader', 'Authentication',
	function($scope, $http, $location, Users, FileUploader, Authentication) {
		$scope.user = Authentication.user;

		//tabs
		$scope.active = 'main';
		$scope.activate = function(value){
			$scope.active = value;
		};

		$scope.addEducation = function(){
			$scope.user.education.push($scope.newEducation);
			$scope.newEducation = {};
		};

		$scope.removeEducation = function(education){
			$scope.user.education.splice($scope.user.education.indexOf(education), 1);
		};

		$scope.addExperience = function(){
			$scope.user.experience.push($scope.newExperience);
			$scope.newExperience = {};
		};

		$scope.removeExperience = function(experience){
			$scope.user.experience.splice($scope.user.experience.indexOf(experience), 1);
		};


		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.uploader = new FileUploader({
			url: '/users/avatar'
		});

		$scope.uploadAvatar = function(){
			$scope.uploader.uploadAll();
		};
	}
]);