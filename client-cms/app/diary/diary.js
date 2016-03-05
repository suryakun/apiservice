'use strict';
angular.module('roomApp').config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('main.diary', {
        url: 'diary/:id',
        templateUrl: 'app/diary/diary.html',
        controller: 'DiaryCtrl',
        containerClass: '',
        resolve: {
            userDetailHttp: ['$http', '$stateParams', function($http, $stateParams) {
                return $http.get('/api/users/single/' + $stateParams.id, {
                    cache: true
                });
            }],
        }
    });
}]);