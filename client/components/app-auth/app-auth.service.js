'use strict';

(function(exports) {
    var userRoles = {
        'public' : 1,
        teacher : 2,
        parent : 2,
        admin : 4,
    };
    exports.userRoles = userRoles;
    exports.accessLevels = {
        anon : userRoles.public,
        'public' : userRoles.public | userRoles.teacher | userRoles.parent | userRoles.admin,
        user : userRoles.teacher | userRoles.parent | userRoles.admin,
        teacher : userRoles.teacher | userRoles.admin,
        parent : userRoles.parent | userRoles.admin,
        admin : userRoles.admin,
    };
})( typeof exports === 'undefined' ? window.AUTHConfig = {} : exports);

angular.module('roomApp')
  .factory('appAuth', function ($q, $store, $http, appConfig) {

    function UserData() {
        this.authenticated = false;
        this.token = null;
        this.role = AUTHConfig.userRoles.public;
        this.expires = null;
        this.data = {};
        this.profile = {};
        this._sync();
    }

    UserData.prototype = {
        _default: function() {
            return {
                authenticated:false,
                token:null,
                role:AUTHConfig.userRoles.public,
                expires:null,
                data: {},
                profile: {}
            }
        },

        _sync: function() {
            angular.forEach(this._default(), function(val, key) {
                this[key] = $store.get(key);
            }, this);

            if (this._isExpired()) this._reset();
        },

        _reset: function() {
            angular.forEach(this._default(), function(val, key) {
                $store.set(key, val);
                this[key] = val;
            }, this);
        },

        _isExpired: function() {
            var now = +new Date, expires = this.expires, expired = now >= this.expires;
            if(this.expires && expired)
                console.log('token expired', new Date(this.expires));
            return expired;
        },

        authorize: function(accessLevel, role) {
            /**
             * Default Role apabila $cookies.UserService belum ada
             */
            if (!angular.isDefined(role)) {
                role = this.role || AUTHConfig.userRoles.public;
            }

            /**
             * Apabila token expired, reset data
             */
            if (accessLevel != AUTHConfig.accessLevels.public && accessLevel != AUTHConfig.accessLevels.anon  && this._isExpired()) {
                this._reset();
                return false;
            }

            /**
             * Check Page Access Level vs User Role
             */
            if (angular.isNumber(accessLevel) && angular.isNumber(role)) {
                // console.log('authorize', accessLevel, role, accessLevel & role);
                return accessLevel & role;
            } else {
                return false;
            }
        },

        logout: function() {
            var me = this;
            /**
             * Logout via API /session/logout
             */
            // var http = $http.post(appConfig.api.get('baseUrl') +'/sessions/logout',{
            //     token : me.token,
            // });
            // http.success(function(response, status){
                me._reset();
            // });
            // return http;
            
            var http = $q.defer();
            setTimeout(function(){
                http.resolve();
            }, 500);
            return http.promise;
        },

        login: function(data, type) {
            var me = this;

            /**
             * Login via API /session/login
             */
            var http = $http.post(appConfig.baseAPIUrl +'/auth/local', {
                email : data.email,
                password : data.password,
            });
            http.then(function(response, status){
                me.setData({
                    authenticated: true,
                    token: response.data.token,
                    role: AUTHConfig.userRoles[response.data.role],
                    expires: (new Date()).setSeconds(24 * 60 * 60),
                    data: response.data
                });
            });
            return http;
        },

        setData: function(data) {
            angular.forEach(data, function(value, key) {
                $store.set(key, value);
            });
            this._sync();
        },

        getMe: function(data) {
          var self = this, http = $http.get(appConfig.baseAPIUrl + '/api/users/me', {
              headers: {
                  Authorization: 'Bearer ' + self.token,
                  user_id: self.data.id
              }
          }, {
              cache: false,
              isArray: false
          });
          http.then(function(response, status) {
            self.setData({
              profile: response.data
            });
          }, function(response, status) {
            console.info(response, status);
          })
          return http;
        },

        updateMe: function(data) {
          var self = this, http = $http.post(appConfig.api.get('baseUrl') + '/me', angular.extend({
              access_token: self.token
            }, data), {
            params: {  
              'with': '["roles.permissions", "districts"]'
            }
          });
          return http;
        },

        hasAccess: function(keys) {
            var result = false;
            var criteria =  this.permissions.length ? new RegExp(this.permissions.join('|')) : false;
            if (criteria)
            {
              if (angular.isArray(keys))
              {
                keys.forEach(function(key, idx)
                {
                  // if(WrpTier3.Util.isHiddenFeature(key)) {
                  //   result = result || false;
                  // } else {
                    result = result || criteria.test(key);
                  // }
                });
              }
              else
              {
                // if(WrpTier3.Util.isHiddenFeature(featureKey)) {
                //   result = false;
                // } else {
                  result = criteria.test(keys);
                // }
              }
            }
            return result;
        },

        hasAccessDistrict: function(id) {
            return this.districtIds ? this.districtIds.indexOf(parseInt(id)) !== -1 : true;
        }

    };

    var userData = new UserData();
    return userData;

}).factory('AzureService', ['$window', '$q', '$log',
    function($window, $q, $log) {
        var deferred = null;
        $window.authOk = function(data) {
            $log.info('authOk', data);
            if (deferred) {
                if (data) {
                    deferred.resolve(JSON.parse(data));
                } else {
                    deferred.reject('Token not available');
                }
            }
        };
        $window.authDenied = function(data) {
            $log.warn('authDenied', data);
            if (deferred) {
                deferred.reject(JSON.parse(data));
            }
        };
        $window.authClose = function() {
            if (deferred) {
                deferred.notify('Auth closed');
            }
        };
        var obj = {
            login: function() {
                deferred = $q.defer();
                var url = '/auth/azure';
                $window.open(url, "azure_login", "width=600,height=400");
                return deferred.promise;
            },
            connect: function() {
                deferred = $q.defer();
                var url = '/api/users/connect';
                $window.open(url, "azure_connect", "width=600,height=400");
                return deferred.promise;
            }
        };
        return obj;
    }
]);
