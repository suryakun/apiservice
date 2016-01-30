'use strict';
angular.module('roomApp').controller('PortfolioCtrl', ['$scope', 'userDetailHttp', function($scope, userDetailHttp) {
    $scope.user = userDetailHttp.data;
}]);