'use strict';
angular.module('roomApp').factory('apiConnector', ['$resource', 'appConfig', 'appAuth', function($resource, appConfig, appAuth) {
    return $resource(appConfig.baseAPIUrl + '/api/users/get-my-stories', {}, {
        getStories: {
            headers: {
                Authorization: 'Bearer ' + appAuth.token,
                user_id: appAuth.data.id
            },
            url: appConfig.baseAPIUrl + '/api/users/get-my-stories',
            method: 'GET',
            cache: false,
            isArray: true
        },
        // getStoriesByDate: {
        //     headers: {
        //         Authorization: 'Bearer ' + appAuth.token,
        //         user_id: appAuth.data.id
        //     },
        //     url: appConfig.baseAPIUrl + '/api/users/get-story-by-date',
        //     method: 'POST',
        //     cache: false,
        //     isArray: true
        // },
        postStory: {
            headers: {
                Authorization: 'Bearer ' + appAuth.token,
                user_id: appAuth.data.id
            },
            url: appConfig.baseAPIUrl + '/api/stories',
            method: 'POST'
        },
        postReply: {
            headers: {
                Authorization: 'Bearer ' + appAuth.token,
                user_id: appAuth.data.id
            },
            url: appConfig.baseAPIUrl + '/api/replies',
            method: 'POST'
        },
        getReplyStory: {
            headers: {
                Authorization: 'Bearer ' + appAuth.token,
                user_id: appAuth.data.id
            },
            url: appConfig.baseAPIUrl + '/api/stories/get-reply-by-story-id/:id',
            method: 'GET',
            isArray: true
        },
        getParents: {
            headers: {
                Authorization: 'Bearer ' + appAuth.token,
                user_id: appAuth.data.id
            },
            url: appConfig.baseAPIUrl + '/api/users/get-all-parent-from-my-school',
            method: 'GET',
            cache: false,
            isArray: true
        },
        getTeachers: {
            headers: {
                Authorization: 'Bearer ' + appAuth.token,
                user_id: appAuth.data.id
            },
            url: appConfig.baseAPIUrl + '/api/users/get-all-teacher-from-my-school',
            method: 'GET',
            cache: false,
            isArray: true
        },
        getGroups: {
            headers: {
                Authorization: 'Bearer ' + appAuth.token,
                user_id: appAuth.data.id
            },
            url: appConfig.baseAPIUrl + '/api/groups',
            method: 'GET',
            cache: false,
            isArray: true
        },
        getSingleUser: {
            headers: {
                Authorization: 'Bearer ' + appAuth.token,
                user_id: appAuth.data.id
            },
            url: appConfig.baseAPIUrl + '/api/users/single/:id',
            method: 'GET',
            cache: true,
            isArray: false
        },
        getMyClasses: {
            headers: {
                Authorization: 'Bearer ' + appAuth.token,
                user_id: appAuth.data.id
            },
            url: appConfig.baseAPIUrl + '/api/users/get-my-class',
            method: 'GET',
            cache: true,
            isArray: false
        }
    });
}]);