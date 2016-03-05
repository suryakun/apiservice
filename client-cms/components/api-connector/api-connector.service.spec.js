'use strict';

describe('Service: apiConnector', function () {

  // load the service's module
  beforeEach(module('roomApp'));

  // instantiate service
  var apiConnector;
  beforeEach(inject(function (_apiConnector_) {
    apiConnector = _apiConnector_;
  }));

  it('should do something', function () {
    expect(!!apiConnector).toBe(true);
  });

});
