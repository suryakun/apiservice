'use strict';
angular.module('roomApp').controller('ActivityCtrl', ['$rootScope', '$scope', '$http', 'socket', '$filter',function($rootScope, $scope, $http, socket, $filter) {
    $scope.stories = [];
    var getData = function() {
        $scope.promise = $http.get('/api/users/get-story-filter/activity/0', {
            cache: false
        }).then(function(response) {
            $scope.stories = response.data;
            angular.forEach($scope.stories, function(value, key) {
                $scope.getReply(value);
            });
        });
    };
    getData();
    $scope.getReply = function(story) {
        $http.get('/api/stories/get-reply-by-story-id/' + story._id, {
            cache: false
        }).then(function(response) {
            var oldItem = _.find($scope.stories, {
                _id: story._id
            });
            if (oldItem) {
                var index = $scope.stories.indexOf(oldItem);
                oldItem.reply = response.data;
                $scope.stories.splice(index, 1, oldItem);
            }
        });
    };
    var lastDate = null;
    $scope.onInitStory = function(story) {
        if (lastDate === $filter('amDateFormat')(story.createdAt, 'D-MM-Y')) {
            story.hideDate = true;
        } else {
            lastDate = $filter('amDateFormat')(story.createdAt, 'D-MM-Y');
        }
    };
    // var a = apiConnector.getStories({
    //     type: 'activity'
    // }, function(response) {
    //     $scope.dataset = response;
    //     socket.syncUpdates('story', $scope.dataset, function(){
    //         // console.info(arguments);
    //     });
    // }, function(response) {
    //     console.log(response);
    // });
    // socket.socket.on('story:save', function() {
    // });
    $scope.onSubmitReply = function(story) {
        $scope.promise = $http.post('/api/replies', {
            info: story.newReply,
            story_id: story._id
        }).then(function() {
            story.newReply = '';
            $scope.getReply(story);
        });
    };
    $rootScope.$on('activity:created', function() {
        getData();
    });
}]);