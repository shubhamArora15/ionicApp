angular.module('starter.services', ['firebase'])

.factory('auth', ["$firebaseAuth", "$rootScope",
   function ($firebaseAuth, $rootScope) {
      var ref = new Firebase("https://signup-form-1853a.firebaseio.com/");
      return $firebaseAuth(ref);
  }]);
