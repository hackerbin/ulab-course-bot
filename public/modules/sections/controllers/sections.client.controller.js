'use strict';

// Sections controller
angular.module('sections').controller('SectionsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Sections', 'Courses',
    function ($scope, $stateParams, $location, Authentication, Sections, Courses) {
        $scope.authentication = Authentication;
        $scope.selectedCourse = {'title': ''};
        $scope.selectedDay = '';
        $scope.days = ['Sun-Tue','Mon-Wed','Thu-Sat']

        // Create new Section
        $scope.create = function () {
            // Create new Section object
            var section = new Sections({
                course: this.selectedCourse.title,
                name: this.name,
                day: this.selectedDay,
                start: this.start,
                end: this.end
            });

            // Redirect after save
            section.$save(function (response) {
                $location.path('sections/' + response._id);

                // Clear form fields
                $scope.course = '';
                $scope.name = '';
                $scope.day = '';
                $scope.start = '';
                $scope.end = '';

            }, function (errorResponse) {
                //$scope.error = errorResponse.data.message;
                $scope.errodoc = errorResponse;
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Section
        $scope.remove = function (section) {
            if (section) {
                section.$remove();

                for (var i in $scope.sections) {
                    if ($scope.sections [i] === section) {
                        $scope.sections.splice(i, 1);
                    }
                }
            } else {
                $scope.section.$remove(function () {
                    $location.path('sections');
                });
            }
        };
        $scope.errodoc = {};
        // Update existing Section
        $scope.update = function () {
            var section = $scope.section;

            section.$update(function () {
                $location.path('sections/' + section._id);
            }, function (errorResponse) {

                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Sections
        $scope.find = function () {
            $scope.sections = Sections.query();
            $scope.courseList = Courses.query();
        };

        // Find existing Section
        $scope.findOne = function () {
            $scope.section = Sections.get({
                sectionId: $stateParams.sectionId
            });
        };
    }
]);
