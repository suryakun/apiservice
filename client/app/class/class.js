'use strict';

angular.module('cmsApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('class', {
                url: '/class/{school_id}',
                templateUrl: 'app/class/class.html',
                controller: 'ClassCtrl'
            })
            .state('createclass', {
                url: '/class/create/{school_id}',
                templateUrl: 'app/class/class-create.html',
                controller: 'ClassCreateCtrl'
            })
            .state('editclass', {
                url: '/class/edit/{id}/{school_id}',
                templateUrl/.: 'app/class/class-edit.html',
                controller: 'ClassEditCtrl'
            });
    });