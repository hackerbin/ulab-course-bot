'use strict';

//Sections service used to communicate Sections REST endpoints
angular.module('sections').factory('Sections', ['$resource',
	function($resource) {
		return $resource('sections/:sectionId', { sectionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);