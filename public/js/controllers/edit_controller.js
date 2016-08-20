(function () {
    'use strict';

    angular
        .module('app')
        .controller('edit_controller', function edit_controller($scope, $state, $http, $q, $log, $window, $cookieStore) {
			
			$scope.editButton = "EDIT";
			$scope.editMode = false;
			
			getItems().then(function(data){
					$scope.items = data;
					console.log(data);
					angular.forEach($scope.items, function(item){
						item.date = moment(item.dateAdded).utc().format('MM/DD/YYYY hh:mm a');
					});
				});
			
			$scope.addItem = function(item){
				item.dateAdded = new Date();
				item.addedBy = $cookieStore.get('username');
				item.received = false;
				$http({
                    method: 'POST',
                    url: '/items/',
                    data: item,
                }).success(function() {
                    $window.location.reload();
                });
			};
			
			$scope.editItem = function(item){
				if ($scope.editMode) {
					$scope.editButton = "EDIT";
					item.dateAdded = new Date();
					$http({
						method: 'PUT',
						url: '/items/',
						data: item, 
					}).success(function(){
						$window.location.reload();
					});
				} else {
					$scope.editButton = "UPDATE";
				}
				$scope.editMode = !$scope.editMode;
			};
			
			$scope.deleteItem = function(item){
				$http({
					method: 'DELETE',
					url: '/items/',
					params: {id: item._id},
				}).success(function(){
					$window.location.reload();
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
					}).then(
					function handleSuccess(response) {
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