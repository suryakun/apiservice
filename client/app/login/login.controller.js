'use strict';
angular.module('roomApp').controller('LoginCtrl', ['$scope', 'appAuth', '$state', 'apiConnector', function($scope, appAuth, $state, apiConnector) {
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
}]);