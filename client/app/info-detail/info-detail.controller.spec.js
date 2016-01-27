'use strict';

describe('Controller: InfoDetailCtrl', function () {

  // load the controller's module
  beforeEach(module('roomApp'));

  var InfoDetailCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InfoDetailCtrl = $controller('InfoDetailCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
