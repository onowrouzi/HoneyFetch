(function() {
    'use strict';

    angular
        .module('app')
        .controller('edit_controller', function edit_controller($scope, $http, $q, $log, $window, $cookieStore) {

            $scope.editButton = "EDIT";

            getItems().then(function(data) {
                $scope.items = data;
                console.log(data);
                angular.forEach($scope.items, function(item) {
                    if (!item.date) item.date = moment(item.dateAdded).utc().format('MM/DD/YYYY hh:mm a');
                });
            });

            $scope.addItem = function(item) {
                item.dateAdded = new Date();
                item.addedBy = $cookieStore.get('username');
                item.retrieved = item.edit = false;
                $http({
                    method: 'POST',
                    url: '/items/',
                    data: item,
                }).success(function() {
                    $window.location.reload();
                });
            };

            $scope.addPrevItem = function(item) {
                item.dateAdded = new Date();
                item.retrieved = item.edit = false;
                $http({
                    method: 'PUT',
                    url: '/items/',
                    data: item,
                }).success(function() {
                    $window.location.reload();
                });
            };

            $scope.addUser = function(user) {
                angular.forEach($scope.items, function(item) {
                    item.receiver = user;
                    $http({
                        method: 'PUT',
                        url: '/items/',
                        data: item,
                    }).success(function() {
                        console.log('Added receiver ' + user);
                    });
                });
            }

            $scope.editItem = function(item) {
                item.edit = !item.edit;
                if (!item.edit) {
                    $scope.editButton = "EDIT";
                    item.dateAdded = new Date();
                    $http({
                        method: 'PUT',
                        url: '/items/',
                        data: item,
                    }).success(function() {
                        $window.location.reload();
                    });
                } else {
                    $scope.editButton = "UPDATE";
                }
            };

            $scope.deleteItem = function(item) {
                $http({
                    method: 'DELETE',
                    url: '/items/',
                    params: {
                        id: item._id
                    },
                }).success(function() {
                    $window.location.reload();
                });
            };

            $scope.logout = function() {
                $cookieStore.put('auth', false);
                $window.location.reload();
            };

            function getItems() {
                var deferred = $q.defer();
                $http.get('/items/', {
                    params: {
                        user: $cookieStore.get('username')
                    }
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
