'use strict';

//Assigncourses service used to communicate Assigncourses REST endpoints
angular.module('assigncourses').factory('Assigncourses', ['$resource',
	function($resource) {
		return $resource('assigncourses/:assigncourseId', { assigncourseId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);