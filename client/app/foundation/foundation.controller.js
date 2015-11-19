'use strict';

angular.module('roomApp')

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

        if (Object.keys($stateParams).length > 0) {
            $scope.editparams = Foundation.foundations[$stateParams.id];
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