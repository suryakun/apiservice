'use strict';
angular.module('roomApp').config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('main.portfolio', {
        url: 'portfolio/:id',
        templateUrl: 'app/portfolio/portfolio.html',
        controller: 'PortfolioCtrl',
        containerClass: 'no-cover animated fadeIn',
        resolve: {
            userDetailHttp: ['$http', '$stateParams', function($http, $stateParams) {
                return $http.get('/api/users/single/' + $stateParams.id, {
                    cache: true
                });
            }],
        }
    });
}]);