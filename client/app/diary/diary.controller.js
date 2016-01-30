'use strict';
angular.module('roomApp').controller('DiaryCtrl', ['$rootScope', '$scope', 'userDetailHttp', '$http', function($rootScope, $scope, userDetailHttp, $http) {
    $scope.user = userDetailHttp.data;
    $scope.stories = [];
    var getData = function() {
        $scope.promise = $http.get('/api/users/get-story-filter/diary/'+ $scope.user._parent._id, {
            cache: false
        }).then(function(response) {
            $scope.stories = response.data;
        });
    };
    getData();
    $rootScope.$on('diary:created', function() {
        getData();
    });
}]);