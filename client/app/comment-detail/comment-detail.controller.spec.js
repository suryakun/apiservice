'use strict';

describe('Controller: CommentDetailCtrl', function () {

  // load the controller's module
  beforeEach(module('roomApp'));

  var CommentDetailCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CommentDetailCtrl = $controller('CommentDetailCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
