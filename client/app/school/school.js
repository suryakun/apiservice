'use strict';

angular.module('cmsApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('school', {
                url: '/schools/{found_id}',
                templateUrl: 'app/school/school.html',
                controller: 'SchoolCtrl'
            })
            .state('createschool', {
                url: '/school/create/{found_id}',
                templateUrl: 'app/school/school-create.html',
                controller: 'SchoolCreateCtrl'
            })
            .state('editschool', {
                url: '/school/edit/{id}',
                templateUrl: 'app/school/school-edit.html',
                controller: 'SchoolEditCtrl'
            })
            .state('dashboardschool', {
                url: '/school/dashboard/{school_id}',
                templateUrl: 'app/school/school-dashboard.html',
                controller: 'SchoolDashboardCtrl'
            });
    });