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
function getNombreRuta(){
    var nombreRuta = document.getElementsByName("nameRoute")[0];
    var pattern = /[A-Za-z0-9]/g;
    if( nombreRuta.value == null || !nombreRuta.value.length || !pattern.test(nombreRuta.value) ){
        alert("Name field must not be empty");
    }else{
        return nombreRuta.value;
    }
}
// putNameRoute()
// Pone el nombre de la ruta seleccionada en el input text de create route
function putNameRoute() {
    var nombreRuta = document.getElementsByName("nameRoute")[0];
    var selectedRuta = document.getElementById("showRoutes");
    nombreRuta.value = selectedRuta.value;
}
// showRoutes()
// muestra las rutas de edificio
var controlshowRoutes;
function showRoutes(options) {
    var edificio = getEdificio();
    if(edificio != controlshowRoutes){
        controlshowRoutes=edificio.toString();
        if(!options || !edificio){
            $('#showRoutes').empty();
            $('#showRoutes').append("<option value=\"\" disabled selected>Chose route of the building</option>");
        }else{
            console.log(options);
            var id = Object.keys(options)[0];
            var options = options[id];
            var keys = Object.keys(options);
            //console.log(keys);
            //console.log(options["r1"]["nombre"]);
            $('#showRoutes').empty();
            $('#showRoutes').append("<option value=\"\" disabled selected>Chose route of the building</option>");
            keys.forEach(function(key) {
              
             $('#showRoutes').append("<option value='"+ options[key]["nombre"] +"' >"+ options[key]["nombre"] +"</option>");
                
            });
        }
     }
}

var addRoute = false;
var ruta = [];

// Para cambiar si agregar o no ruta a la vez que el color
document.getElementById("botonroute").addEventListener("click", function(){ 
   var bototnroute=document.getElementById("botonroute");
   console.log(botonroute.className);
   if(!botonroute.className || botonroute.className == " " ){
        botonroute.setAttribute("class","draggable-border-red");
        addRoute = true;
   }else{
        botonroute.setAttribute("class"," ");
        addRoute = false;
        ruta = [];
        alert("Route clear");
        console.log(ruta);
   }
});

// Mostrar rutas de edificio
document.getElementById("showRoutes").addEventListener("click", function(){ 
   getRoutes();
});




// Añadir poi a la ruta
function addPoiRoute() {
   var poi=document.getElementById("addPoiToRoute").value;
   var bototnroute=document.getElementById("botonroute");
   console.log(poi);
   if (bototnroute.className == "draggable-border-red"){
        if( ruta.indexOf(poi) == -1 ){
            ruta.push(poi);
            alert("Poi " + poi + " added to the route, position "+ ruta.length);
            console.log(ruta);
        }else{
            alert("This Poi "+ poi + " has already been added , position "+ ruta.indexOf(poi)+1);
        }
   }else{
        console.log("Aquiiiii");
        alert("Turn on the route button 'add route mode' to add pois to the route");

   }
   
}

// Crear ruta
function createRoute(){
    var nombreRuta = document.getElementsByName("nameRoute")[0];
    var pattern = /[A-Za-z0-9]/g;
    if( nombreRuta.value == null || !nombreRuta.value.length || !pattern.test(nombreRuta.value) ){
        alert("Name field must not be empty");
    }else{
        console.log(nombreRuta.value);
        var GeoindoorAPI = {};
        GeoindoorAPI.FULL_SERVER = "https://geoindoorapi.herokuapp.com";
        GeoindoorAPI.Route = {};
        GeoindoorAPI.Route.ROUTE_ADD = "/Ruta";
        GeoindoorAPI.Route.ROUTE_ADD_URL = GeoindoorAPI.FULL_SERVER + GeoindoorAPI.Route.ROUTE_ADD;

        GeoindoorAPI.Route.EDIFICIOS_GET = "/Edificios";
        GeoindoorAPI.Route.EDIFICIOS_GET_URL = GeoindoorAPI.FULL_SERVER + GeoindoorAPI.Route.EDIFICIOS_GET;
        console.log(GeoindoorAPI.Route.ROUTE_ADD_URL);
        console.log(GeoindoorAPI.Route.EDIFICIOS_GET_URL);

       /* $.get(GeoindoorAPI.Route.EDIFICIOS_GET_URL, function(respuestaSolicitud){
            alert(respuestaSolicitud["id1"]["nombre"]);
        })*/
        var idmail = getIdMail();
        var contrasena = getContrasena();
        var edificio = getEdificio();
        if(ruta.length < 2){
            alert("The route should have at least 2 pois, remember to make the route in order");
            return;
        }
      
        console.log("idmail " + idmail);
        console.log("contrasena " + contrasena);
        var mydatarequest = {
            email: idmail,
            contrasena: contrasena,
            puntos: JSON.stringify(ruta),
            edificio: edificio,
            ruta: nombreRuta.value,
            camino: " "
        }
        $.ajax({
          type: "POST",
          url: GeoindoorAPI.Route.ROUTE_ADD_URL,
          data: mydatarequest,
          success: function(retornodata) {
              alert("Ruta added/updated");
              //var bototnroute=document.getElementById("botonroute");
              //botonroute.click();
              addRoute = false;
              ruta = [];
              var nombreRuta = document.getElementsByName("nameRoute")[0];
              nombreRuta.value="";
              console.log(retornodata);
          }
        });
        //alert("ruta añadida");
    }
   
}


   
// Crear ruta
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
    var retorno;
    $.ajax({
      type: "POST",
      url: "https://geoindoorapi.herokuapp.com/Rutas/Edificio",
      data: mydatarequest,
      success: function(retornodata) {
          //retorno=JSON.stringify(retornodata).toString();
          //console.log(retorno);
          //return retorno;
          //console.log(retornodata);
          retorno=retornodata;
          console.log(retornodata + "SHIUUUUU");
          showRoutes(retornodata);
          

      },
      error:function(retornodata) {
          retorno=false;
          showRoutes(false);
      }
    });
        //alert("ruta añadida");
    console.log(retorno + "lo otro");
   return retorno;
}


