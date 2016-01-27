'use strict';

angular.module('roomApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main.info-detail', {
        url: 'info-detail/:id',
        templateUrl: 'app/info-detail/info-detail.html',
        controller: 'InfoDetailCtrl'
      });
  });
