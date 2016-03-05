'use strict';

describe('Controller: ActivityCtrl', function () {

  // load the controller's module
  beforeEach(module('roomApp'));

  var ActivityCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ActivityCtrl = $controller('ActivityCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
