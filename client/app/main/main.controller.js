'use strict';
(function() {
    class MainController {
        constructor($scope, appAuth, $state, $modal, $modalStack) {
            // Listeners
            $scope.$on('$stateChangeSuccess', function(event) {
                // event.targetScope.$watch('$viewContentLoaded', function() {
                //     angular.element('html, body, #page-container').animate({
                //         scrollTop: 0
                //     }, 200);
                // });
                $('.create-new').hide(350);
            });
            // Method
            $scope.createType = null;
            $scope.onPostNewClick = function() {
                $('.create-new').slideToggle('medium');
            };
            $scope.onCreateNewClick = function(type) {
                $scope.createType = type;
            };
            $scope.onRemove = function(type) {
                console.log(type);
                $scope.createType = null;
            };
            $scope.onLogoutClick = function() {
                appAuth.logout();
                $state.go('login');
            };
            // Import Data
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
                    resolve: {
                        // pageInformation: function() {
                        //     return $scope.pageInformation;
                        // },
                        // districtDetail: function() {
                        //     return row;
                        // },
                        // canUpdate: function() {
                        //     return true;
                        // }
                    },
                    controller: 'Add' + type.charAt(0).toUpperCase() + type.substr(1) + 'Ctrl'
                });
                popup.result.then(function(response, status) {
                    // appPopup.showResponseAPI(response, status);
                    // $scope.getData();
                });
            };
        }
    }
    angular.module('roomApp').controller('MainController', MainController);
})();