'use strict';

angular.module('roomApp')
  .directive('storyCard', function () {
    return {
      templateUrl: 'app/story-card/story-card.html',
      restrict: 'A',
      scope: {
        story: '=storyCard',
        user: '=storyUser'
      },
      link: function (scope, element, attrs) {
      }
    };
  });
