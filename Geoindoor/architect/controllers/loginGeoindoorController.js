app.controller("loginGeoindoor",['$scope', '$compile', 'GMapService', 'AnyplaceService', 'AnyplaceAPIService','$http', function ($scope, $compile, GMapService, AnyplaceService, AnyplaceAPIService,$http) {
	
	$scope.logeado = false;

	  var config = {
	    apiKey: "AIzaSyDS4xASU14_0JbaXNEU_1icvU7bX1ugB5A",
	    authDomain: "geoindoordb.firebaseapp.com",
	    databaseURL: "https://geoindoordb.firebaseio.com",
	    storageBucket: "geoindoordb.appspot.com",
	  };

	  firebase.initializeApp(config);

	  $scope.loginGoogle = function() {
	    if(!firebase.auth().currentUser){
	      var provider = new firebase.auth.GoogleAuthProvider();
	      provider.addScope('https://www.googleapis.com/auth/plus.login'); 
	      firebase.auth().signInWithPopup(provider).then(function(result) {
	        var token = result.credential.accesstoken;
	        var user = result.user;
	        var name = result.user.displayName;
	        $scope.logeado = true;          
	        $scope.wakeup();
	      }).catch(function(error) {
	      	$scope.logeado = false;
	        alert( "ERROR: "+ error);
	      });
	    }else{
	      $scope.logOutGoogle();
	    }
	  }
	 $scope.logOutGoogle =  function () {
	    firebase.auth().signOut().then(function() {
	       $scope.logeado = false;
	      alert("Saliendo");
	    }, function(error) {
	      alert( "ERROR: "+ error);
	    });
	  }
	$scope.wakeup = function() {
	    var db = firebase.database();
	    var ref = db.ref("Edificios/");
	    var respuestaux;
	    ref.on("value", function (snapshot) {
	      respuestaux=snapshot.val();
	    });
	  
	};

	  $scope.loginGoogle();
	
}]);