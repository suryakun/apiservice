'use strict';
angular.module('roomApp').controller('StudentCtrl', ['$scope', 'myClassesHttp', '$http', function($scope, myClassesHttp, $http) {
    $scope.myClasses = [myClassesHttp.data];
    $scope.selectedClass = $scope.myClasses[0];
    $scope.students = [];
    var getData = function() {
        $scope.promise = $http.get('/api/classes/get-all-student-by-class-id/' + $scope.selectedClass._id, {
            cache: true
        }).then(function(response) {
            $scope.students = response.data._student;
        });
    };
    getData();
}]);