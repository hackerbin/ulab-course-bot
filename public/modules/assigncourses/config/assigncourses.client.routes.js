'use strict';

//Setting up route
angular.module('assigncourses').config(['$stateProvider',
	function($stateProvider) {
		// Assigncourses state routing
		$stateProvider.
		state('listAssigncourses', {
			url: '/assigncourses',
			templateUrl: 'modules/assigncourses/views/list-assigncourses.client.view.html'
		}).
		state('createAssigncourse', {
			url: '/assigncourses/create',
			templateUrl: 'modules/assigncourses/views/create-assigncourse.client.view.html'
		}).
		state('viewAssigncourse', {
			url: '/assigncourses/:assigncourseId',
			templateUrl: 'modules/assigncourses/views/view-assigncourse.client.view.html'
		}).
		state('editAssigncourse', {
			url: '/assigncourses/:assigncourseId/edit',
			templateUrl: 'modules/assigncourses/views/edit-assigncourse.client.view.html'
		});
	}
]);