'use strict';

describe('Service: appAuth', function () {

  // load the service's module
  beforeEach(module('roomApp'));

  // instantiate service
  var appAuth;
  beforeEach(inject(function (_appAuth_) {
    appAuth = _appAuth_;
  }));

  it('should do something', function () {
    expect(!!appAuth).toBe(true);
  });

});
