'use strict';
angular.module('roomApp', ['roomApp.constants', 'ngCookies', 'ngResource', 'ngSanitize', 'ui.router', 'ui.select2', 'ui.bootstrap', 'colorbox', 'ngFileUpload', 'angular-moment', 'cgBusy', 'btford.socket-io', 'ngSanitize']).config(['$urlRouterProvider', '$locationProvider', '$httpProvider', function($urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/activity');
    $locationProvider.html5Mode(true);
    /**
     * Setup CORS
     */
    $httpProvider.defaults.withCredentials = false;
    $httpProvider.defaults.useXDomain = false;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    /**
     * Setup API
     */
    $httpProvider.defaults.headers.get = {
        'Accept': '*/*',
        'Content-Type': 'application/json;charset=utf-8;'
    };
    $httpProvider.defaults.headers.post = {
        'Accept': '*/*',
        'Content-Type': 'application/json;charset=utf-8;'
    };
    $httpProvider.defaults.headers['delete'] = {
        'Accept': '*/*',
        'Content-Type': 'application/json;charset=utf-8;'
    };
    $httpProvider.defaults.headers.patch = {
        'Accept': '*/*',
        'Content-Type': 'application/json;charset=utf-8;'
    };
    $httpProvider.interceptors.push('authInterceptor');
    // https://code.angularjs.org/1.4.8/docs/api/ng/service/$http
    $httpProvider.useLegacyPromiseExtensions = false;
}]).run(['$rootScope', '$state', '$stateParams', 'appAuth', function($rootScope, $state, $stateParams, appAuth) {
    $rootScope.containerClass = null;
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.appAuth = appAuth;
    $rootScope.preventDefault = function($event) {
        console.log('preventDefault', $event);
        $event.preventDefault();
    };
    $rootScope.$on('$stateChangeSuccess', function(event, toState) {
        event.targetScope.$watch('$viewContentLoaded', function() {
            angular.element('html, body, #page-container').animate({
                scrollTop: 0
            }, 200);
            // setTimeout(function () {
            //   angular.element('#wrap').css('visibility','visible');
            //   if (!angular.element('.dropdown').hasClass('open')) {
            //     angular.element('.dropdown').find('>ul').slideUp();
            //   }
            // }, 200);
        });
        $rootScope.containerClass = toState.containerClass || '';
    });
    /**
     * RBAC
     */
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        /**
         * Cegah akses ke halaman anon untuk user yang sudah login
         */
        if (toState.data && toState.data.accessLevel === AUTHConfig.accessLevels.anon && appAuth.authenticated === true) {
            // angular.element('#pageloader').toggleClass('hide animate');
            event.preventDefault();
            if (appAuth.data.role === 'teacher') {
                $state.go('main.activity');
            } else {
                $state.go('main.diary');
            }
        } else if (toState.data && !appAuth.authorize(toState.data.accessLevel || AUTHConfig.accessLevels.public)) {
            event.preventDefault();
            // angular.element('#pageloader').toggleClass('hide animate');
            console.warn('Page Access Denied', toState, fromState.url);
            return $state.go(toState.data.loginState, {
                backTo: $state.href(toState.name, null, {
                    absolute: true
                })
            });
        }
    });
}]).factory('authInterceptor', function($rootScope, $q, $store, $location) {
    return {
        // Add authorization token to headers
        request: function(config) {
            if (config.url.indexOf('/api') === 0 && config.url.indexOf('/auth') === -1) {
                config.headers = config.headers || {};
                if ($store.get('token')) {
                    config.headers.Authorization = 'Bearer ' + $store.get('token');
                }
                if ($store.get('data')) {
                    config.headers.user_id = $store.get('data').id;
                }
            }
            return config;
        },
        // Intercept 401s and redirect you to login
        responseError: function(response) {
            if (response.status === 401) {
                $location.path('/login');
                // remove any stale tokens
                $store.remove('token');
                return $q.reject(response);
            } else {
                return $q.reject(response);
            }
        }
    };
}).filter('apiFile', function(appConfig) {
    return function(input, folder) {
        var baseUrl = appConfig.baseAPIUrl + '/upload/' + folder;
        if (input && input.indexOf('http') !== 0 && input.indexOf('data:image') !== 0) {
            return baseUrl + (input.charAt(0) === '/' ? '' : '/') + input;
        } else {
            return input;
        }
    };
}).value('cgBusyDefaults', {
    message: 'Please wait..',
    backdrop: true,
    // templateUrl: 'my_custom_template.html',
    delay: 0,
    minDuration: 700,
    // wrapperClass: 'my-class my-class2'
}).directive('ngThumb', ['$window', function($window) {
    var helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile: function(item) {
            return angular.isObject(item) && item instanceof $window.File;
        },
        isImage: function(file) {
            var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    };
    return {
        restrict: 'A',
        template: '<img/>',
        // template: '<canvas/>',
        replace: true,
        link: function(scope, element, attributes) {
            if (!helper.support) return;
            var params = scope.$eval(attributes.ngThumb);
            if (!helper.isFile(params.file)) return;
            if (!helper.isImage(params.file)) return;
            var canvas = element.find('canvas');
            var reader = new FileReader();
            reader.onload = onLoadFile;
            reader.readAsDataURL(params.file);

            function onLoadFile(event) {
                // var img = new Image();
                // img.onload = onLoadImage;
                // img.src = event.target.result;
                element.attr('src', event.target.result);
            }

            function onLoadImage() {
                var width = params.width || this.width / this.height * params.height;
                var height = params.height || this.height / this.width * params.width;
                canvas.attr({
                    width: width,
                    height: height
                });
                canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
            }
        }
    };
}]);