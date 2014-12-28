'use strict';

(function() {
	// Assigncourses Controller Spec
	describe('Assigncourses Controller Tests', function() {
		// Initialize global variables
		var AssigncoursesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Assigncourses controller.
			AssigncoursesController = $controller('AssigncoursesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Assigncourse object fetched from XHR', inject(function(Assigncourses) {
			// Create sample Assigncourse using the Assigncourses service
			var sampleAssigncourse = new Assigncourses({
				name: 'New Assigncourse'
			});

			// Create a sample Assigncourses array that includes the new Assigncourse
			var sampleAssigncourses = [sampleAssigncourse];

			// Set GET response
			$httpBackend.expectGET('assigncourses').respond(sampleAssigncourses);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.assigncourses).toEqualData(sampleAssigncourses);
		}));

		it('$scope.findOne() should create an array with one Assigncourse object fetched from XHR using a assigncourseId URL parameter', inject(function(Assigncourses) {
			// Define a sample Assigncourse object
			var sampleAssigncourse = new Assigncourses({
				name: 'New Assigncourse'
			});

			// Set the URL parameter
			$stateParams.assigncourseId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/assigncourses\/([0-9a-fA-F]{24})$/).respond(sampleAssigncourse);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.assigncourse).toEqualData(sampleAssigncourse);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Assigncourses) {
			// Create a sample Assigncourse object
			var sampleAssigncoursePostData = new Assigncourses({
				name: 'New Assigncourse'
			});

			// Create a sample Assigncourse response
			var sampleAssigncourseResponse = new Assigncourses({
				_id: '525cf20451979dea2c000001',
				name: 'New Assigncourse'
			});

			// Fixture mock form input values
			scope.name = 'New Assigncourse';

			// Set POST response
			$httpBackend.expectPOST('assigncourses', sampleAssigncoursePostData).respond(sampleAssigncourseResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Assigncourse was created
			expect($location.path()).toBe('/assigncourses/' + sampleAssigncourseResponse._id);
		}));

		it('$scope.update() should update a valid Assigncourse', inject(function(Assigncourses) {
			// Define a sample Assigncourse put data
			var sampleAssigncoursePutData = new Assigncourses({
				_id: '525cf20451979dea2c000001',
				name: 'New Assigncourse'
			});

			// Mock Assigncourse in scope
			scope.assigncourse = sampleAssigncoursePutData;

			// Set PUT response
			$httpBackend.expectPUT(/assigncourses\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/assigncourses/' + sampleAssigncoursePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid assigncourseId and remove the Assigncourse from the scope', inject(function(Assigncourses) {
			// Create new Assigncourse object
			var sampleAssigncourse = new Assigncourses({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Assigncourses array and include the Assigncourse
			scope.assigncourses = [sampleAssigncourse];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/assigncourses\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAssigncourse);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.assigncourses.length).toBe(0);
		}));
	});
}());