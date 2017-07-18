app.controller("MyDraw",['$scope', '$compile', 'GMapService', 'AnyplaceService', 'AnyplaceAPIService','$http', function ($scope, $compile, GMapService, AnyplaceService, AnyplaceAPIService,$http) {
	
	$scope.storeRoutesName = [];
	
	// myStoreRoutes
	// Mostrar las rutas guardadas
	$scope.myStoreRoutes = function() {
		var promise = $scope.myGetRoutes();
		promise.then(function(resp) {
			if(resp.config.data.edificio == getEdificio() || getEdificio() == "{{anyService.selectedBuilding.name}}"){
				$scope.storeRoutesName = [];
				//console.log(resp.config.data.edificio);
				var rutas = resp.data[Object.keys(resp.data)[0]];
				Object.keys(rutas).forEach(function(key) {
					$scope.storeRoutesName.push(rutas[key]["nombre"]);
				});
			}
			console.log(resp.config.data.edificio + " -  Get edificio " + getEdificio());
		});
		//console.log($scope.storeRoutesName);
		//console.log($scope.myEdificio + " -  Get edificio " + getEdificio());
	}

	// Dibuja ruta
	$scope.myDrawRoute = function(){
		//alert("casa");
		drawRoute(GMapService.gmap);
	}
	// Borra ruta dibujada
	$scope.myRemoveDrawRoute = function(){
		//alert("casa");
		removeDrawRoute();
	}
	// myGetRoutes()
	// Devuelve las rutas haciendo una llamada a la base de datos
    $scope.myGetRoutes = function () { 
	   	var idmail = getIdMail();
	    var contrasena = getContrasena();
	    var edificio = getEdificio();
	    var datarequest = {
	        email: idmail,
	        edificio: edificio,
	    }
		return $http({

		    method: 'POST',
		    url: "https://geoindoorapi.herokuapp.com/Rutas/Edificio",
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		    transformRequest: function(obj) {
		        var str = [];
		        for(var p in obj){
		        	str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		        }
		        return str.join("&");
		    },
		    data: datarequest

		}).success(function (data,status) {
			//console.log(data);
			return data;
		});
	};

	// drawStoreRoute()
	// Dibuja la ruta pasada por parametro
	$scope.drawStoreRoute = function(nombreRuta) {
		var promise = $scope.myGetRoutes();
		if(!nombreRuta){
			nombreRuta = $scope.myShowRoute;
		}
		//console.log("El nombre "+ document.getElementsByName("nameRoute")[0]);
		document.getElementsByName("nameRoute")[0].value = nombreRuta;
		//var nombreRuta = $('#showRoutes').val.toString();
		promise.then(function(resp) {
			$scope.myRemoveDrawRoute();
			var rutas = resp.data[Object.keys(resp.data)[0]];
			//console.log(resp.data);
			console.log(rutas);
			Object.keys(rutas).forEach(function(key) {
				if(rutas[key]["nombre"] == nombreRuta){
					var ruta = JSON.parse(rutas[key]["ruta"]);
					console.log(ruta);
					var flightPlanCoordinates = [];
					var floorctrl=0;
					ruta.forEach(function(punto) {
						// ********* AQUI SE PODRIA MIRAR TAMBIEN LA PLANTA (FLOOR) *********
						if( punto["floor_number"] != getFloor() && floorctrl != 1){
							alert(nombreRuta + " is on floor " + punto["floor_number"] + ", you are on floor " + getFloor() );
							floorctrl=1;
						}
						if(floorctrl != 1){
							var coord = {
						    	lat: parseFloat(punto["lat"]), 
						    	lng: parseFloat(punto["lng"])
					    	}
							//console.log(coord);
							flightPlanCoordinates.push(coord);
						}
						
					});
					if(floorctrl != 1){
						myflightPath = new google.maps.Polyline({
							path: flightPlanCoordinates,
							geodesic: true,
							strokeColor: '#00ff00',
							strokeOpacity: 1.0,
							strokeWeight: 4
						});  

						console.log(myflightPath.getPath());
						myflightPath.setMap(GMapService.gmap);
					}
				}
			});

		});
		//console.log(data);
	};

setTimeout(function(){ $scope.myStoreRoutes(); }, 3000);

}]);