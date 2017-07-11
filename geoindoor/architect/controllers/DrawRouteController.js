app.controller("MyDraw",['$scope', '$compile', 'GMapService', 'AnyplaceService', 'AnyplaceAPIService','$http', function ($scope, $compile, GMapService, AnyplaceService, AnyplaceAPIService,$http) {
	
	$scope.myDrawRoute = function(){
		//alert("casa");
		drawRoute(GMapService.gmap);
	}

	$scope.myRemoveDrawRoute = function(){
		//alert("casa");
		removeDrawRoute();
	}

    $scope.myGetRoutes = function () { 
	   	var idmail = getIdMail();
	    var contrasena = getContrasena();
	    var edificio = getEdificio();
	    var datarequest = {
	        email: idmail,
	        edificio: edificio,
	    }
		$http({

		    method: 'POST',
		    url: "https://geoindoorapi.herokuapp.com/Rutas/Edificio",
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		    transformRequest: function(obj) {
		        var str = [];
		        for(var p in obj)
		        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		        return str.join("&");
		    },
		    data: datarequest

		}).success(function (data,status) {
			// HAY QUE CONTINUAR AQUI*************************
			console.log(data);
		});
	};



}]);