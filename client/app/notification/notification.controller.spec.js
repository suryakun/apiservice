'use strict';

describe('Controller: NotificationCtrl', function () {

  // load the controller's module
  beforeEach(module('roomApp'));

  var NotificationCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NotificationCtrl = $controller('NotificationCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
  });
});
