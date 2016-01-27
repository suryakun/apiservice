'use strict';
angular.module('roomApp').config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('main.diary', {
        url: 'diary',
        templateUrl: 'app/diary/diary.html',
        controller: 'DiaryCtrl',
        containerClass: 'no-cover'
    });
}]);