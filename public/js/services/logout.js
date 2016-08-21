(function() {
    'use strict';

    angular
        .module('app')
        .service('logout', function($window, $cookieStore){

            var logout = function(){
              $cookieStore.put('auth', false);
              $window.location.reload();
            }

            return logout;

        });

})();
