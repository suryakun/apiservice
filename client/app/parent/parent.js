'use strict';

angular.module('cmsApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('parent', {
                url: '/parent/{school_id}',
                templateUrl: 'app/parent/parent.html',
                controller: 'ParentCtrl'
            })
            .state('createparent', {
                url: '/parent/create/{school_id}',
                templateUrl: 'app/parent/parent-create.html',
                controller: 'ParentCreateCtrl'
            })
            .state('editparent', {
                url: '/parent/edit/{id}/{school_id}',
                templateUrl: 'app/parent/parent-edit.html',
                controller: 'ParentEditCtrl'
            });
    });