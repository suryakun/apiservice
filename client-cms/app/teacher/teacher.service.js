'use strict';

angular.module('cmsApp')
    .service('Teacher', function ($http) {

        var base = this;

        base.getMe = function (argument) {
            return $http.get('api/users/me');
        }

        base.getData = function (id) {
            return $http.get('/api/users/get-teacher-for-admin/' + id);
        }

        base.create = function (params) {
            return $http.post('/api/users/create-teacher', params)
        }

        base.update = function (id, params) {
            return $http.put('/api/users/update-teacher/' + id, params)
        }

        base.delete = function (id, params) {
            return $http.delete('/api/users/' + id, params)
        }

        base.getDetail = function (id) {
            return $http.get('/api/users/single/' + id)
        }

        return base;

    })