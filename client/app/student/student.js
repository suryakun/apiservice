'use strict';
angular.module('roomApp').config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('main.student', {
        url: 'student',
        templateUrl: 'app/student/student.html',
        controller: 'StudentCtrl',
        controllerAs: 'student',
        containerClass: 'animated fadeIn',
        resolve: {
            myClassesHttp: ['$http', function($http) {
                return $http.get('/api/users/get-my-class', {
                    cache: true
                });
            }],
        }
    });
}]);