'use strict';

angular.module('cmsApp')

    .filter('startFrom', function () {
        return function (input, start) {
            if (input === undefined || input === null || input.length === 0) return [];
            start = +start; //parse to int
            return input.slice(start) || [];
        }
    })

    .controller('FoundationCtrl', function ($scope, $http, $stateParams, Pagination, socket, Foundation, filterFilter, $state) {

    	$scope.params = {};
        $scope.foundations = [];
        $scope.editparams;
        $scope.search = {};
        $scope.id_delete = '';

        //get data for self
    	Foundation.getMe().success(function (data) {
    		$scope.me = data;
    	});

        //initialize data for index page
        Foundation.getData().success(function (data) {
            $scope.foundations = data;
            Foundation.foundations = $scope.foundations;
            
            // pagination controls
            $scope.currentPage = 1;
            $scope.totalItems = $scope.foundations.length;
            $scope.entryLimit = 5; // items per page
            $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);

            socket.syncUpdates('foundation', $scope.foundations);

            // $watch search to update pagination
            $scope.$watch('search', function (newVal, oldVal) {
                $scope.filtered = filterFilter($scope.foundations, newVal);
                $scope.totalItems = $scope.filtered.length;
                $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
                $scope.currentPage = 1;
                }, true);

        });

        //execute add data foundation
        $scope.addFoundation = function () {
            Foundation.create($scope.params)
                .success(function (data) {
                    alert('Foundation data has been saved');
                    $scope.params = {};
                    $scope.form.$setPristine();
                })
                .error(function () {
                    alert('something went wrong, please try again');
                });
        }

        $scope.modelSetDelete = function (id) {
            $scope.id_delete = id;
            console.log($scope.id_delete);
        }

        $scope.delete = function () {
            Foundation.delete($scope.id_delete);
        }

        if (Object.keys($stateParams).length > 0) {
            $http.get('/api/foundations/single/'+$stateParams.id)
                .success(function (foundation) {
                    console.log(foundation);
                    $scope.editparams = foundation[0];
                });
        };

        //execute update data foundation
        $scope.editFoundation = function (id) {
            Foundation.update($scope.editparams._id, $scope.editparams)
                .success(function () {
                    alert('Foundation data has been updated');
                    $scope.editparams = {};
                    $state.go('foundation');
                })
                .error(function () {
                    alert('something went wrong, please try again');
                });
        }

        $scope.closeModal = function () {
            $('.bs-example-modal-sm').modal('hide');
        }
    });