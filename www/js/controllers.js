angular.module('starter.controllers', [])

.controller('authanticCtrl', function($scope, socket, $timeout, $cordovaBarcodeScanner ,$ionicSlideBoxDelegate ,$ionicModal, $ionicPopup, $state, $firebaseAuth, $rootScope, auth, $http) {

  /**
  Log in Section
  */
  var hosts = ["http://basicapp.arorashubham.com","http://localhost:3000",'http://192.168.43.166:3000'];
  $scope.host = hosts[0];

  $scope.name = localStorage.getItem('name');

  $scope.signin = function(user){
    if(user.email == undefined || user.password == undefined){
      $scope.popUp("Error", "Please fill the all fields");
    }else{
      $http.post($scope.host + "/login", {user:user})
        .then(function(response){
          if(response.data != "no" || response.data.length == 0){
              $state.go('home');
              localStorage.setItem('id', JSON.stringify(response.data[0]._id));
              localStorage.setItem('name', JSON.stringify(response.data[0].name));
              $scope.name = localStorage.getItem('name');
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

  // function to process the form
  $scope.viewSessionList = function(){
    console.log("done");
    socket.emit('sessionList', {
       sessionList : "view"
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

  $scope.randomData = ["name","hello"];

  $ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    $timeout( function() {
        $ionicSlideBoxDelegate.update();
      });
  });

  $scope.logout = function(){
      localStorage.clear();
      $state.go("login");
      $scope.photosData = [];
      $scope.name = "";
      alert("you are successfully logout");
  }

  $scope.photos = [];

  $('#photo1').on("change", function(e){
    uploadFile("photo1");
        });
  $('#photo2').on("change", function(){
    uploadFile("photo2")
  });
  $('#photo3').on("change", function(){
    uploadFile("photo3")
  });

  function uploadFile(id){
    var file    = document.getElementById(id).files[0];
    var fd = new FormData();

    fd.append('file', file);
    var uploadUrl = $scope.host + '/saveImage';

    $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
    })
    .then(function(response) {
        $scope.photos.push(file.name);
    })
  }

  $scope.scanBarcode = function() {
       $cordovaBarcodeScanner.scan().then(function(imageData) {
           alert(imageData.text);
           $scope.imageText = imageData.text;
           console.log("Barcode Format -> " + imageData.format);

               $http.post($scope.host + '/checkSession', {sessionId:imageData.text, checkSession:true})
                 .then(function(response){
                     console.log(response.data, "done");
                     socket.emit('sessionData', {
                        sessionId : $scope.imageText
                      });
                 });
           console.log("Cancelled -> " + imageData.cancelled);
       }, function(error) {
           console.log("An error happened -> " + error);
       });
   };

  $scope.createSession = function(session, photos){

    $http.post($scope.host + "/createSession", {session,photos,userId:localStorage.getItem('id'), createSession:true})
      .then(function(response){
        console.log(response);
        $state.go("viewSession");
          // alert("You successfully reset your password");
      });
  }
  $scope.viewSession = function(){

    $http.post($scope.host + "/viewSession", {userId:localStorage.getItem('id'), viewSession:true})
      .then(function(response){
        console.log(response.data);

        if(response.data == "404"){
          $scope.popUp("message","no Session create new one");
        }else{
          $state.go('viewSession');
          $scope.sessionList = response.data;
        }
      });
  }

  $scope.getSessionData = function(id){
    // $scope.openModal = function() {
    $scope.modal.show();
  // };
    $http.post($scope.host + "/viewSession", {sessionId:id,getSessionData:true})
    .then(function(response){
      $scope.sessionName = response.data[0].session;
      $scope.photos = response.data[0].photos;
      console.log($scope.photos)
    });
  }

  $scope.split = function(value){
    value = value.split('.');
    var ext = value[1];
    return ext;
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
