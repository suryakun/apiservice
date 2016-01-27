'use strict';
angular.module('roomApp').controller('LoginCtrl', ['$scope', 'appAuth', '$state', 'apiConnector', function($scope, appAuth, $state, apiConnector) {
    // $scope.data = {
    //     email: 'giftan@kidzpotentia.sch.id',
    //     password: 'parent.giftan'
    // };
    $scope.data = {
        email: 'denia@kidzpotentia.sch.id',
        password: 'teacher.denia'
    };
    $scope.onFormSubmit = function(form) {
        if (form.$valid) {
            $scope.promise = appAuth.login($scope.data).then(response => {
                appAuth.getMe().then(function(me) {
                    if (appAuth.data.role === 'teacher') {
                        $state.go('main.activity');
                    } else {
                        $state.go('main.diary');
                    }
                });
            }, response => {
                console.log(response);
            });
        }
    };
}]);