'use strict';

angular.module('roomApp')
  .directive('storyCard', function () {
    return {
      templateUrl: 'components/story-card/story-card.html',
      restrict: 'A',
      replace: true,
      controller: ['$scope', '$http', 'socket', function ($scope, $http, socket) {
          $scope.getReply = function(story) {
              $scope.promise = $http.get('/api/stories/' + story._id + '/replies', {
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
          $scope.getReply($scope.story);
      }],
      scope: {
        story: '=storyCard',
        user: '=storyUser'
      },
      link: function (scope, element, attrs) {
      }
    };
  });
