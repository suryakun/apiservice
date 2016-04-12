'use strict';
angular.module('roomApp').controller('MainController', ['$scope', '$rootScope', 'appAuth', '$state', '$modal', '$modalStack', 'socket', function($scope, $rootScope, appAuth, $state, $modal, $modalStack, socket) {
    // Method
    $scope.createType = null;
    $scope.onPostNewClick = function() {
        $('.create-new').slideToggle('medium');
    };
    $scope.onCreateNewClick = function(type) {
        $scope.createType = type;
    };
    $scope.onRemove = function(type) {
        $scope.createType = null;
    };
    $scope.onLogoutClick = function() {
        appAuth.logout();
        $state.go('login');
    };
    $scope.scroll = {
        distance: 0,
        disable: false
    };
    $scope.onScroll = function() {
        $rootScope.$broadcast('main:scroll', true);
    };
    // Posting Form
    $scope.openForm = function(type) {
        $modalStack.dismissAll();
        var popup = $modal.open({
            modal: false,
            animation: false,
            templateUrl: 'app/add-' + type + '/add-' + type + '.html',
            windowTemplateUrl: 'app/main/post-template.html',
            backdrop: false,
            windowClass: 'add-status display-block',
            openedClass: 'none',
            controller: 'Add' + type.charAt(0).toUpperCase() + type.substr(1) + 'Ctrl'
        });
    };
    console.info('appAuth', appAuth, $state);
    if ($state.current.name === 'main') {
        if (appAuth.data.role === 'teacher') {
            $state.go('main.activity');
        } else if (appAuth.data.role === 'parent') {
            $state.go('main.diary', {
                id: appAuth.profile._student[0]._id
            });
        }
    }
    $scope.$on('$stateChangeSuccess', function(event) {
        $('.create-new').hide(350);
        $scope.scroll.disable = false;
    });
    $scope.$on('$viewContentLoaded', function() {
        $(window).scroll(function() {
            if ($(this).scrollTop() > 100) {
                $('.scrollup').fadeIn();
            } else {
                $('.scrollup').fadeOut();
            }
        });
    });
    $scope.scrollTop = function() {
        $("html, body").animate({
            scrollTop: 0
        }, 700);
    };
}]).controller('UpdateProfilePict', ['$scope', 'Upload', '$timeout', 'socket', function($scope, Upload, $timeout, socket) {
    $scope.temp = null;
    $scope.onFileSelect = function(files) {
        $scope.temp = {
            id: 0,
            file: files[0]
        };
        $scope.updateProfile();
    };
    $scope.updateProfile = function() {
        $scope.promiseProfile = Upload.upload({
            url: '/api/users/upload-profile',
            data: angular.extend({
                files: [$scope.temp.file]
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
    /** Listeners */
    socket.socket.on('user:save', function(data) {
        console.log('user:save', data);
        // Untuk membedakan event ketika baru dan update
        // if (+new Date(data.createdAt) === +new Date(data.updatedAt)) {
        //     if (appAuth.data.role === 'parent' && data._parent.indexOf(appAuth.data.id) !== -1) {
        //         ++$scope.unreadCount;
        //         $scope.unreadStory.push(data);
        //     } else if (appAuth.data.role === 'teacher' && data._cc.indexOf(appAuth.data.id) !== -1) {
        //         ++$scope.unreadCount;
        //         $scope.unreadStory.push(data);
        //     }
        //     $rootScope.$broadcast(data.type + ':created', true);
        // }
    });
}]);