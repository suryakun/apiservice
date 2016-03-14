'use strict';
angular.module('roomApp').controller('ProfileCtrl', ['$scope', 'appAuth', 'AzureService', '$log', '$http', function($scope, appAuth, AzureService, $log, $http) {
    /** Update Profile */
    $scope.profile = angular.copy(appAuth.profile);
    $scope.connectMicrosoft = function() {
        $log.debug('Connecting to Office 365...');
        AzureService.connect().then(function(data) {
            profile.azure = data;
        }, function(data) {
            alert(data.error);
        });
    };
    $scope.updateProfile = function() {
        if (true) {
            $scope.promiseProfile = $http.post('/api/update-user/' + appAuth.profile._id, $scope.profile).then(function() {});
        } else {
            alert('Invalid data');
        }
    };
    /** Update Password */
    $scope.password = null;
    $scope.updatePassword = function() {
        if ($scope.password && $scope.password.oldPassword && $scope.password.newPassword === $scope.password.confirmPassword) {
            $scope.promisePassword = $http.put('/api/users/' + appAuth.profile._id + '/password', $scope.password).then(function() {
                $scope.password = null;
            }, function() {
                alert('Update failed'); 
            });
    } else {
        alert('Invalid data');
    }
};
}]);