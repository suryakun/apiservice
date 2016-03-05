'use strict';
angular.module('roomApp').factory('apiConnector', ['$resource', 'appConfig', 'appAuth', function($resource, appConfig, appAuth) {
    return $resource(appConfig.baseAPIUrl + '/api/users/get-my-stories', {}, {
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
        getClasses: {
            url: appConfig.baseAPIUrl + '/api/classes',
            method: 'GET',
            cache: false,
            isArray: true
        },
        getMyClasses: {
            url: appConfig.baseAPIUrl + '/api/users/get-my-class',
            method: 'GET',
            cache: true,
            isArray: false
        }
    });
}]);