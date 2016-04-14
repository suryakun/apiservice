'use strict';
angular.module('roomApp').directive('collagePlus', ['$timeout', function($timeout) {
    return {
        restrict: 'EA',
        scope: {
            options: '=collagePlus'
        },
        link: function(scope, element, attrs) {
            var options = angular.merge({
                'targetHeight': 180,
                'direction': 'horizontal'
            }, scope.options || {});
            element.imagesLoaded(function() {
                $timeout(function(){
                    element.collagePlus(options);
                }, 1000);
            });
        }
    };
}]);