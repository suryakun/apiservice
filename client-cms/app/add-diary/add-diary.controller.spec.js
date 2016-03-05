'use strict';

describe('Controller: AddDiaryCtrl', function () {

  // load the controller's module
  beforeEach(module('roomApp'));

  var AddDiaryCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddDiaryCtrl = $controller('AddDiaryCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
