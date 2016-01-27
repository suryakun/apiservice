'use strict';
angular.module('roomApp').directive('collagePlus', [function() {
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
                element.collagePlus(options);
            });
        }
    };
}]);