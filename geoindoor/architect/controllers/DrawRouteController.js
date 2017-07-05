app.controller("MyDraw",['$scope', '$compile', 'GMapService', 'AnyplaceService', 'AnyplaceAPIService', function ($scope, $compile, GMapService, AnyplaceService, AnyplaceAPIService) {
	
	$scope.drawRoute = function(){
		drawRoute(GMapService.gmap);
	}

}]);