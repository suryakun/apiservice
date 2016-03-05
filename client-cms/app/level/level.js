'use strict';

angular.module('cmsApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('level', {
                url: '/level/{school_id}',
                templateUrl: 'app/level/level.html',
                controller: 'LevelCtrl'
            })
            .state('createlevel', {
                url: '/level/create/{school_id}',
                templateUrl: 'app/level/level-create.html',
                controller: 'LevelCreateCtrl'
            })
            .state('editlevel', {
                url: '/level/edit/{id}',
                templateUrl: 'app/level/level-edit.html',
                controller: 'LevelEditCtrl'
            });
    });