'use strict';

angular.module('roomApp')

    .filter('schoolStartFrom', function () {
        return function (input, start) {
            if (input === undefined || input === null || input.length === 0) return [];
            start = +start; //parse to int
            return input.slice(start) || [];
        }
    })

    .controller('SchoolCtrl', function ($scope, $http, $stateParams, Pagination, socket, School, filterFilter, $state) {

    	$scope.params = {};
        $scope.schools = [];
        $scope.editparams;
        $scope.search = {};
        $scope.id_delete = '';
        $scope.found_id = $stateParams.found_id;

        //get data for self
        School.getMe().success(function (data) {
            $scope.me = data;
        });

        //initialize data for index page
        School.getData($scope.found_id).success(function (data) {
            $scope.schools = data;
            
            // pagination controls
            $scope.currentPage = 1;
            $scope.totalItems = $scope.schools.length;
            $scope.entryLimit = 5; // items per page
            $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);

            socket.syncUpdates('School', $scope.Schools);

            // $watch search to update pagination
            $scope.$watch('search', function (newVal, oldVal) {
                $scope.filtered = filterFilter($scope.schools, newVal);
                $scope.totalItems = $scope.filtered.length;
                $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
                $scope.currentPage = 1;
                }, true);

        });

        $scope.modelSetDelete = function (id) {
            $scope.id_delete = id;
        }

        $scope.delete = function () {
            _.remove($scope.schools, {_id:$scope.id_delete});
            School.delete($scope.id_delete);
        }

        $scope.closeModal = function () {
            $('.bs-example-modal-sm').modal('hide');
        }
    })

    .controller('SchoolEditCtrl', function ($scope, $http, $stateParams, Pagination, socket, School, filterFilter, $state) {
        $http.get('/api/schools/single/'+ $stateParams.id)
            .success(function (School) {
                $scope.editparams = School[0];
            });

        //execute update data School
        $scope.editSchool = function (id) {
            School.update($scope.editparams._id, $scope.editparams)
                .success(function () {
                    alert('School data has been updated');
                    $scope.editparams = {};
                    $state.go('school');
                })
                .error(function () {
                    alert('something went wrong, please try again');
                });
        }
    })

    .controller('SchoolCreateCtrl', function ($scope, $http, $stateParams, Pagination, socket, School, filterFilter, $state) {
        //execute add data School
        $scope.addSchool = function () {
            $scope.params._foundation = $stateParams.found_id;
            $scope.params.active = true;
            School.create($scope.params)
                .success(function (data) {
                    alert('School data has been saved');
                    $scope.params = {};
                    $scope.form.$setPristine();
                })
                .error(function () {
                    alert('something went wrong, please try again');
                });
        }
    })

    .controller('SchoolDashboardCtrl', function ($scope, $http, $stateParams, Pagination, socket, School, filterFilter, $state) {
        //execute add data School
        School.getDetail($stateParams.school_id)
            .success(function (data) {
                $scope.school = data;
            })
            .error(function () {
                alert('something went wrong, please try again');
            });

    });