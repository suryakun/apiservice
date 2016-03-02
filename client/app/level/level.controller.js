'use strict';

angular.module('cmsApp')

    .filter('levelStartFrom', function () {
        return function (input, start) {
            if (input === undefined || input === null || input.length === 0) return [];
            start = +start; //parse to int
            return input.slice(start) || [];
        }
    })

    .controller('LevelCtrl', function ($scope, $http, $stateParams, Pagination, socket, Level, filterFilter, $state) {

    	$scope.params = {};
        $scope.levels = [];
        $scope.editparams;
        $scope.search = {};
        $scope.id_delete = '';
        $scope.school_id = $stateParams.school_id;

        //get data for self
        Level.getMe().success(function (data) {
            $scope.me = data;
        });

        //initialize data for index page
        Level.getData($stateParams.school_id).success(function (data) {
            $scope.levels = data;
            
            // pagination controls
            $scope.currentPage = 1;
            $scope.totalItems = $scope.levels.length;
            $scope.entryLimit = 5; // items per page
            $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);

            socket.syncUpdates('Level', $scope.Levels);

            // $watch search to update pagination
            $scope.$watch('search', function (newVal, oldVal) {
                $scope.filtered = filterFilter($scope.levels, newVal);
                $scope.totalItems = $scope.filtered.length;
                $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
                $scope.currentPage = 1;
                }, true);

        });

        $scope.modelSetDelete = function (id) {
            $scope.id_delete = id;
        }

        $scope.delete = function () {
            _.remove($scope.levels, {_id:$scope.id_delete});
            Level.delete($scope.id_delete);
        }

        $scope.closeModal = function () {
            $('.bs-example-modal-sm').modal('hide');
        }
    })

    .controller('LevelEditCtrl', function ($scope, $http, $stateParams, Pagination, socket, Level, filterFilter, $state, $location) {
        $http.get('/api/levels/single/'+ $stateParams.id)
            .success(function (Level) {
                $scope.editparams = Level[0];
                console.log($scope.editparams);
            });

        //execute update data Level
        $scope.editLevel = function (id) {
            Level.update($scope.editparams._id, $scope.editparams)
                .success(function () {
                    alert('Level data has been updated');
                    $location.path('/level/' + $scope.editparams._school);
                    $scope.editparams = {};
                })
                .error(function () {
                    alert('something went wrong, please try again');
                });
        }
    })

    .controller('LevelCreateCtrl', function ($scope, $http, $stateParams, Pagination, socket, Level, filterFilter, $state) {
        //execute add data Level
        $scope.addLevel = function () {
            $scope.params._school = $stateParams.school_id;
            $scope.params.active = true;
            Level.create($scope.params)
                .success(function (data) {
                    alert('Level data has been saved');
                    $scope.params = {};
                    $scope.form.$setPristine();
                })
                .error(function () {
                    alert('something went wrong, please try again');
                });
        }
    });