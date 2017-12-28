
/******************
*                 *
* INICIO          *
* Añadir ruta     *
*                 *  
*******************/

var addRoute = false; // Controlador de acceso a creación de ruta
var ruta = []; // ruta que se va a añadir

// Gestión de mensajes ---

// Información relevante
function msgInfo(msg) {
  var $scope = getScope("MyDraw");
  $scope.info(msg);
  $scope.$apply();
};

// Warning
function msgWarn(msg) {
  var $scope = getScope("MyDraw");
  $scope.warn(msg);
  $scope.$apply();
};
// Error
function msgErr(msg) {
  var $scope = getScope("MyDraw");
  $scope.err(msg);
  $scope.$apply();
};
// Éxito
function msgSuc(msg) {
  var $scope = getScope("MyDraw");
  $scope.suc(msg);
  $scope.$apply();
};


// ---
// getScope
// Devuelve el scope del controlador indicado en ctrlNombre
function getScope(ctrlNombre) {
    var ctrl = 'div[ng-controller="' + ctrlNombre + '"]';
    return angular.element(ctrl).scope();
}
// getIdMail
// Recoge el idmail y lo pasa retorna String
function getIdMail(){
    var idmail = document.getElementsByName("idmail")[0];
    return idmail.value.toString();
}
// getContrasena
// Recoge la contrasena y la retorna como String
function getContrasena(){
    var contrasena = document.getElementById("contrasena");
    return contrasena.value.substr(0, 4);
}
// getEdificio()
// Recoge el nombre del edificio y la retorna como String
function getEdificio(){
    var edificio = document.getElementsByName("edificio")[0];
    if(!edificio.value || edificio.value == undefined) return false;
    return edificio.value;
}
// getNombreRuta()
// Recoge el nombre de la ruta y la retorna como String
// Auxiliar
function getNombreRuta(){
    var nombreRuta = document.getElementsByName("nameRoute")[0];
    var pattern = /[A-Za-z0-9]/g;
    if( nombreRuta.value == null || !nombreRuta.value.length || !pattern.test(nombreRuta.value) ){
        //alert("Name field must not be empty");
        //msgInfo("Name field must not be empty");
        return false;
    }else{
        return nombreRuta.value;
    }
}
// getFloor()
// Retorna la planta en la que se esta.
function getFloor() {
  var poisEdificio = getPoisEdificio();
  if(!poisEdificio || poisEdificio == undefined || poisEdificio.length == 0){
    var scope = getScope("FloorController as floorCtrl");
    return scope.anyService.selectedFloor["floor_number"];
  }
  return poisEdificio[0]["floor_number"];
}
// getNamePoi(poi)
// Retorna el nombre del poi.
function getNamePoi(poi) {
  var poisEdificio = getPoisEdificio();
  if(!poisEdificio){
    return false;
  }
  var retorno = false;
  Object.keys(poisEdificio).forEach(function(key) {
    if(poisEdificio[key]["puid"] == poi){
      retorno = poisEdificio[key]["name"];
      return;
    }
  });
  return retorno;
}
// getDescriptionPoi(poi)
// Retorna la descripcion del poi.
function getDescriptionPoi(poi) {
  var poisEdificio = getPoisEdificio();
  if(!poisEdificio){
    return false;
  }
  var retorno = false;
  Object.keys(poisEdificio).forEach(function(key) {
    if(poisEdificio[key]["puid"] == poi){
      retorno = poisEdificio[key]["description"];
      return;
    }
  });
  return retorno;
}
// putNameRoute()
// Pone el nombre de la ruta seleccionada en el input text de create route
// Urilizado para mostrar las rutas sin angular js (Dropdown de rutas)
function putNameRoute() {
    var nombreRuta = document.getElementsByName("nameRoute")[0];
    var selectedRuta = document.getElementById("showRoutes");
    nombreRuta.value = selectedRuta.innerHTML;
}
// showRoutes()
// muestra las rutas de edificio
// Urilizado para mostrar las rutas sin angular js (Dropdown de rutas)
var controlshowRoutes;
function showRoutes(options) {
    var edificio = getEdificio();
    if(edificio != controlshowRoutes){
        controlshowRoutes=edificio.toString();
        if(!options || !edificio){
            $('#showRoutes').empty();
            $('#showRoutes').append("<option value=\"\" disabled selected>Chose route of the building</option>");
        }else{
            var id = Object.keys(options)[0];
            var options = options[id];
            var keys = Object.keys(options);
            $('#showRoutes').empty();
            $('#showRoutes').append("<option value=\"\" disabled selected>Chose route of the building</option>");
            keys.forEach(function(key) {
              
             $('#showRoutes').append("<option value='"+ options[key]["nombre"] +"' >"+ options[key]["nombre"] +"</option>");
                
            });
        }
     }
}

// LISTENERS --- # Start # ---

// Vaciado de ruta al pulsar clear
$("#clearRoute").click(function() {
  ruta = [];
 // alert("Route clear");
  msgInfo("Route clear");
});
   


// Para cambiar si agregar o no ruta a la vez que el color
document.getElementById("botonroute").addEventListener("click", function(){ 
   var bototnroute=document.getElementById("botonroute");
   if(!botonroute.className || botonroute.className == " " ){
        botonroute.setAttribute("class","draggable-border-red");
        addRoute = true;
   }else{
        botonroute.setAttribute("class"," ");
        addRoute = false;
        ruta = [];
        msgInfo("Route clear");
   }
});


// LISTENERS --- # END # ---


