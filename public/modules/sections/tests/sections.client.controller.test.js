'use strict';

(function() {
	// Sections Controller Spec
	describe('Sections Controller Tests', function() {
		// Initialize global variables
		var SectionsController,
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

			// Initialize the Sections controller.
			SectionsController = $controller('SectionsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Section object fetched from XHR', inject(function(Sections) {
			// Create sample Section using the Sections service
			var sampleSection = new Sections({
				name: 'New Section'
			});

			// Create a sample Sections array that includes the new Section
			var sampleSections = [sampleSection];

			// Set GET response
			$httpBackend.expectGET('sections').respond(sampleSections);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.sections).toEqualData(sampleSections);
		}));

		it('$scope.findOne() should create an array with one Section object fetched from XHR using a sectionId URL parameter', inject(function(Sections) {
			// Define a sample Section object
			var sampleSection = new Sections({
				name: 'New Section'
			});

			// Set the URL parameter
			$stateParams.sectionId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/sections\/([0-9a-fA-F]{24})$/).respond(sampleSection);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.section).toEqualData(sampleSection);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Sections) {
			// Create a sample Section object
			var sampleSectionPostData = new Sections({
				name: 'New Section'
			});

			// Create a sample Section response
			var sampleSectionResponse = new Sections({
				_id: '525cf20451979dea2c000001',
				name: 'New Section'
			});

			// Fixture mock form input values
			scope.name = 'New Section';

			// Set POST response
			$httpBackend.expectPOST('sections', sampleSectionPostData).respond(sampleSectionResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Section was created
			expect($location.path()).toBe('/sections/' + sampleSectionResponse._id);
		}));

		it('$scope.update() should update a valid Section', inject(function(Sections) {
			// Define a sample Section put data
			var sampleSectionPutData = new Sections({
				_id: '525cf20451979dea2c000001',
				name: 'New Section'
			});

			// Mock Section in scope
			scope.section = sampleSectionPutData;

			// Set PUT response
			$httpBackend.expectPUT(/sections\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/sections/' + sampleSectionPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid sectionId and remove the Section from the scope', inject(function(Sections) {
			// Create new Section object
			var sampleSection = new Sections({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Sections array and include the Section
			scope.sections = [sampleSection];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/sections\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSection);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.sections.length).toBe(0);
		}));
	});
}());