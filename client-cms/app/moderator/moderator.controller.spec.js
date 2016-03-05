'use strict';

describe('Controller: ModeratorCtrl', function () {

  // load the controller's module
  beforeEach(module('roomApp'));

  var ModeratorCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ModeratorCtrl = $controller('ModeratorCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
