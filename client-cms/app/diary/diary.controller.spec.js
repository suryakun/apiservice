'use strict';

describe('Controller: DiaryCtrl', function () {

  // load the controller's module
  beforeEach(module('roomApp'));

  var DiaryCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DiaryCtrl = $controller('DiaryCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
