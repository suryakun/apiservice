'use strict';
angular.module('roomApp').controller('CommentDetailCtrl', ['$scope', 'storyDetailHttp', '$http', 'socket', function($scope, storyDetailHttp, $http, socket) {
    $scope.story = storyDetailHttp.data[0];

    $scope.getReply = function(story) {
      $http.get('/api/stories/' + story._id + '/replies', {
          cache: false
      }).then(function(response) {
          $scope.story.reply = response.data;
      });
    };
    $scope.onSubmitReply = function(story) {
      $scope.promise = $http.post('/api/replies', {
          info: story.newReply,
          story_id: story._id
      }).then(function() {
          story.newReply = '';
      });
    };
    $scope.getDetailGroup = function(story) {
      var result = [];
      angular.forEach(story._class || [], function(value, key) {
          result.push(value.name);
      });
      angular.forEach(story._group || [], function(value, key) {
          result.push(value.name);
      });
      return result.join(', ');
    }
    // Event Listeners
    socket.socket.on('reply:save', function(data) {
      if (data._story === $scope.story._id) {
          $scope.getReply($scope.story);
      }
    });
    $scope.$watch('story', function (newVal, oldVal) {
        if (newVal._id) {
            $scope.getReply($scope.story);
        }
    });
}]);