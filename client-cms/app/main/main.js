'use strict';
angular.module('cmsApp').config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main',
        data: {
            accessLevel: AUTHConfig.accessLevels.user,
            loginState: 'login'
        }
    });
}]);