'use strict';

angular.module('cmsApp')
    .service('Moderator', function ($http) {

        var base = this;

        base.getMe = function (argument) {
            return $http.get('api/users/me');
        }

        base.getData = function (id) {
            return $http.get('/api/users/get-moderators/' + id);
        }

        base.create = function (params) {
            return $http.post('/api/users', params)
        }

        base.update = function (id, params) {
            return $http.put('/api/users/' + id, params)
        }

        base.delete = function (id, params) {
            return $http.get('/api/users/active/' + id, params)
        }

        base.getDetail = function (id) {
            return $http.get('/api/users/single/' + id)
        }

        return base;

    })