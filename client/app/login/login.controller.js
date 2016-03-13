'use strict';
angular.module('roomApp').controller('LoginCtrl', ['$scope', 'appAuth', '$state', 'AzureService', '$log', function($scope, appAuth, $state, AzureService, $log) {
    // $scope.data = {
    //     email: 'adelia@kidzpotentia.sch.id',
    //     password: 'parent.adelia'
    // };
    $scope.data = {
        email: 'denia@kidzpotentia.sch.id',
        password: 'teacher.denia'
    };
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
    /**
     * Expose the login method to the view.
     */
    $scope.connectMicrosoft = function() {
        $log.debug('Connecting to Office 365...');
        AzureService.login();
    };
}]).controller('CallbackCtrl', ['$scope', 'appAuth', '$state', 'adalAuthenticationService', '$log', function($scope, appAuth, $state, adalAuthenticationService, $log) {
    (function activate() {
        if (adalAuthenticationService.userInfo.isAuthenticated) {
            $log.debug('adalAuthenticationService.userInfo.isAuthenticated');
            // var activeSnippet = vm.snippetGroups[0].snippets[0];
            // var tenant = adalAuthenticationService.userInfo.userName.split('@')[1];
            $log.debug(adalAuthenticationService)
        }
    })();
}]).factory('AzureService', ['$window', '$q', '$log',
    function($window, $q, $log) {
        var deferred = null;
        $window.authOk = function(data) {
            $log.debug('authOk', data);
            if (deferred) {
                if (data) {
                    deferred.resolve(data);
                } else {
                    deferred.reject('Token not available');
                }
            }
        };
        $window.authDenied = function(error) {
            $log.debug('authDenied', error);
            if (deferred) {
                deferred.reject(error);
            }
        };
        $window.authClose = function() {
            $log.debug('authClose');
            if (deferred) {
                deferred.notify('Auth closed');
            }
        };
        var obj = {
            login: function() {
                deferred = $q.defer();
                var url = '/auth/azure';
                $window.open(url, "azure_connect", "width=600,height=400");
                return deferred.promise;
            }
        };
        return obj;
    }
]);