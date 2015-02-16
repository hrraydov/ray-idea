'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.alerts = [
			{
				value: 1000,
				color: 'btn-success',
				description: 'Projects',
				icon: 'glyphicon glyphicon-folder-close'
			},
			{
				value: 251,
				color: 'btn-info',
				description: 'Users',
				icon: 'glyphicon glyphicon-user'
			},
			{
				value: 1000,
				color: 'btn-primary',
				description: 'Skills',
				icon: 'glyphicon glyphicon-book'
			},
			{
				value: 1000,
				color: 'btn-warning',
				description: 'Projects',
				icon: 'glyphicon glyphicon-folder-close'
			},
			{
				value: 1000,
				color: 'btn-danger',
				description: 'Projects',
				icon: 'glyphicon glyphicon-folder-close'
			},
			{
				value: 1000,
				color: 'btn-success',
				description: 'Projects',
				icon: 'glyphicon glyphicon-folder-close'
			}
		];
	}
]);