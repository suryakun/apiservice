(function(angular, undefined) {
'use strict';

angular.module('roomApp.constants', [])

.constant('appConfig', {userRoles:['guest','user','admin'],baseAPIUrlProduction:'http://api7pagi.cloudapp.net:8080',baseAPIUrl:'http://13.76.217.128:8080'})

;
})(angular);