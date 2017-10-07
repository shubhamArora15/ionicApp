angular.module('starter.controllers', [])

.controller('authanticCtrl', function($scope, $ionicPopup, $state, $firebaseAuth, $rootScope, auth) {

  /**
  Log in Section
  */
  $scope.signin = function(user){
    if(user.email == undefined || user.password == undefined){
      $scope.popUp("Error", "Please fill the all fields");
    }else{
      firebase.auth().signInWithEmailAndPassword(user.email, user.password).then(function(result) {
        $scope.popUp("Message","You are Successfully Login");
      },
      function(error) {
        console.log(error)
      });
    }
  }

  /**
  Password Reset section
  */
  $scope.resetPassword = function(user){
    if(user == undefined){
      $scope.popUp("error","Please enter email");
    }else{
      firebase.auth().sendPasswordResetEmail(user.email).then(function(data) {
        $scope.popUp("Message","You Password reset configuration sent to <b>"+user.email+"</b> Please reset your password ");
      }, function(error) {
        $scope.popUp("error","there is some problem in password reseting");
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
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then(function (result) {
       result.updateProfile({
         displayName: user.name,
         photoURL: "default_dp"
       }).then(function() {}, function(error) {})
         result.sendEmailVerification().then(function(){
            $scope.popUp("Message","Email verification sent to"+ user.email + "Please verify it to sign in")
         });
       }, function (error) {
         $scope.popUp("Warning",error.message)
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
