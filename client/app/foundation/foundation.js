'use strict';

angular.module('roomApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('foundation', {
                url: '/foundation',
                templateUrl: 'app/foundation/foundation.html',
                controller: 'FoundationCtrl'
            })
            .state('createfoundation', {
                url: '/foundation-create',
                templateUrl: 'app/foundation/foundation-create.html',
                controller: 'FoundationCtrl'
            });
    });