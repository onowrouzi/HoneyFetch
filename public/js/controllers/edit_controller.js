(function() {
    'use strict';

    angular
        .module('app')
        .controller('edit_controller', function edit_controller($scope, $http, $q, $log, $window, $cookieStore, $mdToast) {

            $scope.users = [];
            $scope.users.push($cookieStore.get('username'));
            getItems();

            $scope.addItem = function(item) {
                $scope.noItems = false;
                if (checkIfExists(item)) {
                    showToast('Item already exists!', 3000);
                } else {
                    item.dateAdded = new Date();
                    item.addedBy = $cookieStore.get('username');
                    item.retrieved = item.edit = false;
                    item.users = $scope.users;
                    $http({
                        method: 'POST',
                        url: '/items/',
                        data: item,
                    }).success(function() {
                        $scope.item = "";
                        showToast('Item added!', 1000);
                        getItems();
                    });
                }
            };

            $scope.addPrevItem = function(item) {
                $scope.prevItem = "";
                item.dateAdded = new Date();
                item.retrieved = item.edit = false;
                item.users = $scope.users;
                $http({
                    method: 'PUT',
                    url: '/items/',
                    data: item,
                }).success(function() {
                    showToast('Item added!', 1000);
                    getItems();
                });
            };

            $scope.addUser = function(user) {
                $scope.users.push(user);
                angular.forEach($scope.items, function(item) {
                    item.users = $scope.users;
                    $http({
                        method: 'PUT',
                        url: '/items/',
                        data: item,
                    }).success(function() {
                        console.log(user + ' added.');
                    });
                });
                showToast(user + ' added!', 1000);
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
                        showToast('Item updated!', 1000);
                        getItems();
                    });
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
                    showToast('Item successfully deleted!', 1000);
                    getItems();
                });
            };

            $scope.logout = function() {
                $cookieStore.put('auth', false);
                $window.location.reload();
            };

            function checkIfExists(item) {
                var exists = false;
                angular.forEach($scope.items, function(itm) {
                    if (item.itemname == itm.itemname) exists = true;
                });
                return exists;
            }

            function showToast(text, delay){
              $mdToast.show(
                $mdToast.simple()
                  .textContent(text)
                  .hideDelay(delay)
              );
            }

            function getPromiseItems() {
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

            function getItems() {
                getPromiseItems().then(function(data) {
                    $scope.items = data;
                    if ($scope.items.length == 0){
                      $scope.noItems = true;
                    } else {
                      angular.forEach($scope.items[0].users, function(user){
                          if ($scope.users.indexOf(user) < 0) $scope.users.push(user);
                      });
                      angular.forEach($scope.items, function(item) {
                          if (!item.date) item.date = moment(item.dateAdded).utc().format('MM/DD/YYYY hh:mm a');
                      });
                    }
                });
            }

        });
})();
