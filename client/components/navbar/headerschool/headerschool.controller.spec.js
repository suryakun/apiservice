'use strict';

describe('Controller: HeaderschoolCtrl', function () {

  // load the controller's module
  beforeEach(module('roomApp'));

  var HeaderschoolCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HeaderschoolCtrl = $controller('HeaderschoolCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
