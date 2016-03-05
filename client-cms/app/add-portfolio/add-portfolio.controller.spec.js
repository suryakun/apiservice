'use strict';

describe('Controller: AddPortfolioCtrl', function () {

  // load the controller's module
  beforeEach(module('roomApp'));

  var AddPortfolioCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddPortfolioCtrl = $controller('AddPortfolioCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
