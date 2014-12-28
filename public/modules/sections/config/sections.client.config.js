'use strict';

// Configuring the Articles module
angular.module('sections').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Sections', 'sections', 'dropdown', '/sections(/create)?');
		Menus.addSubMenuItem('topbar', 'sections', 'List Sections', 'sections');
		Menus.addSubMenuItem('topbar', 'sections', 'New Section', 'sections/create');
	}
]);