'use strict';

angular.module('roomApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('foundation', {
        url: '/foundation',
        templateUrl: 'app/foundation/foundation.html',
        controller: 'FoundationCtrl'
      });
  });