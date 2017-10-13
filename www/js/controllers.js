angular.module('starter.controllers', [])

.controller('authanticCtrl', function($scope, $ionicPopup, $state, $firebaseAuth, $rootScope, auth, $http) {

  /**
  Log in Section
  */
  $scope.host = "http://basicapp.arorashubham.com";

  $scope.signin = function(user){
    if(user.email == undefined || user.password == undefined){
      $scope.popUp("Error", "Please fill the all fields");
    }else{
      // firebase.auth().signInWithEmailAndPassword(user.email, user.password).then(function(result) {
      //   $scope.popUp("Message","You are Successfully Login");
      // },
      // function(error) {
      //   console.log(error)
      // });
      $http.post($scope.host + "/login", {user:user})
        .then(function(response){
          if(response.data == "yes"){
              $scope.popUp("message","You Are successfully login");
          }else{
              $scope.popUp("message","No Data Found");
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
      // firebase.auth().sendPasswordResetEmail(user.email).then(function(data) {
      //   $scope.popUp("Message","You Password reset configuration sent to <b>"+user.email+"</b> Please reset your password ");
      // }, function(error) {
      //   $scope.popUp("error","there is some problem in password reseting");
      // });
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
    // firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then(function (result) {
    //    result.updateProfile({
    //      displayName: user.name,
    //      photoURL: "default_dp"
    //    }).then(function() {}, function(error) {})
    //      result.sendEmailVerification().then(function(){
    //         $scope.popUp("Message","Email verification sent to"+ user.email + "Please verify it to sign in")
    //      });
    //    }, function (error) {
    //      $scope.popUp("Warning",error.message)
    //    });
    $http.post($scope.host+"/users", {user:user})
    .then(function(response){
        console.log(response.data);
        // alert("You are successfully registered");

        $scope.popUp("Message", "You Email"+ user.email + "has sent for verification");

        $http.post($scope.host+"/verifyEmail", {user:user})
        .then(function(response){
          $http.post($scope.host+"/verify")
            .then(function(response){
                console.log(response);
                $scope.popUp("Success", "You Email"+ user.email + "has successfully verified");
            });
        });
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
