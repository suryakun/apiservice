'use strict';

describe('Controller: PortfolioDetailCtrl', function () {

  // load the controller's module
  beforeEach(module('roomApp'));

  var PortfolioDetailCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PortfolioDetailCtrl = $controller('PortfolioDetailCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
