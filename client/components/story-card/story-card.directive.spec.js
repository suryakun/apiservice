'use strict';

describe('Directive: storyCard', function () {

  // load the directive's module and view
  beforeEach(module('roomApp'));
  beforeEach(module('app/story-card/story-card.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<story-card></story-card>');
    element = $compile(element)(scope);
    scope.$apply();
  }));
});