// Añadir poi a la ruta
function addPoiRoute() {
   var poi=document.getElementById("addPoiToRoute").value;
   var bototnroute=document.getElementById("botonroute");
   if (bototnroute.className == "draggable-border-red"){
        if( ruta.indexOf(poi) == -1 ){
            ruta.push(poi);
            //alert("Poi " + poi + " added to the route, position "+ ruta.length);
            msgSuc("Poi: " + getNamePoi(poi) + " added to the route, position "+ ruta.length);
        }else{
            //alert("This Poi "+ poi + " has already been added , position "+ ruta.indexOf(poi)+1);
            msgWarn("This Poi: "+ getNamePoi(poi) + " has already been added , position "+ (ruta.indexOf(poi)+1));
        }
   }else{
        msgWarn("Turn on the route button 'add route mode' to add pois to the route");

   }
   
}

// Crear ruta
function createRoute(){
    var nombreRuta = document.getElementsByName("nameRoute")[0];
    var pattern = /[A-Za-z0-9]/g;
    if( nombreRuta.value == null || !nombreRuta.value.length || !pattern.test(nombreRuta.value) ){
        //alert("Name field must not be empty");
        msgInfo("Name field must not be empty");
    }else{
        var GeoindoorAPI = {};
        GeoindoorAPI.FULL_SERVER = "https://geoindoorapi.herokuapp.com";
        GeoindoorAPI.Route = {};
        GeoindoorAPI.Route.ROUTE_ADD = "/Ruta";
        GeoindoorAPI.Route.ROUTE_ADD_URL = GeoindoorAPI.FULL_SERVER + GeoindoorAPI.Route.ROUTE_ADD;

        GeoindoorAPI.Route.EDIFICIOS_GET = "/Edificios";
        GeoindoorAPI.Route.EDIFICIOS_GET_URL = GeoindoorAPI.FULL_SERVER + GeoindoorAPI.Route.EDIFICIOS_GET;

      
        var idmail = getIdMail();
        var contrasena = getContrasena();
        var edificio = getEdificio();
        var camino = getPosRuta();
        
        if(ruta.length < 2){
            
            msgInfo("The route should have at least 2 pois, remember to make the route in order");
            return;
        }
      
        
        var mydatarequest = {
            email: idmail,
            contrasena: contrasena,
            puntos: JSON.stringify(ruta),
            edificio: edificio,
            ruta: getFloor() + " " + nombreRuta.value,
            camino: JSON.stringify(camino)
        }
        $.ajax({
          type: "POST",
          url: GeoindoorAPI.Route.ROUTE_ADD_URL,
          data: mydatarequest,
          success: function(retornodata) {
              //alert("Ruta added/updated");
              var $scope = getScope("MyDraw");
              $scope.myRemoveDrawRoute();
              msgSuc("Ruta added/updated");
              addRoute = false;
              ruta = [];
              var nombreRuta = document.getElementsByName("nameRoute")[0];
              nombreRuta.value="";
              
          }
        });
        //alert("ruta añadida");
    }
   
}


   
// Muestra las rutas de un edificio
// Urilizado para mostrar las rutas sin angular js (Dropdown de rutas)
function getRoutes(){
    var retorno;
    var idmail = getIdMail();
    var contrasena = getContrasena();
    var edificio = getEdificio();
    var mydatarequest = {
        email: idmail,
        contrasena: contrasena,
        edificio: edificio,
    }
    $.ajax({
      type: "POST",
      url: "https://geoindoorapi.herokuapp.com/Rutas/Edificio",
      data: mydatarequest,
      success: function(retornodata) {
          retorno=retornodata;
          showRoutes(retornodata);
          

      },
      error:function(retornodata) {
          retorno=false;
          showRoutes(false);
      }
    });
   return retorno;
}


/******************
*                 *
* INICIO          *
* Dibujo de ruta  *
*                 *  
*******************/

var myflightPath;

// getPoisEdificio()
// Recoge todos los pois de un edificio
function getPoisEdificio(){
  var poisEdificio = document.getElementsByName("poisEdificio")[0];
  return JSON.parse(poisEdificio.value);
}

// getPosRuta()
// Devuelve la posicion de los puntos de la ruta
function getPosRuta(){
  var retorno=[];
  var poisEdificio = getPoisEdificio();

  ruta.forEach(function(punto) {
      poisEdificio.forEach(function(objeto) {
        if(punto == objeto["puid"]){
          var posicion = {
            puid: objeto["puid"],
            lat: objeto["coordinates_lat"],
            lng: objeto["coordinates_lon"],
            floor_number: objeto["floor_number"],
            name: objeto["name"],
            description: objeto["description"]
          }
          retorno.push(posicion);
        }
      });
  });
  return retorno;
}


// drawRoute()
// Dibuja la ruta que aparece en ruta
function drawRoute(gmaps){
  if(ruta.length > 1){
    removeDrawRoute();
    var posRuta = getPosRuta();
    var flightPlanCoordinates = [];
    posRuta.forEach(function(pos) {
      var coord = {
        lat: parseFloat(pos["lat"]), 
        lng: parseFloat(pos["lng"])
      }
      flightPlanCoordinates.push(coord);
    });


    myflightPath = new google.maps.Polyline({
        path: flightPlanCoordinates,
        geodesic: true,
        strokeColor: '#00ff00',
        strokeOpacity: 1.0,
        strokeWeight: 4
    });  

    myflightPath.setMap(gmaps);
  }

}

// removeDrawRoute()
// borra la ruta que aparece en ruta

function removeDrawRoute() {
  if(myflightPath)
  myflightPath.setMap(null);
}





