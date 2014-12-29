'use strict';

// Assigncourses controller
angular.module('assigncourses').controller('AssigncoursesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Assigncourses', 'Courses', 'Teachers', 'Sections',
    function ($scope, $stateParams, $location, Authentication, Assigncourses, Courses, Teachers, Sections) {
        $scope.authentication = Authentication;
        $scope.selectedCourse = [];
        $scope.selectedSection = [];
        $scope.selectedTeacher = [];
        // Create new Assigncourse
        $scope.create = function () {
            // Create new Assigncourse object
            var assigncourse = new Assigncourses({
                teacher: this.selectedTeacher.name,
                course: this.selectedCourse.title,
                section: this.selectedSection.name
            });

            // Redirect after save
            assigncourse.$save(function (response) {
                $location.path('assigncourses/' + response._id);

                // Clear form fields
                $scope.teacher = '';
                $scope.course = '';
                $scope.section = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Assigncourse
        $scope.remove = function (assigncourse) {
            if (assigncourse) {
                assigncourse.$remove();

                for (var i in $scope.assigncourses) {
                    if ($scope.assigncourses [i] === assigncourse) {
                        $scope.assigncourses.splice(i, 1);
                    }
                }
            } else {
                $scope.assigncourse.$remove(function () {
                    $location.path('assigncourses');
                });
            }
        };

        // Update existing Assigncourse
        $scope.update = function () {
            var assigncourse = $scope.assigncourse;

            assigncourse.$update(function () {
                $location.path('assigncourses/' + assigncourse._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        $scope.allSections = [];
        $scope.allTeachers = [];
        $scope.allSections = [];

        // Find a list of Assigncourses
        $scope.find = function () {
            $scope.assigncourses = Assigncourses.query();
            $scope.allCourses = Courses.query();
            $scope.allTeachers = Teachers.query();
            $scope.allSections = Sections.query();
        };

        $scope.filteredSections = [];
        $scope.loadSection = function () {
            $scope.filteredSections = [];

            $scope.allSections.forEach(function (section) {
                if (section.course === $scope.selectedCourse.title) {
                    $scope.filteredSections.push(section);
                }
            });
            //$scope.filteredSections = sections in this.allSections where sections.course===this.selectedCourse.title ;
        };

        // Find existing Assigncourse
        $scope.findOne = function () {
            $scope.assigncourse = Assigncourses.get({
                assigncourseId: $stateParams.assigncourseId
            });
        };
    }
]);
