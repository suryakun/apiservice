'use strict';

describe('Service: $store', function () {

  // load the service's module
  beforeEach(module('roomApp'));

  // instantiate service
  var $store;
  beforeEach(inject(function (_$store_) {
    $store = _$store_;
  }));

  it('should do something', function () {
    expect(!!$store).toBe(true);
  });

});
