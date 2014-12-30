'use strict';

// Teachers controller
angular.module('teachers').controller('TeachersController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Teachers', 'Sections', 'Assigncourses',
    function ($scope, $http, $stateParams, $location, Authentication, Teachers, Sections, Assigncourses) {
        $scope.authentication = Authentication;


        // Create new Teacher
        $scope.create = function () {
            // Create new Teacher object
            var teacher = new Teachers({
                name: this.name,
                designation: this.designation,
                tid: this.tid,
                phone: this.phone,
                email: this.email,
                department: this.department
            });


            // Redirect after save
            teacher.$save(function (response) {
                $location.path('teachers/' + response._id);

                // Clear form fields
                $scope.name = '';
                $scope.designation = '';
                $scope.tid = '';
                $scope.phone = '';
                $scope.email = '';
                $scope.department = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };


        // Remove existing Teacher
        $scope.remove = function (teacher) {
            if (teacher) {
                teacher.$remove();

                for (var i in $scope.teachers) {
                    if ($scope.teachers [i] === teacher) {
                        $scope.teachers.splice(i, 1);
                    }
                }
            } else {
                $scope.teacher.$remove(function () {
                    $location.path('teachers');
                });
            }
        };

        // Update existing Teacher
        $scope.update = function () {
            var teacher = $scope.teacher;

            teacher.$update(function () {
                $location.path('teachers/' + teacher._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        //$scope.getSections = Sections.query();
        $scope.getAssigncourses = Assigncourses.query();
        // Find a list of Teachers
        $scope.find = function () {
            $scope.teachers = Teachers.query();

        };

        $scope.sent = false;
        $scope.sendMail = function (mail, tid) {
            var c = 'no courses assigned';
            var s = 'no sections assigned';
            var d = 'N/A';
            var st = 'N/A';
            var e = 'N/A';
                $scope.getAssigncourses.forEach(function (assigncourses) {
                if (assigncourses.teacher === tid) {
                    c = assigncourses.course;
                    s = assigncourses.section;
                    d = 'Sun-Tue';
                    st= '1:30 PM';
                    e = '2:30 PM';
                }
            });

            //$http.post('/teachers/mail', mail).
            //    success(function(data, status, headers, config) {
            //        // this callback will be called asynchronously
            //        // when the response is available
            //    }).
            //    error(function(data, status, headers, config) {
            //        // called asynchronously if an error occurs
            //        // or server returns response with an error status.
            //    });
            $scope.sent = true;

            $http.post('/teachers/mail', angular.toJson(
                {
                    mail: mail,
                    teacher: tid,
                    course: c,
                    section: s,
                    day: d,
                    start: st,
                    end: e
                }
            ));
            //
            //$http(req).success(function(){
            //    //
            //}).error(function(){
            //    //
            //});
        };

        // Find existing Teacher
        $scope.findOne = function () {
            $scope.teacher = Teachers.get({
                teacherId: $stateParams.teacherId
            });
        };
    }
]);
