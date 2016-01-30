'use strict';
angular.module('roomApp').controller('DiaryCtrl', ['$scope', 'userDetailHttp', '$http', function($scope, userDetailHttp, $http) {
    $scope.user = userDetailHttp.data;
    $scope.stories = [];
    var getData = function() {
        $scope.promise = $http.get('/api/users/get-story-filter/diary/'+ $scope.user._parent._id, {
            cache: true
        }).then(function(response) {
            $scope.stories = response.data;
        });
    };
    getData();
    // var a = apiConnector.getStories({
    //     // date: new Date()
    // }, function(response) {
    //     $scope.dataset = response;
    // }, function(response) {
    //     console.log(response);
    // });
    // $scope.getReplies = function(data) {
    //     apiConnector.getReplyStory({
    //         id: data._id
    //     }, function(response) {
    //         data.reply = response;
    //     });
    // };
    // $scope.getSingleUser = function(id, data, key) {
    //     apiConnector.getSingleUser({
    //         id: id
    //     }, function(response) {
    //         console.log(response);
    //         data[key] = response;
    //     });
    // };
    // $scope.onSubmitReply = function(data) {
    //     if (!data.newReply) {
    //         return false;
    //     }
    //     apiConnector.postReply({
    //         info: data.newReply,
    //         story_id: data._id
    //     }, function() {
    //         data.newReply = '';
    //         $scope.getReplies(data);
    //     });
    // }
}]);