'use strict';
angular.module('roomApp').controller('AddInfoCtrl', ['$modalInstance', '$rootScope', '$scope', 'Upload', 'appConfig', 'appAuth', '$q', '$timeout', 'apiConnector', function($modalInstance, $rootScope, $scope, Upload, appConfig, appAuth, $q, $timeout, apiConnector) {
    $scope.data = {
        type: 'info',
        info: '',
        class_id: [],
        parent: 0,
        cc: []
    };
    $scope.receipents = [];
    apiConnector.getClasses(function(response) {
        $scope.receipents = $scope.receipents.concat(response);
    });
    $scope.teachers = [];
    apiConnector.getTeachers(function(response) {
        $scope.teachers = response;
    });
    $scope.onMinimize = function() {
        angular.element('.tab-content').toggle();
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
        $scope.data.cc = [];
        $scope.teachers.forEach(function(teacher) {
            if (teacher.checked) {
                $scope.data.cc.push(teacher._id);
            };
        });
        $scope.data.class_id = $scope.data.class_id.toString();
        $scope.data.cc = $scope.data.cc.toString();
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
            $rootScope.$broadcast('info:created', true);
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
    };
}]);