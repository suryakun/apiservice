'use strict';
angular.module('roomApp').config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('main.comment-detail', {
        url: 'comment-detail/:id',
        templateUrl: 'app/comment-detail/comment-detail.html',
        controller: 'CommentDetailCtrl'
    });
}]);