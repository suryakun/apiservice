'use strict';

angular.module('cmsApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('moderator', {
                url: '/moderator/{school_id}',
                templateUrl: 'app/moderator/moderator.html',
                controller: 'ModeratorCtrl'
            })
            .state('createmoderator', {
                url: '/moderator/create/{school_id}',
                templateUrl: 'app/class/moderator-create.html',
                controller: 'ModeratorCreateCtrl'
            })
            .state('editmoderator', {
                url: '/moderator/edit/{id}/{school_id}',
                templateUrl: 'app/class/moderator-edit.html',
                controller: 'ModeratorEditCtrl'
            });
    });