'use strict';

describe('Controller: ParentCtrl', function () {

  // load the controller's module
  beforeEach(module('roomApp'));

  var ParentCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ParentCtrl = $controller('ParentCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
