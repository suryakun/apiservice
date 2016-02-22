'use strict';
angular.module('roomApp').controller('DiaryCtrl', ['$scope', 'userDetailHttp', '$http', function($scope, userDetailHttp, $http) {
    $scope.user = userDetailHttp.data;
    $scope.stories = [];
    var getData = function() {
        $scope.promise = $http.get('/api/users/get-story-filter/diary/'+ $scope.user._parent._id, {
            cache: false
        }).then(function(response) {
            $scope.stories = response.data;
        });
    };
    $scope.$on('diary:created', function() {
        getData();
    });
    getData();
}]);