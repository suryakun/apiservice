'use strict';
angular.module('roomApp').controller('AddDiaryCtrl', ['$modalInstance', '$scope', 'Upload', 'appConfig', 'appAuth', '$q', '$timeout', 'apiConnector', function($modalInstance, $scope, Upload, appConfig, appAuth, $q, $timeout, apiConnector) {
    $scope.onMinimize = function() {
        angular.element('.tab-content').toggle();
    };
    $scope.groups = [];
    apiConnector.getGroups(function(response) {
        $scope.groups = response;
    });
    $scope.parents = [];
    apiConnector.getParents(function(response) {
        $scope.parents = response;
    });
    $scope.teachers = [];
    apiConnector.getTeachers(function(response) {
        $scope.teachers = response;
    });
    $scope.data = {
        type: 'diary',
        info: '',
        class_id: null,
        parent: 0
            // cc: []
    };
    $scope.files = [];
    $scope.removeFromQueue = function(index) {
        $scope.files.splice(index, 1);
    };
    $scope.onFileSelect = function(files) {
        files.forEach(function(file, key) {
            $scope.files.push({
                id: key,
                file: file
            });
        });
    };
    $scope.onPostBtnClick = function(files) {
        // if ($scope.files && $scope.files.length) {
        Upload.upload({
            url: appConfig.baseAPIUrl + '/api/stories',
            headers: {
                Authorization: 'Bearer ' + appAuth.token,
                user_id: appAuth.data.id
            },
            data: angular.extend({
                files: $scope.files.map(function(item) {
                    return item.file;
                })
            }, $scope.data)
        }).then(function(response) {
            $timeout(function() {
                $scope.result = response.data;
            });
            $modalInstance.close(response);
        }, function(response) {
            if (response.status > 0) {
                $scope.errorMsg = response.status + ': ' + response.data;
            }
        }, function(evt) {
            $scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
        // } else {
        //     apiConnector.postStory($scope.data, function() {
        //         console.info(arguments);
        //     }, function() {
        //         console.warn(arguments);
        //     });
        // }
    };
}]);