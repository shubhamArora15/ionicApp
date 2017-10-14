angular.module('starter.controllers', [])

.controller('authanticCtrl', function($scope, $ionicPopup, $state, $firebaseAuth, $rootScope, auth, $http) {

  /**
  Log in Section
  */
  var hosts = ["http://basicapp.arorashubham.com","http://localhost:3000",'http://192.168.0.107:3000'];
  $scope.host = hosts[0];

  $scope.signin = function(user){
    if(user.email == undefined || user.password == undefined){
      $scope.popUp("Error", "Please fill the all fields");
    }else{
      $http.post($scope.host + "/login", {user:user})
        .then(function(response){
          if(response.data == "yes"){
              $scope.popUp("message","You Are successfully login");
          }else{
              $scope.popUp("message","You are not registered member");
          }
      });
    }
  }

  // function to process the form
  $scope.reset = function(user){
    console.log(user);
    $http.post($scope.host + "/reset", {user:user})
      .then(function(response){
        console.log(response);
          $scope.popUp("message", "You  reset confirmation sent to:<br>"+ user.email);
          // $rootScope.newEmail = response;
      });
  };

  /**
  Password Reset section
  */
  $scope.resetPassword = function(user){
    if(user == undefined){
      $scope.popUp("error","Please enter email");
    }else{
      console.log(user);
      $http.post($scope.host + "/resetPassword", {user:user,email:user.emai})
        .then(function(response){
          console.log(response);
          $scope.popUp("message", "You successfully reset your password");
      });
    }
  }

  /**
  Sign Up Section
  */
  $scope.signUp = function(user){
    if(user==undefined ||user.email == undefined || user.password == undefined || user.phone == undefined){
      $scope.popUp("error","Please fill the fields");
    }else{
    $http.post($scope.host+"/users", {user:user})
    .then(function(response){
        if(response.data == "already"){
          $scope.popUp("Message", "You are already memeber!");
        }else{
          $scope.popUp("Message", "You Email"+ user.email + "has sent for verification");
          $http.post($scope.host+"/verifyEmail", {user:user})
          .then(function(response){
            $http.post($scope.host+"/verify")
              .then(function(response){
                  console.log(response);
              });
          });
        }
    });


    }
  }

  /**
  Pop up Message
  */
  $scope.popUp = function(title, message){
      $ionicPopup.alert({
          title: title,
          template: message
      });
  }

  /**
  State Section
  */
  $scope.next = function(nextState){
    $state.go(nextState);
  }

});
