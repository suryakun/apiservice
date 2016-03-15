'use strict';
angular.module('roomApp').controller('ProfileCtrl', ['$scope', 'appAuth', 'AzureService', '$log', '$http', 'Upload', '$timeout', function($scope, appAuth, AzureService, $log, $http, Upload, $timeout) {
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
        $scope.promiseProfile = Upload.upload({
            url: '/api/users/upload-profile',
            data: angular.extend({
                username: $scope.profile.name
            })
        }).then(function(response) {
            $timeout(function() {
                $scope.result = response.data;
            });
            // $modalInstance.close(response);
        }, function(response) {
            if (response.status > 0) {
                $scope.errorMsg = response.status + ': ' + response.data;
            }
        }, function(evt) {
            $scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
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