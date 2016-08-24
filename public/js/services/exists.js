(function() {
    'use strict';

    angular
        .module('app')
        .service('exists', function(){
            var exists = function(array, item) {
                var e = false;
                angular.forEach(array, function(i){
                  if (item == i) e = true;
                });
                return e;
            }

            return exists;
        });

})();
