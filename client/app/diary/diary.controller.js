'use strict';
angular.module('roomApp').controller('DiaryCtrl', ['$scope', 'userDetailHttp', '$http', function($scope, userDetailHttp, $http) {
    $scope.user = userDetailHttp.data;
    $scope.stories = [];
    var lastId = null,
        scrollInitialized = false;
    var getData = function() {
        if ($scope.scroll.disable) return false;
        $scope.scroll.disable = true; 
        $scope.promise = $http.get('/api/users/get-story-filter/diary/'+ $scope.user._parent._id, {
            cache: lastId ? true : false,
            params: {
                after: lastId,
                limit: lastId ? 5 : 10
            }
        }).then(function(response) {
            scrollInitialized = true;
            if (response.data.length) {
                lastId = response.data[response.data.length - 1]._id;
                $scope.stories = $scope.stories.concat(response.data);
                if (response.data.length >= response.config.params.limit) {
                    $scope.scroll.disable = false;
                }
            }
        });
    };
    $scope.$on('diary:created', function() {
        getData();
    });
    $scope.$on('main:scroll', function() {
        if (scrollInitialized) {
            getData();
        }
    });
    getData();
}]);