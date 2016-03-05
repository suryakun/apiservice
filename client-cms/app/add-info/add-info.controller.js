'use strict';
angular.module('roomApp').controller('AddInfoCtrl', ['$modalInstance', '$scope', 'Upload', 'appConfig', 'appAuth', '$q', '$timeout', 'apiConnector', function($modalInstance, $scope, Upload, appConfig, appAuth, $q, $timeout, apiConnector) {
    $scope.data = {
        type: 'info',
        info: '',
        class_id: [],
        parent: 0,
        cc: []
    };
    $scope.receipents = [];
    apiConnector.getClasses(function(response) {
        response.forEach(function(value, index) {
            $scope.receipents.push(angular.merge(value, {
                _dataType: 'class'
            }));
        });
    });
    apiConnector.getGroups(function(response) {
        response.forEach(function(value, index) {
            $scope.receipents.push(angular.merge(value, {
                _dataType: 'group'
            }));
        });
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
    $scope.receipentIds = [];
    var selectedReceipents = [];
    $scope.$watch('receipentIds', function(newValue) {
        selectedReceipents = [];
        newValue.forEach(function(id) {
            selectedReceipents.push(_.find($scope.receipents, {
                _id: id
            }));
        });
    });
    $scope.onPostBtnClick = function(files) {
        $scope.data.cc = [];
        $scope.teachers.forEach(function(teacher) {
            if (teacher.checked) {
                $scope.data.cc.push(teacher._id);
            };
        });
        if (selectedReceipents && selectedReceipents.length) {
            $scope.data.class_id = [];
            $scope.data.group = [];
            selectedReceipents.forEach(function(value) {
                if (value._dataType === 'class') {
                    $scope.data.class_id.push(value._id);
                } else if (value._dataType === 'group') {
                    $scope.data.group.push(value._id);
                }
            });
            $scope.data.class_id = $scope.data.class_id.length ? $scope.data.class_id.toString() : 0;
            if ($scope.data.group.length) {
                $scope.data.group = $scope.data.group.toString();
            } else {
                delete $scope.data.group;
            }
        }
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