'use strict';

angular.module('roomApp')
    .service('Class', function ($http) {

        var base = this;

        base.getMe = function (argument) {
            return $http.get('api/users/me');
        }

        base.getData = function (id) {
            return $http.get('/api/classes/' + id);
        }

        base.create = function (params) {
            return $http.post('/api/classes', params)
        }

        base.update = function (id, params) {
            return $http.put('/api/classes/' + id, params)
        }

        base.delete = function (id, params) {
            return $http.get('/api/classes/active/' + id, params)
        }

        base.getDetail = function (id) {
            return $http.get('/api/classes/single/' + id)
        }

        return base;

    })