'use strict';

describe('Controller: AddActivityCtrl', function () {

  // load the controller's module
  beforeEach(module('roomApp'));

  var AddActivityCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddActivityCtrl = $controller('AddActivityCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
