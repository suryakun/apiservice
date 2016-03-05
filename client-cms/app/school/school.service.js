'use strict';

angular.module('cmsApp')
    .service('School', function ($http) {

        var base = this;

        base.foundations = {};

        base.foundation_id = '',

        base.setFoundation = function (id) {
            base.foundation_id = id;
        }

        base.getMe = function (argument) {
            return $http.get('api/users/me');
        }

        base.getData = function (id) {
            return $http.get('/api/schools/get-school-by-foundation-id/' + id);
        }

        base.create = function (params) {
            return $http.post('/api/schools', params)
        }

        base.update = function (id, params) {
            return $http.put('/api/schools/' + id, params)
        }

        base.delete = function (id, params) {
            return $http.get('/api/schools/active/' + id, params)
        }

        base.getDetail = function (id) {
            return $http.get('/api/schools/single/' + id)
        }

        return base;

    })