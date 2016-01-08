'use strict';

angular.module('roomApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('teacher', {
                url: '/teacher/{school_id}',
                templateUrl: 'app/teacher/teacher.html',
                controller: 'ClassCtrl'
            })
            .state('createteacher', {
                url: '/teacher/create/{school_id}',
                templateUrl: 'app/teacher/teacher-create.html',
                controller: 'TeacherCreateCtrl'
            })
            .state('editteacher', {
                url: '/teacher/edit/{id}/{school_id}',
                templateUrl: 'app/class/teacher-edit.html',
                controller: 'TeacherEditCtrl'
            });
    });