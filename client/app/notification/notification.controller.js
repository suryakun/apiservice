'use strict';
angular.module('roomApp').controller('NotificationCtrl', ['$scope', 'appAuth', '$state', 'socket', '$rootScope', '$http', function($scope, appAuth, $state, socket, $rootScope, $http) {
    $scope.notificationOpened = false;
    $scope.unreadCount = 0;
    $rootScope.unreadStory = [];
    var getData = function() {
        $scope.promise = $http.get('/api/users/unread-stories', {
            cache: false
        }).then(function(response) {
            $scope.unreadCount = response.data.count;
            $rootScope.unreadStory = response.data.data;
        });
    };
    $rootScope.gotoDetail = function(story) {
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
                $rootScope.unreadStory.push(data);
            } else if (appAuth.data.role === 'teacher' && data._cc.indexOf(appAuth.data.id) !== -1) {
                ++$scope.unreadCount;
                $rootScope.unreadStory.push(data);
            }
            $rootScope.$broadcast(data.type + ':created', true);
        }
    });
    // socket.socket.on('reply:save', function(data) {
    //     if (appAuth.data.role === 'parent' && data._parent !== appAuth.data.id) {
    //         ++$scope.unreadCount;
    //         $rootScope.unreadStory.push(data);
    //     } else if (appAuth.data.role === 'teacher' && data._teacher !== appAuth.data.id) {
    //         ++$scope.unreadCount;
    //         $rootScope.unreadStory.push(data);
    //     }
    // });
    // Listener for update notification readed
    $scope.$on('story:read', function(event, story) {
        if (_.find($rootScope.unreadStory, {
                _id: story._id
            })) {
            (function() {
                $scope.promise = $http.post('/api/stories/read-story', {
                    story_id: story._id,
                    user_id: appAuth.profile._id
                }).then(function(response) {
                    _.remove($rootScope.unreadStory, {
                        _id: story._id
                    });
                    --$scope.unreadCount;
                });
            })();
        }
    });
    getData();
}]).controller('NotificationPageCtrl', ['$scope', function($scope) {
    
}]);