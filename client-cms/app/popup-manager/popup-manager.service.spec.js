'use strict';

describe('Service: popupManager', function () {

  // load the service's module
  beforeEach(module('roomApp'));

  // instantiate service
  var popupManager;
  beforeEach(inject(function (_popupManager_) {
    popupManager = _popupManager_;
  }));

  it('should do something', function () {
    expect(!!popupManager).toBe(true);
  });

});
