'use strict';

describe('Directive: collagePlus', function () {

  // load the directive's module
  beforeEach(module('roomApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<collage-plus></collage-plus>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the collagePlus directive');
  }));
});
