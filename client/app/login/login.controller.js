'use strict';
angular.module('roomApp').controller('LoginCtrl', ['$scope', 'appAuth', '$state', 'adalAuthenticationService', '$log', function($scope, appAuth, $state, adalAuthenticationService, $log) {
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
                        $state.go('main.diary', {id: appAuth.profile._student[0]._id });
                    }
                });
            }, function(response) {
                console.log(response);
            });
        }
    };


    /**
     * This function does any initialization work the 
     * controller needs.
     */
    (function activate() {
        if (adalAuthenticationService.userInfo.isAuthenticated) {
            console.log('adalAuthenticationService.userInfo.isAuthenticated');
            // var activeSnippet = vm.snippetGroups[0].snippets[0];
            
            // var tenant = adalAuthenticationService.userInfo.userName.split('@')[1];
            console.log(adalAuthenticationService)
        }
    })();

    /**
     * Expose the login method to the view.
     */
    $scope.connectMicrosoft  = function () {
        $log.debug('Connecting to Office 365...');
        adalAuthenticationService.login();
    };
    
    /**
     * Expose the logOut method to the view.
     */
    $scope.disconnectMicrosoft = function () {
        $log.debug('Disconnecting from Office 365...');
        adalAuthenticationService.logOut();
    };

}]);