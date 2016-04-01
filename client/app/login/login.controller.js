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
    $scope.responseCode = undefined;
    $scope.onFormSubmit = function(form) {
        if (form.$valid) {
            $scope.responseCode = undefined;
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
                $scope.responseCode = response.status;
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
            $scope.promise = appAuth.getMe().then(function(me) {
                if (appAuth.data.role === 'teacher') {
                    $state.go('main.activity');
                } else if (appAuth.data.role === 'parent') {
                    $state.go('main.diary', {
                        id: appAuth.profile._student[0]._id
                    });
                }
            });
        }, function(data) {
            $state.go('info', { 
                email: data.email
            });
        });
    };
}]).controller('CallbackCtrl', ['$scope', 'appAuth', '$state', 'AzureService', '$log', function($scope, appAuth, $state, AzureService, $log) {
    console.log($state);
    if($state.params.token) {
        // appAuth.setData({
        //     authenticated: true,
        //     token: $state.params.token,
        //     role: AUTHConfig.userRoles['teacher'],
        //     expires: (new Date()).setSeconds(24 * 60 * 60),
        //     data: data
        // });
        // $scope.promise = appAuth.getMe().then(function(me) {
        //     if (appAuth.data.role === 'teacher') {
        //         $state.go('main.activity');
        //     } else if (appAuth.data.role === 'parent') {
        //         $state.go('main.diary', {
        //             id: appAuth.profile._student[0]._id
        //         });
        //     }
        // });
    }
}]);