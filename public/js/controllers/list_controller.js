(function() {
    'use strict';

    angular
        .module('app')
        .controller('list_controller', function list_controller($scope, $http, $log, getPromiseItems, showToast, logout) {

            $scope.isCollapsed = true;
            $scope.categories = ['Produce', 'Canned', 'Condiments', 'Italian', 'Mexican', 'Asian',
              'Bread', 'Snacks', 'Dairy', 'Beverage', 'Cleaning', 'Bathroom', 'Frozen'];

            getPromiseItems().then(function(data) {
                $scope.items = data;
                if ($scope.items.length == 0) {
                  $scope.noItems = true;
                } else {
                  angular.forEach($scope.items, function(item) {
                      item.date = moment(item.dateAdded).utc().format('MM/DD/YYYY hh:mm a');
                      if ($scope.categories.indexOf(item.category) < 0)
                        $scope.categories.push(item.category);
                  });
                }
            });

            $scope.checkOff = function(item) {
                item.retrieved = true;
                $http({
                    method: 'PUT',
                    url: '/items/',
                    data: item,
                }).success(function() {
                    showToast("Item checked off!", 1000);
                });
            };

            $scope.logout = logout;

        });
})();
