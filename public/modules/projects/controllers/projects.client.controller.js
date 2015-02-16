'use strict';

// Projects controller
angular.module('projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', '$http', 'FileUploader', 'Authentication', 'Projects',
	function($scope, $stateParams, $location, $http, FileUploader, Authentication, Projects) {
		$scope.authentication = Authentication;

		$scope.projects = [];
		$scope.project = {};
		$scope.newProject = {};
		$scope.activePosition = null;
		$scope.newRequiredSkill = {};
		$scope.newPlusSkill = {};
		$scope.newImage = null;
		$scope.uploader = new FileUploader();
		$scope.uploader.onCompleteAll = function(){
			loadProject();
		};

		var loadProjects = function(){
			$http.get('/projects/user/'+Authentication.user.username).success(function(projects){
				$scope.projects = projects;
			});
		};

		var loadProject = function(){
			$http.get('/projects/' + $stateParams.urlName)
			.success(function(data){
				$scope.project = data.project;
				$scope.isOwner = data.isOwner;
				$scope.isMember = data.isMember;
				$scope.uploader.url = '/projects/' + $scope.project._id + '/image';
			});
		};

		$scope.showBecomeMemberBtn = function(){
			return Authentication.user && !$scope.isMember && !$scope.isOwner; 
		};

		// Create new Project
		$scope.create = function() {
			// Create new Project object
			$http.post('/projects', $scope.newProject)
			.success(function(data){
				$scope.newProject = {};
				loadProjects();
			})
			.error(function(data){
				$scope.error = data.message;
			});
		};

		// Remove existing Project
		$scope.remove = function(project) {
			$http.delete('/projects/' + project._id)
			.success(function(){
				loadProjects();
			});
		};

		// Update existing Project
		$scope.update = function() {
			var project = $scope.project;

			$http.put('/projects/' + project._id, $scope.project)
			.success(function(data){
				loadProject();
			});
		};

		$scope.loadProject = loadProject;
		$scope.loadProjects = loadProjects;

		$scope.becomeMember = function() {
			var project = $scope.project;

			$http.put('/projects/' + project._id + '/become-member')
			.success(function(data){
				loadProject();
			});
		};

		$scope.cancelCandidature = function(project) {
			$http.put('/projects/' + project._id + '/cancel-candidature')
			.success(function(data){
				loadProjects();
			});
		};

		$scope.acceptCandidature = function(candidate) {
			var project = $scope.project;

			$http.put('/projects/' + project._id + '/accept-candidature/' + candidate._id)
			.success(function(data){
				loadProject();
			});
		};

		$scope.declineCandidature = function(candidate) {
			var project = $scope.project;

			$http.put('/projects/' + project._id + '/decline-candidature/' + candidate._id)
			.success(function(data){
				loadProject();
			});
		};

		$scope.removeMember = function(member) {
			var project = $scope.project;

			$http.put('/projects/' + project._id + '/remove-member/' + member._id)
			.success(function(data){
				loadProject();
			});
		};

		$scope.addEmptyPosition = function(){
			$http.post('/projects/'+ $scope.project._id + '/position', {name: 'Position'})
			.success(function(data){
				loadProject();
				$scope.activePosition = data;
			});
		};

		$scope.updatePosition = function(){
			$http.put('/projects/' + $scope.project._id + '/position/' + $scope.activePosition._id, $scope.activePosition)
			.success(function(data){
				loadProject();
			});
		};

		$scope.selectPosition = function(position){
			$scope.activePosition = angular.copy(position);
			$http.get('/position/' + $scope.activePosition._id + '/good-users')
			.success(function(data){
				$scope.goodUsers = data;
			});
		};

		$scope.addRequiredSkill = function(){
			$http.put('/projects/'+ $scope.project._id +'/position/' + $scope.activePosition._id + '/add-required', $scope.newRequiredSkill)
			.success(function(data){
				$scope.newRequiredSkill = {};
				$scope.activePosition = data;
				loadProject();
			});
		};

		$scope.addPlusSkill = function(){
			$http.put('/projects/'+ $scope.project._id +'/position/' + $scope.activePosition._id + '/add-plus', $scope.newPlusSkill)
			.success(function(data){
				$scope.newPlusSkill = {};
				$scope.activePosition = data;
				loadProject();
			});
		};

		$scope.removeRequiredSkill = function(skill){
			$http.put('/projects/'+ $scope.project._id +'/position/' + $scope.activePosition._id + '/remove-required', skill)
			.success(function(data){
				$scope.activePosition = data;
				loadProject();
			});
		};

		$scope.removePlusSkill = function(skill){
			$http.put('/projects/'+ $scope.project._id +'/position/' + $scope.activePosition._id + '/remove-plus', skill)
			.success(function(data){
				$scope.activePosition = data;
				loadProject();
			});
		};

		$scope.uploadImage = function(){
			$scope.uploader.uploadAll();
		};

		$scope.removeImage = function(image){
			$http.delete('/projects/' + $scope.project._id + '/image/' + image._id)
			.success(function(data){
				loadProject();
			});
		};
	}
]);