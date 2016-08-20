(function () {
    'use strict';

    angular
      .module('app')
      .controller('list_controller', function list_controller($scope, $state, $http, $q, $log, $window, $cookieStore) {

  			getItems().then(function(data){
  					$scope.items = data;
  					console.log(data);
  					angular.forEach($scope.items, function(item){
  						item.date = moment(item.dateAdded).utc().format('MM/DD/YYYY hh:mm a');
  					});
  				});

        $scope.checkOff = function(item){
					item.retrieved = true;
					$http({
						method: 'PUT',
						url: '/items/',
						data: item,
					}).success(function(){
						console.log("Retrieved item");
					});
  			};

  			$scope.logout = function(){
  				$cookieStore.put('auth', false);
  				$window.location.reload();
  			};

  			function getItems() {
  				var deferred = $q.defer();
  				$http.get('/items/', {
  					params: {user: $cookieStore.get('username')}
  				}).then(function handleSuccess(response) {
              console.log('Got promise list of items.');
              deferred.resolve(response.data);
            },
            function handleError(response) {
              console.log('Promise list of items failed.');
            });
            return deferred.promise;
  			}

    });
})();
