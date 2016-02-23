'use strict';
angular.module('roomApp').controller('MainController', ['$scope', 'appAuth', '$state', '$modal', '$modalStack', 'socket', '$rootScope', function($scope, appAuth, $state, $modal, $modalStack, socket, $rootScope) {
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
            windowClass: 'add-status',
            openedClass: 'none',
            controller: 'Add' + type.charAt(0).toUpperCase() + type.substr(1) + 'Ctrl'
        });
        popup.result.then(function(response, status) {
            // appPopup.showResponseAPI(response, status);
            // $scope.getData();
        });
    };
    console.info('appAuth', appAuth);
    // Listeners
    $scope.notificationOpened = false;
    $scope.unreadCount = 0;
    $scope.unreadStory = [];
    socket.socket.on('story:save', function(data) {
        if (appAuth.data.role === 'parent' && data._parent.indexOf(appAuth.data.id) !== -1) {
            ++$scope.unreadCount;
            $scope.unreadStory.push(data);
        } else if (appAuth.data.role === 'teacher' && data._cc.indexOf(appAuth.data.id) !== -1) {
            ++$scope.unreadCount;
            $scope.unreadStory.push(data);
        }
        $rootScope.$broadcast(data.type + ':created', true);
    });
    socket.socket.on('reply:save', function(data) {
        if (appAuth.data.role === 'parent' && data._parent !== appAuth.data.id) {
            ++$scope.unreadCount;
            $scope.unreadStory.push(data);
        } else if (appAuth.data.role === 'teacher' && data._teacher !== appAuth.data.id) {
            ++$scope.unreadCount;
            $scope.unreadStory.push(data);
        }
    });
    $scope.$on('$stateChangeSuccess', function(event) {
        // event.targetScope.$watch('$viewContentLoaded', function() {
        //     $("html, body").animate({
        //         scrollTop: 0
        //     }, 700);
        // });
        $scope.notificationOpened = false;
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
        //***********************************BEGIN Function calls *****************************
        $('.scrollup').click(function() {
            $("html, body").animate({
                scrollTop: 0
            }, 700);
            return false;
        });
    });
}]);