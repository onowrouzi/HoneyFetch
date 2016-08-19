(function () {
    'use strict';

    angular
        .module('app')
        .config(function ($stateProvider, $urlRouterProvider) {
          
            $urlRouterProvider.otherwise("/list");
            
            $stateProvider
              .state('login', {
                  url: "/",
                  templateUrl: "/html/login.html",
                  controller: "login_controller",
				  resolve: {
					  load: function($q, $timeout, $state, $cookieStore){
						  var deferred = $q.defer();
						  $timeout(function(){
							  if (!$cookieStore.get('auth')){
								  deferred.resolve();
							  } else {
								  $state.go('list');
								  deferred.reject();
							  }
						  });
						  return deferred.promise;
					  }
				  } 
              })
			  .state('list', {
				  url: "/list",
				  templateUrl: "/html/list.html",
				  controller: "list_controller",
				  resolve: {
					  load: function($q, $timeout, $state, $cookieStore){
						  var deferred = $q.defer();
						  $timeout(function(){
							  if ($cookieStore.get('auth')){
								  deferred.resolve();
							  } else {
								  $state.go('login');
								  deferred.reject();
							  }
						  });
						  return deferred.promise;
					  }
				  }			
			  })
			  .state('edit', {
				  url: "/edit",
				  templateUrl: "/html/edit.html",
				  controller: "edit_controller",
				  resolve: {
					  load: function($q, $timeout, $state, $cookieStore){
						  var deferred = $q.defer();
						  $timeout(function(){
							  if ($cookieStore.get('auth')){
								  deferred.resolve();
							  } else {
								  $state.go('login');
								  deferred.reject();
							  }
						  });
						  return deferred.promise;
					  }
				  }			
			  })
			  .state('register', {
				  url: "/register",
				  templateUrl: "/html/register.html",
				  controller: "register_controller"
			  });
        });
})();
