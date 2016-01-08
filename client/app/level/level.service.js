'use strict';

angular.module('roomApp')
    .service('Level', function ($http) {

        var base = this;

        base.getMe = function (argument) {
            return $http.get('api/users/me');
        }

        base.getData = function (id) {
            return $http.get('/api/levels/' + id);
        }

        base.create = function (params) {
            return $http.post('/api/levels', params)
        }

        base.update = function (id, params) {
            return $http.put('/api/levels/' + id, params)
        }

        base.delete = function (id, params) {
            return $http.get('/api/levels/active/' + id, params)
        }

        base.getDetail = function (id) {
            return $http.get('/api/levels/single/' + id)
        }

        return base;

    })