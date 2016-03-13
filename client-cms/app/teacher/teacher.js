'use strict';

angular.module('cmsApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('teacher', {
                url: '/teacher/{school_id}',
                templateUrl: 'app/teacher/teacher.html',
                controller: 'TeacherCtrl'
            })
            .state('createteacher', {
                url: '/teacher/create/{school_id}',
                templateUrl: 'app/teacher/teacher-create.html',
                controller: 'TeacherCreateCtrl'
            })
            .state('editteacher', {
                url: '/teacher/edit/{id}',
                templateUrl: 'app/teacher/teacher-edit.html',
                controller: 'TeacherEditCtrl'
            });
    });