'use strict';
angular.module('roomApp').factory('apiConnector', ['$resource', 'appConfig', 'appAuth', function($resource, appConfig, appAuth) {
    return $resource(appConfig.baseAPIUrl + '/api/users/get-my-stories', {}, {
        getStories: {
            url: appConfig.baseAPIUrl + '/api/users/get-my-stories',
            method: 'GET',
            cache: false,
            isArray: true
        },
        // getStoriesByDate: {
        //     url: appConfig.baseAPIUrl + '/api/users/get-story-by-date',
        //     method: 'POST',
        //     cache: false,
        //     isArray: true
        // },
        postStory: {
            url: appConfig.baseAPIUrl + '/api/stories',
            method: 'POST'
        },
        postReply: {
            url: appConfig.baseAPIUrl + '/api/replies',
            method: 'POST'
        },
        getReplyStory: {
            url: appConfig.baseAPIUrl + '/api/stories/get-reply-by-story-id/:id',
            method: 'GET',
            isArray: true
        },
        getParents: {
            url: appConfig.baseAPIUrl + '/api/users/get-all-parent-from-my-school',
            method: 'GET',
            cache: false,
            isArray: true
        },
        getTeachers: {
            url: appConfig.baseAPIUrl + '/api/users/get-all-teacher-from-my-school',
            method: 'GET',
            cache: false,
            isArray: true
        },
        getGroups: {
            url: appConfig.baseAPIUrl + '/api/groups',
            method: 'GET',
            cache: false,
            isArray: true
        },
        getSingleUser: {
            url: appConfig.baseAPIUrl + '/api/users/single/:id',
            method: 'GET',
            cache: true,
            isArray: false
        },
        getMyClasses: {
            url: appConfig.baseAPIUrl + '/api/users/get-my-class',
            method: 'GET',
            cache: true,
            isArray: false
        }
    });
}]);