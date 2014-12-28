'use strict';

// Configuring the Articles module
angular.module('assigncourses').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Assigncourses', 'assigncourses', 'dropdown', '/assigncourses(/create)?');
		Menus.addSubMenuItem('topbar', 'assigncourses', 'List Assigncourses', 'assigncourses');
		Menus.addSubMenuItem('topbar', 'assigncourses', 'New Assigncourse', 'assigncourses/create');
	}
]);