'use strict';

angular.module('cmsApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('foundation', {
                url: '/foundation',
                templateUrl: 'app/foundation/foundation.html',
                controller: 'FoundationCtrl'
            })
            .state('createfoundation', {
                url: '/foundation/create',
                templateUrl: 'app/foundation/foundation-create.html',
                controller: 'FoundationCtrl'
            })
            .state('editfoundation', {
                url: '/foundation/edit/{id}',
                templateUrl: 'app/foundation/foundation-edit.html',
                controller: 'FoundationCtrl'
            });;
    });