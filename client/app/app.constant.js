(function(angular, undefined) {
'use strict';

angular.module('roomApp.constants', [])

.constant('appConfig', {userRoles:['guest','user','admin'],baseAPIUrlProduction:'http://api7pagi.cloudapp.net:8080',baseAPIUrl:''})

;
})(angular);