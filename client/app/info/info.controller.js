'use strict';
angular.module('roomApp').controller('InfoCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.stories = [];
    var getData = function() {
        $scope.promise = $http.get('/api/users/get-story-filter/info/0', {
            cache: false
        }).then(function(response) {
            $scope.stories = response.data;
        });
    };
    $scope.$on('info:created', function() {
        getData();
    });
    getData();
}]);