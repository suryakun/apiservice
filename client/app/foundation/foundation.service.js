'use strict';

angular.module('roomApp')
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

        return base;

    })