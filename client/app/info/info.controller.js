'use strict';
angular.module('roomApp').controller('InfoCtrl', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
    $scope.stories = [];
    var getData = function() {
        $scope.promise = $http.get('/api/users/get-story-filter/info/0', {
            cache: false
        }).then(function(response) {
            $scope.stories = response.data;
        });
    };
    getData();
    $rootScope.$on('info:created', function() {
        getData();
    });
}]);