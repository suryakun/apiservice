'use strict';
angular.module('roomApp').controller('InfoCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.stories = [];
    var lastId = null,
        scrollInitialized = false;
    var getData = function() {
        if ($scope.scroll.disable) return false;
        $scope.scroll.disable = true; 
        $scope.promise = $http.get('/api/users/get-story-filter/info/0', {
            cache: lastId ? true : false,
            params: {
                after: lastId,
                limit: lastId ? 5 : 20
            }
        }).then(function(response) {
            scrollInitialized = true;
            if (response.data.length) {
                lastId = response.data[response.data.length - 1]._id;
                $scope.stories = $scope.stories.concat(response.data);
                $scope.scroll.disable = false;
            }
        });
    };
    $scope.$on('info:created', function() {
        getData();
    });
    $scope.$on('main:scroll', function() {
        if (scrollInitialized) {
            getData();
        }
    });
    getData();
}]);