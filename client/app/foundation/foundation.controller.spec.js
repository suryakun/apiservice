'use strict';

describe('Controller: FoundationCtrl', function () {

  // load the controller's module
  beforeEach(module('roomApp'));

  var FoundationCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FoundationCtrl = $controller('FoundationCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
