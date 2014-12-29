'use strict';

// Teachers controller
angular.module('teachers').controller('TeachersController', ['$scope','$http','$stateParams', '$location', 'Authentication', 'Teachers', 'Sections',
    function ($scope, $http, $stateParams, $location, Authentication, Teachers, Sections) {
        $scope.authentication = Authentication;

        $scope.sections = [];

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
        $scope.sent = false;
        $scope.sendMail = function(mail,tid){
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
            $scope.find();
            $http.post('/teachers/mail', angular.toJson(
                {
                    mail: mail,
                    teacher : tid,
                    sections: $scope.sections
                }
            ));
            //
            //$http(req).success(function(){
            //    //
            //}).error(function(){
            //    //
            //});
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

        // Find a list of Teachers
        $scope.find = function () {
            $scope.teachers = Teachers.query();
            $scope.sections = Sections.query();
        };

        // Find existing Teacher
        $scope.findOne = function () {
            $scope.teacher = Teachers.get({
                teacherId: $stateParams.teacherId
            });
        };
    }
]);
