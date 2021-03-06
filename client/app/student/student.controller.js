'use strict';
angular.module('roomApp').controller('StudentCtrl', ['$scope', 'myClassesHttp', '$http', function($scope, myClassesHttp, $http) {
    $scope.myClasses = [myClassesHttp.data];
    console.log($scope.myClasses);
    var schoolId = $scope.myClasses[0]._school._id;
    var otherClass = $http.get('/api/schools/get-class-by-school-id/' + schoolId);
    $scope.students = [];
    otherClass.then(function (response) {
        console.log(response.data._class);
        $scope.myOtherClasses = response.data._class;
        $scope.selectedClass = $scope.myOtherClasses[0];
        var getData = function() {
            $scope.promise = $http.get('/api/classes/get-all-student-by-class-id/' + $scope.selectedClass._id, {
                cache: true
            }).then(function(response) {
                $scope.students = response.data._student;
            });
        };
        getData();
    })

    $scope.getDataById = function (id) {
        var getData = function() {
            $scope.promise = $http.get('/api/classes/get-all-student-by-class-id/' + id, {
                cache: true
            }).then(function(response) {
                $scope.students = response.data._student;
            });
        };
        getData();  
    }
}]);