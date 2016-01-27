'use strict';
angular.module('roomApp').config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('main.portfolio-detail', {
        url: 'portfolio-detail',
        templateUrl: 'app/portfolio-detail/portfolio-detail.html',
        controller: 'PortfolioDetailCtrl',
        containerClass: 'no-cover'
    });
}]);