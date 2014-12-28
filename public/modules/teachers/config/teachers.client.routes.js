'use strict';

//Setting up route
angular.module('teachers').config(['$stateProvider',
	function($stateProvider) {
		// Teachers state routing
		$stateProvider.
		state('listTeachers', {
			url: '/teachers',
			templateUrl: 'modules/teachers/views/list-teachers.client.view.html'
		}).
		state('createTeacher', {
			url: '/teachers/create',
			templateUrl: 'modules/teachers/views/create-teacher.client.view.html'
		}).
		state('viewTeacher', {
			url: '/teachers/:teacherId',
			templateUrl: 'modules/teachers/views/view-teacher.client.view.html'
		}).
		state('editTeacher', {
			url: '/teachers/:teacherId/edit',
			templateUrl: 'modules/teachers/views/edit-teacher.client.view.html'
		});
	}
]);