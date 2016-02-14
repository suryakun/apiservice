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
    socket.socket.on('story:save', function(event, data) {
        if (appAuth.data.role === 'parent' && event._parent.indexOf(appAuth.data.id) !== -1) {
            ++$scope.unreadCount;
            $scope.unreadStory.push(event);
        } else if (appAuth.data.role === 'teacher' && event._cc.indexOf(appAuth.data.id) !== -1) {
            ++$scope.unreadCount;
            $scope.unreadStory.push(event);
        }
        $rootScope.$broadcast(event.type + ':created', true);
    });
    $scope.$on('$stateChangeSuccess', function(event) {
        // event.targetScope.$watch('$viewContentLoaded', function() {
        //     angular.element('html, body, #page-container').animate({
        //         scrollTop: 0
        //     }, 200);
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