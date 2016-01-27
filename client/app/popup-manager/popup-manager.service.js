'use strict';

angular.module('roomApp')
  .factory('popupManager', function ($modal, $timeout, toastr, toastrConfig, $state) {
    return {
      showResponseAPI: function(response, status, type, config) {
        console.warn(response, status);
        var msg = '', title = '', extraParams = null, toast = false;

        if (response.status == 500 || status === 500) {
          msg = '(500) Internal Server Error';
          // return $state.go('error500', {api: response.config.url, method: response.config.method, fromUrl: encodeURIComponent(location.href)});
        } else if (response.status == 401 || status === 401) {
          title = '(401) Unauthorized Access';
          msg = 'You have to signed in to do this action or your sessions is expired. Try sign in  again.';
        } else if (response.status == 403 || status === 403) {
          title = '(403) Forbidden Access';
          msg = 'Forbidden Access';
        } else if (response.status == 400 || status === 400) {
          title = '(400) Bad Request';
          msg = response.meta || response.error_description || response.data.meta || response.data.error_description || 'Oops, we\'ve encountered an unexpected problem! Rest assured, our engineers have been notified and will be looking into it shortly. We apologize for the inconvenence! ';
          extraParams = response.config;
        } else if (response.status == 404 || status === 404) {
          title = '(404) Route Not Found';
          msg = response.meta || response.error_description || response.data.meta || response.data.error_description || 'Oops, we\'ve encountered an unexpected problem! Rest assured, our engineers have been notified and will be looking into it shortly. We apologize for the inconvenence! ';
          extraParams = response.config;
        } else if (response.status == 0 || status == 0) {
          msg = '(0) Connection Error';
          msg = 'Oops, we\'ve encountered an unexpected problem! Rest assured, our engineers have been notified and will be looking into it shortly. We apologize for the inconvenence!';
          extraParams = response.config;
        } 
        // else if (response.code && response.code >= 400 && response.code <= 1001) {
        //   msg = '(' + response.code + ') Error';
        //   msg = response.message;
        //   extraParams = response.config;
        // } 
        else if (response.meta && angular.isObject(response.meta)) {
          msg = response.meta.status;
          toast = true;
        }  else if (response.data.meta) {
          msg = response.data.meta.status;
          toast = true;
        } else if (response.error_description) {
          msg = response.error_description;
          toast = true;
        }

        if(!type) {
          if (status >= 200 && status < 300) {
            type = 'success';
          }
        }

        if (!toast) {
          return this.popup(msg, false, title, extraParams);
        } else {
          return this.toast(msg, title, type, config);
        }
      },
      toast: function(msg, title, type, config) {
        if(!type) type = 'success';

        toastr[type](msg, title, config);
      },

      popup: function(content, auto) {
        var tpl = '<div class="modal-body" style="margin:0 auto;">' + content + '</div>';
        if (!auto) {
            tpl += '<div class="modal-footer"><button ng-click="$close()" class="btn btn-flat btn-primary btn-sm">OK</button></div>';
        }
        var modal2 = $modal.open({
            template:tpl,
            // backdrop:'static'
        });
        if (auto === true) {
            $timeout(function() {
                modal2.close('cancel');
            }, 2000);
        }
        return modal2;
      },
      error: function(data, status, auto) {
        auto = auto === false ? auto : true;
        if (data.error) {
            var err = '';
            angular.forEach(data.error, function(value, key) {
                if (key != 'reason') {
                    err += key + ' : ' + value + '<br />';
                }
            });
            return this.popup(err, auto);
        } else {
            return this.popup('System Error (' + status + ')', auto);
        }
      },
      confirm: function(content, okLabel) {
        if (!okLabel)
            okLabel = 'OK';
        var tpl = '<div class="modal-body" style="margin:0 auto;">' + content + '</div>';
        tpl += '<div class="modal-footer"><button ng-click="cancel()" class="btn btn-flat btn-danger btn-sm">Cancel</button><button ng-click="ok()" class="btn btn-flat btn-success btn-sm">' + okLabel + '</button></div>';
        var modal2 = $modal.open({
          template:tpl,
          backdrop:'static',
          controller:['$scope',
          function($scope) {
              $scope.ok = function() {
                  modal2.close(true);
              };
              $scope.cancel = function() {
                  modal2.dismiss('cancel');
              };
          }]
        });
        return modal2;
      }
    };
  });
