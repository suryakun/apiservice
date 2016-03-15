'use strict';

angular.module('cmsApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('group', {
                url: '/group/{school_id}',
                templateUrl: 'app/group/group.html',
                controller: 'GroupCtrl'
            })
            .state('creategroup', {
                url: '/group/create/{school_id}',
                templateUrl: 'app/group/group-create.html',
                controller: 'GroupCreateCtrl'
            })
            .state('editgroup', {
                url: '/group/edit/{id}/{school_id}',
                templateUrl: 'app/group/group-edit.html',
                controller: 'GroupEditCtrl'
            });
    });