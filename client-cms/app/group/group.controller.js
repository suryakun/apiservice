'use strict';

angular.module('cmsApp')

    .filter('groupStartFrom', function () {
        return function (input, start) {
            if (input === undefined || input === null || input.length === 0) return [];
            start = +start; //parse to int
            return input.slice(start) || [];
        }
    })

    .controller('GroupCtrl', function ($scope, $http, $stateParams, Pagination, socket, Group, filterFilter, $state) {

        $scope.params = {};
        $scope.groups = [];
        $scope.editparams;
        $scope.search = {};
        $scope.id_delete = '';
        $scope.school_id = $stateParams.school_id;

        //get data for self
        Group.getMe().success(function (data) {
            $scope.me = data;
        });

        //initialize data for index page
        Group.getData($stateParams.school_id).success(function (data) {
            $scope.groups = data;
            console.log(data);return false;
            
            // pagination controls
            $scope.currentPage = 1;
            $scope.totalItems = $scope.classs.length;
            $scope.entryLimit = 5; // items per page
            $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);

            socket.syncUpdates('Class', $scope.Classs);

            // $watch search to update pagination
            $scope.$watch('search', function (newVal, oldVal) {
                $scope.filtered = filterFilter($scope.classs, newVal);
                $scope.totalItems = $scope.filtered.length;
                $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
                $scope.currentPage = 1;
                }, true);

        });

        $scope.modelSetDelete = function (id) {
            $scope.id_delete = id;
        }

        $scope.delete = function () {
            _.remove($scope.classs, {_id:$scope.id_delete});
            Class.delete($scope.id_delete);
        }

        $scope.closeModal = function () {
            $('.bs-example-modal-sm').modal('hide');
        }
    })

    .controller('ClassEditCtrl', function ($scope, $http, $stateParams, Pagination, socket, Class, Level, filterFilter, $state, $location) {
        $scope.levels = [];

        Level.getData($stateParams.school_id).success(function (data) {
            $scope.levels = data;
        });

        $scope.setAddLevel = function (id, name) {
            $scope.editparams._level = id;
            $scope.editparams.level = name;
        }

        Class.getDetail($stateParams.id)
            .success(function (Class) {
                $scope.editparams = Class[0];
            });

        //execute update data Class
        $scope.editClass = function (id) {
            Class.update($scope.editparams._id, $scope.editparams)
                .success(function () {
                    alert('Class data has been updated');
                    $location.path('/class/' + $scope.editparams._school);
                    $scope.editparams = {};
                })
                .error(function () {
                    alert('something went wrong, please try again');
                });
        }
    })

    .controller('ClassCreateCtrl', function ($scope, $http, $stateParams, Pagination, socket, Class, Level, filterFilter, $state) {
        $scope.levels = [];
        $scope.params = {};

        Level.getData($stateParams.school_id).success(function (data) {
            $scope.levels = data;
        });

        $scope.setAddLevel = function (id, name) {
            $scope.params._level = id;
            $scope.params.level = name;
        }

        //execute add data Class
        $scope.addClass = function () {
            $scope.params._school = $stateParams.school_id;
            $scope.params.active = true;
            Class.create($scope.params)
                .success(function (data) {
                    alert('Class data has been saved');
                    $scope.params = {};
                    $scope.form.$setPristine();
                })
                .error(function () {
                    alert('something went wrong, please try again');
                });
        }
    });