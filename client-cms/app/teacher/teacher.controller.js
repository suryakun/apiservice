'use strict';

angular.module('cmsApp')

    .filter('parentStartFrom', function () {
        return function (input, start) {
            if (input === undefined || input === null || input.length === 0) return [];
            start = +start; //parse to int
            return input.slice(start) || [];
        }
    })

    .controller('TeacherCtrl', function ($scope, $http, $stateParams, Pagination, socket, Teacher, filterFilter, $state) {

    	$scope.params = {};
        $scope.classs = [];
        $scope.editparams;
        $scope.search = {};
        $scope.id_delete = '';
        $scope.school_id = $stateParams.school_id;

        //get data for self
        Teacher.getMe().success(function (data) {
            $scope.me = data;
        });

        //initialize data for index page
        Teacher.getData($stateParams.school_id).success(function (data) {
            console.log(data);
            $scope.teachers = data;
            
            // pagination controls
            $scope.currentPage = 1;
            $scope.totalItems = $scope.teachers.length;
            $scope.entryLimit = 10; // items per page
            $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);

            socket.syncUpdates('User', $scope.parents);

            // $watch search to update pagination
            $scope.$watch('search', function (newVal, oldVal) {
                $scope.filtered = filterFilter($scope.teachers, newVal);
                $scope.totalItems = $scope.filtered.length;
                $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
                $scope.currentPage = 1;
                }, true);
        }).error(function (err) {
            console.log(err);
        });



        $scope.modelSetDelete = function (student) {
            $scope.id_delete = student;
        }

        $scope.delete = function () {
            _.remove($scope.teachers, {_id:$scope.id_delete});
            Teacher.delete($scope.id_delete);
        }

        $scope.closeModal = function () {
            $('.bs-example-modal-sm').modal('hide');
        }
    })

    .controller('TeacherEditCtrl', function ($scope, $http, $stateParams, Pagination, socket, Teacher, Level, filterFilter, $state, $location, $window) {

        Teacher.getDetail($stateParams.id)
            .success(function (parent) {
                $scope.editparams = parent;
            });

        //execute update data Class
        $scope.editParent = function (id) {
            Teacher.update($scope.editparams._id, $scope.editparams)
                .success(function () {
                    alert('Teacher data has been updated');
                    $scope.editparams = {};
                    $window.history.back();
                })
                .error(function () {
                    alert('something went wrong, please try again');
                });
        }
    })

    .controller('TeacherCreateCtrl', function ($scope, $http, $stateParams, Pagination, socket, Class, Teacher, Parent, Level, filterFilter, $state) {
        $scope.params = {};
        $scope.classes = [];

        Class.getData($stateParams.school_id).success(function (data) {
            $scope.classes = data;
        })

        Teacher.getData($stateParams.school_id).success(function (data) {
            $scope.students = data;
        });

        //execute add data Class
        $scope.addTeacher = function () {
            Teacher.create($scope.params)
                .success(function (data) {
                    alert('Teacher data has been saved');
                    $scope.params = {};
                    $scope.form.$setPristine();
                })
                .error(function () {
                    alert('something went wrong, please try again');
                });
        }
    });