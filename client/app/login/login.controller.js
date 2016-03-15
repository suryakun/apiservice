'use strict';
angular.module('roomApp').controller('LoginCtrl', ['$scope', 'appAuth', '$state', 'AzureService', '$log', function($scope, appAuth, $state, AzureService, $log) {
    // $scope.data = {
    //     email: 'adelia@kidzpotentia.sch.id',
    //     password: 'parent.adelia'
    // };
    // $scope.data = {
    //     email: 'denia@kidzpotentia.sch.id',
    //     password: 'teacher.denia'
    // };
    $scope.onFormSubmit = function(form) {
        if (form.$valid) {
            $scope.promise = appAuth.login($scope.data).then(function(response) {
                appAuth.getMe().then(function(me) {
                    if (appAuth.data.role === 'teacher') {
                        $state.go('main.activity');
                    } else if (appAuth.data.role === 'parent') {
                        $state.go('main.diary', {
                            id: appAuth.profile._student[0]._id
                        });
                    }
                });
            }, function(response) {
                console.log(response);
            });
        }
    };
    $scope.connectMicrosoft = function() {
        $log.debug('Connecting to Office 365...');
        AzureService.login().then(function(data){
            appAuth.setData({
                authenticated: true,
                token: data.token,
                role: AUTHConfig.userRoles[data.role || 'teacher'],
                expires: (new Date()).setSeconds(24 * 60 * 60),
                data: data
            });
            setTimeout(function(){
                appAuth.getMe().then(function(me) {
                    if (appAuth.data.role === 'teacher') {
                        $state.go('main.activity');
                    } else if (appAuth.data.role === 'parent') {
                        $state.go('main.diary', {
                            id: appAuth.profile._student[0]._id
                        });
                    }
                });
            }, 2000);
        }, function(data) {
            alert(data.error);
        });
    };
}]);