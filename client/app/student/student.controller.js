'use strict';
angular.module('roomApp').controller('StudentCtrl', ['$scope', 'apiConnector', function($scope, apiConnector) {
    $scope.myClasses = [];
    $scope.selectedClass = null;
    var a = apiConnector.getMyClasses(function(response) {
        $scope.myClasses = [response];
        $scope.selectedClass = $scope.myClasses[0];
    }, function(response) {
        console.log(response);
    });
}]);