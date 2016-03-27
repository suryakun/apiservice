'use strict';
angular.module('roomApp').controller('MainController', ['$scope', 'appAuth', '$state', '$modal', '$modalStack', 'socket', function($scope, appAuth, $state, $modal, $modalStack, socket) {
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
}]).controller('NotificationController', ['$scope', 'appAuth', '$state', 'socket', '$rootScope', '$http', function($scope, appAuth, $state, socket, $rootScope, $http) {
    $scope.notificationOpened = false;
    $scope.unreadCount = 0;
    $scope.unreadStory = [];
    var getData = function() {
        $scope.promise = $http.get('/api/users/unread-stories', {
            cache: false
        }).then(function(response) {
            $scope.unreadCount = response.data.count;
            $scope.unreadStory = response.data.data;
        });
    };
    $scope.gotoDetail = function(story) {
        if (story.type === 'info') {
            $state.go('main.info-detail', {
                id: story._id
            });
        } else if (story.type === 'portfolio') {
            $state.go('main.portfolio-detail', {
                id: story._id
            });
        } else {
            $state.go('main.comment-detail', {
                id: story._id
            });
        }
    };
    $scope.$on('$stateChangeSuccess', function(event) {
        $scope.notificationOpened = false;
    });
    socket.socket.on('story:save', function(data) {
        // console.info('story:save', data);
        // Untuk membedakan event ketika baru dan update
        if (+new Date(data.createdAt) === +new Date(data.updatedAt)) {
            if (appAuth.data.role === 'parent' && data._parent.indexOf(appAuth.data.id) !== -1) {
                ++$scope.unreadCount;
                $scope.unreadStory.push(data);
            } else if (appAuth.data.role === 'teacher' && data._cc.indexOf(appAuth.data.id) !== -1) {
                ++$scope.unreadCount;
                $scope.unreadStory.push(data);
            }
            $rootScope.$broadcast(data.type + ':created', true);
        }
    });
    // socket.socket.on('reply:save', function(data) {
    //     if (appAuth.data.role === 'parent' && data._parent !== appAuth.data.id) {
    //         ++$scope.unreadCount;
    //         $scope.unreadStory.push(data);
    //     } else if (appAuth.data.role === 'teacher' && data._teacher !== appAuth.data.id) {
    //         ++$scope.unreadCount;
    //         $scope.unreadStory.push(data);
    //     }
    // });
    // Listener for update notification readed
    $scope.$on('story:read', function(event, story){
        if(_.find($scope.unreadStory, {_id: story._id})) {
            console.log(story);
            (function() {
                $scope.promise = $http.post('/api/stories/read-story', {
                    story_id: story._id,
                    user_id: appAuth.profile._id
                }).then(function(response) {
                    _.remove($scope.unreadStory, {_id: story._id});
                    --$scope.unreadCount;
                });
            })();
        }
    });
    getData();
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