'use strict';

(function() {
	// Teachers Controller Spec
	describe('Teachers Controller Tests', function() {
		// Initialize global variables
		var TeachersController,
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

			// Initialize the Teachers controller.
			TeachersController = $controller('TeachersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Teacher object fetched from XHR', inject(function(Teachers) {
			// Create sample Teacher using the Teachers service
			var sampleTeacher = new Teachers({
				name: 'New Teacher'
			});

			// Create a sample Teachers array that includes the new Teacher
			var sampleTeachers = [sampleTeacher];

			// Set GET response
			$httpBackend.expectGET('teachers').respond(sampleTeachers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.teachers).toEqualData(sampleTeachers);
		}));

		it('$scope.findOne() should create an array with one Teacher object fetched from XHR using a teacherId URL parameter', inject(function(Teachers) {
			// Define a sample Teacher object
			var sampleTeacher = new Teachers({
				name: 'New Teacher'
			});

			// Set the URL parameter
			$stateParams.teacherId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/teachers\/([0-9a-fA-F]{24})$/).respond(sampleTeacher);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.teacher).toEqualData(sampleTeacher);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Teachers) {
			// Create a sample Teacher object
			var sampleTeacherPostData = new Teachers({
				name: 'New Teacher'
			});

			// Create a sample Teacher response
			var sampleTeacherResponse = new Teachers({
				_id: '525cf20451979dea2c000001',
				name: 'New Teacher'
			});

			// Fixture mock form input values
			scope.name = 'New Teacher';

			// Set POST response
			$httpBackend.expectPOST('teachers', sampleTeacherPostData).respond(sampleTeacherResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Teacher was created
			expect($location.path()).toBe('/teachers/' + sampleTeacherResponse._id);
		}));

		it('$scope.update() should update a valid Teacher', inject(function(Teachers) {
			// Define a sample Teacher put data
			var sampleTeacherPutData = new Teachers({
				_id: '525cf20451979dea2c000001',
				name: 'New Teacher'
			});

			// Mock Teacher in scope
			scope.teacher = sampleTeacherPutData;

			// Set PUT response
			$httpBackend.expectPUT(/teachers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/teachers/' + sampleTeacherPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid teacherId and remove the Teacher from the scope', inject(function(Teachers) {
			// Create new Teacher object
			var sampleTeacher = new Teachers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Teachers array and include the Teacher
			scope.teachers = [sampleTeacher];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/teachers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTeacher);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.teachers.length).toBe(0);
		}));
	});
}());