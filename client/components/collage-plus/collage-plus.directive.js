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

            function doCollage() {
                element.collagePlus(options);
            }
            var resizeTimer = null;
            $(window).bind('resize', function() {
                // element.find('.Image_Wrapper').css("opacity", 0);
                if (resizeTimer) clearTimeout(resizeTimer);
                resizeTimer = setTimeout(doCollage, 200);
            });
            element.bind('resize', function() {
                // element.find('.Image_Wrapper').css("opacity", 0);
                if (resizeTimer) clearTimeout(resizeTimer);
                resizeTimer = setTimeout(doCollage, 200);
            });
            element.imagesLoaded(function() {
                if (resizeTimer) clearTimeout(resizeTimer);
                resizeTimer = setTimeout(doCollage, 200);
            });
        }
    };
}]);