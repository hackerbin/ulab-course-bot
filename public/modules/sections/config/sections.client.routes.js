'use strict';

//Setting up route
angular.module('sections').config(['$stateProvider',
	function($stateProvider) {
		// Sections state routing
		$stateProvider.
		state('listSections', {
			url: '/sections',
			templateUrl: 'modules/sections/views/list-sections.client.view.html'
		}).
		state('createSection', {
			url: '/sections/create',
			templateUrl: 'modules/sections/views/create-section.client.view.html'
		}).
		state('viewSection', {
			url: '/sections/:sectionId',
			templateUrl: 'modules/sections/views/view-section.client.view.html'
		}).
		state('editSection', {
			url: '/sections/:sectionId/edit',
			templateUrl: 'modules/sections/views/edit-section.client.view.html'
		});
	}
]);