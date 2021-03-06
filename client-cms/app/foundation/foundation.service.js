'use strict';

angular.module('cmsApp')
    .service('Foundation', function ($http) {

    	var base = this;

    	base.foundations = {};

    	base.getMe = function (argument) {
    		return $http.get('api/users/me');
    	}

    	base.getData = function (argument) {
    		return $http.get('/api/foundations');
    	}

    	base.create = function (params) {
    		return $http.post('/api/foundations', params)
    	}

    	base.update = function (id, params) {
    		return $http.put('/api/foundations/' + id, params)
    	}

        base.delete = function (id, params) {
            return $http.get('/api/foundations/active/' + id, params)
        }

        return base;

    })