'use strict';

angular.module('cmsApp')

    .filter('parentStartFrom', function () {
        return function (input, start) {
            if (input === undefined || input === null || input.length === 0) return [];
            start = +start; //parse to int
            return input.slice(start) || [];
        }
    })

    .controller('ParentCtrl', function ($scope, $http, $stateParams, Pagination, socket, Parent, filterFilter, $state) {

    	$scope.params = {};
        $scope.classs = [];
        $scope.editparams;
        $scope.search = {};
        $scope.id_delete = '';
        $scope.school_id = $stateParams.school_id;

        //get data for self
        Parent.getMe().success(function (data) {
            $scope.me = data;
        });

        //initialize data for index page
        Parent.getData($stateParams.school_id).success(function (data) {
            console.log(data);
            $scope.students = data;
            
            // pagination controls
            $scope.currentPage = 1;
            $scope.totalItems = $scope.students.length;
            $scope.entryLimit = 10; // items per page
            $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);

            socket.syncUpdates('User', $scope.parents);

            // $watch search to update pagination
            $scope.$watch('search', function (newVal, oldVal) {
                $scope.filtered = filterFilter($scope.students, newVal);
                $scope.totalItems = $scope.filtered.length;
                $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
                $scope.currentPage = 1;
                }, true);
        }).error(function (err) {
            console.log(err);
        });



        $scope.modelSetDelete = function (student) {
            $scope.student_delete = student;
        }

        $scope.delete = function () {
            _.remove($scope.students, {_id:$scope.student_delete._id});
            Parent.delete($scope.student_delete._id);
            Parent.delete($scope.student_delete._parent._id);
        }

        $scope.closeModal = function () {
            $('.bs-example-modal-sm').modal('hide');
        }
    })

    .controller('ParentEditCtrl', function ($scope, $http, $stateParams, Pagination, socket, Parent, Level, filterFilter, $state, $location, $window) {

        Parent.getDetail($stateParams.id)
            .success(function (parent) {
                console.log(parent);
                $scope.editparams = parent;
            });

        //execute update data Class
        $scope.editParent = function (id) {
            console.log($scope.editparams._id);
            Parent.update($scope.editparams._id, $scope.editparams)
                .success(function () {
                    alert('Parent data has been updated');
                    $scope.editparams = {};
                    $window.history.back();
                })
                .error(function () {
                    alert('something went wrong, please try again');
                });
        }
    })

    .controller('ParentCreateCtrl', function ($scope, $http, $stateParams, Pagination, socket, Class, Parent, Level, filterFilter, $state) {
        $scope.params = {};
        $scope.classes = [];

        Class.getData($stateParams.school_id).success(function (data) {
            $scope.classes = data;
        })

        Parent.getData($stateParams.school_id).success(function (data) {
            $scope.students = data;
        });

        //execute add data Class
        $scope.addParent = function () {
            $scope.params._school = $stateParams.school_id;
            $scope.params.active = true;
            Parent.create($scope.params)
                .success(function (data) {
                    alert('Parent data has been saved');
                    $scope.params = {};
                    $scope.form.$setPristine();
                })
                .error(function () {
                    alert('something went wrong, please try again');
                });
        }
    });