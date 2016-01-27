'use strict';
angular.module('roomApp').controller('ActivityCtrl', ['$scope', 'apiConnector', function($scope, apiConnector) {
    $scope.dataset = [];
    var a = apiConnector.getStories({
        type: 'activity'
    }, response => {
        $scope.dataset = response;
    }, response => {
        console.log(response);
    });

    $scope.onSubmitReply = function(activity) {
        apiConnector.postReply({
            info: activity.newReply,
            story_id: activity._id
        });
    }
}]);