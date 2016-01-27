'use strict';
angular.module('roomApp').controller('ActivityCtrl', ['$scope', 'apiConnector', 'socket', function($scope, apiConnector, socket) {
    $scope.dataset = [];
    var a = apiConnector.getStories({
        type: 'activity'
    }, function(response) {
        $scope.dataset = response;
        socket.syncUpdates('story', $scope.dataset, function(){
            // console.info(arguments);
        });
    }, function(response) {
        console.log(response);
    });

    // socket.socket.on('story:save', function() {
        
    // });

    $scope.onSubmitReply = function(activity) {
        apiConnector.postReply({
            info: activity.newReply,
            story_id: activity._id
        });
    }
}]);