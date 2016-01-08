'use strict';

describe('Controller: LevelCtrl', function () {

  // load the controller's module
  beforeEach(module('roomApp'));

  var LevelCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LevelCtrl = $controller('LevelCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
