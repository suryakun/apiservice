'use strict';

angular.module('roomApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('reset-password', {
        url: '/reset-password',
        templateUrl: 'app/reset-password/reset-password.html',
        controller: 'ResetPasswordCtrl'
      });
  });
