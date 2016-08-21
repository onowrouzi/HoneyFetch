(function() {
    'use strict';

    angular
        .module('app')
        .service('getPromiseItems', function($http, $q, $cookieStore){
            var getPromiseItems = function() {
                var deferred = $q.defer();
                $http.get('/items/', {
                    params: {
                        user: $cookieStore.get('username')
                    }
                }).then(function handleSuccess(response) {
                        deferred.resolve(response.data);
                    },
                    function handleError(response) {
                        console.log('Promise list of items failed.');
                    });
                return deferred.promise;
            }

            return getPromiseItems;
        });

})();
