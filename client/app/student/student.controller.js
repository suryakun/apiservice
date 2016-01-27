'use strict';
angular.module('roomApp').controller('StudentCtrl', ['$scope', 'apiConnector', function($scope, apiConnector) {
    $scope.dataset = [];
    var a = apiConnector.getMyClasses(response => {
        $scope.myClasses = response._school._class;
    }, response => {
        console.log(response);
    });

    // $scope.onSubmitReply = function(activity) {
    //     apiConnector.postReply({
    //         info: activity.newReply,
    //         story_id: activity._id
    //     });
    // }
}]);