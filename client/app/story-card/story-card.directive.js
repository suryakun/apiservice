'use strict';

angular.module('roomApp')
  .directive('storyCard', function () {
    return {
      templateUrl: 'app/story-card/story-card.html',
      restrict: 'A',
      controller: ['$scope', '$http', function ($scope, $http) {
          $scope.getReply = function(story) {
              $http.get('/api/stories/get-reply-by-story-id/' + story._id, {
                  cache: false
              }).then(function(response) {
                  console.info('getReply', response);
                  // var oldItem = _.find($scope.stories, {
                  //     _id: story._id
                  // });
                  // if (oldItem) {
                  //     var index = $scope.stories.indexOf(oldItem);
                  //     oldItem.reply = response.data;
                  //     $scope.stories.splice(index, 1, oldItem);
                  // }
              });
          };
          $scope.onSubmitReply = function(story) {
              $scope.promise = $http.post('/api/replies', {
                  info: story.newReply,
                  story_id: story._id
              }).then(function() {
                  story.newReply = '';
                  $scope.getReply(story);
              });
          };
      }],
      scope: {
        story: '=storyCard',
        user: '=storyUser'
      },
      link: function (scope, element, attrs) {
      }
    };
  });
