// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var example = angular.module('starter', ['ionic', 'ngCordova']);

example.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    db = $cordovaSQLite.openDB("my.db");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS people(id integer primary key, firstname text, lastname text, image text)");
  });
});

example.controller("ExampleController", function($scope, $cordovaSQLite, $cordovaCamera, $cordovaFile){

  $scope.loginForm = {};
  $scope.img = "img/ionic.png"
  $scope.choose = function(){
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      targetWidth: 200,
      targetHeight: 200
    };
    // var options = {
    //   quality: 50,
    //   destinationType: Camera.DestinationType.FILE_URI,
    //   sourceType: Camera.PictureSourceType.CAMERA,
    //   allowEdit: true,
    //   encodingType: Camera.EncodingType.JPEG,
    //   targetWidth: 200,
    //   targetHeight: 200,
    //   popoverOptions: CameraPopoverOptions,
    //   saveToPhotoAlbum: true,
    //   correctOrientation: true
    // };

    $cordovaCamera.getPicture(options).then(function(sourcePath) {
      console.log('img', sourcePath);  
      $scope.img = sourcePath;                       
    }, function(err) {
      // error
      console.log(err);
    });
  }

  $scope.insert = function(firstname, lastname){
    console.log(firstname+" "+lastname+"##############");
    var query = "Insert INTO people (firstname, lastname, image) VALUES(?,?,?)";
    $cordovaSQLite.execute(db, query, [firstname, lastname, $scope.img]).then(function(res){
      console.log("Insert ID->" + res.insertId);
      alert(res.insertId +"record inserted");
    }, function(err){
      console.error(err);
    });
  }

  $scope.select = function(lastname){
    var query = "Select firstname, lastname, image from people where lastname = ?";
    $cordovaSQLite.execute(db, query, [lastname]).then(function(res){
      if(res.rows.length > 0){
        console.log("Selected ->" + res.rows.item(0).firstname+ " "+res.rows.item(0).lastname+" "+res.rows.item(0).image);
        alert(res.rows.item(0).firstname+" "+res.rows.item(0).lastname+" "+res.rows.item(0).image);
      } else {
        console.log("No results found");
        alert("No result found. Check LastName which you have given.")
      }
    });
  } 
  

});
