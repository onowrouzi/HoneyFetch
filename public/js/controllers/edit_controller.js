(function() {
    'use strict';

    angular
        .module('app')
        .controller('edit_controller', function edit_controller($scope, $http, $q, $log, $cookieStore, getPromiseItems, exists, showToast, logout) {

            $scope.categories = ['Produce', 'Frozen', 'Dairy', 'Bread', 'Snacks', 'Condiments',
                'Beverage', 'Canned', 'Italian', 'Mexican', 'Asian', 'Cleaning', 'Bathroom'];
            $scope.users = [];
            $scope.users.push($cookieStore.get('username'));
            getItems();

            $scope.addCat = function(cat){
                if (exists($scope.categories, cat)) {
                  showToast("Category already exists!", 2000);
                } else {
                  $scope.categories.push(cat);
                  $scope.cat = "";
                  showToast("Category added!", 1000);
                }
            };

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
                    console.log(item.cateogry);
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

            $scope.logout = logout;

            function checkIfExists(item) {
                var exists = false;
                angular.forEach($scope.items, function(itm) {
                    if (item.itemname == itm.itemname) exists = true;
                });
                return exists;
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
                          if (!item.category)
                            item.category = "None";
                          else if (!exists($scope.categories, item.category))
                            $scope.categories.push(item.category);
                      });
                    }
                });
            }

        });
})();
