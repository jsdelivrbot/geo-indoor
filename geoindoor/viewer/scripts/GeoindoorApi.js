// getEdificio()
// Recoge el nombre del edificio y la retorna como String
function getEdificio(){
    var edificio = document.getElementsByName("nombreEdificio")[0];
    if(!edificio.value || edificio.value == undefined) return false;
    return edificio.value;
}
// getBuidEdificio()
// Recoge el nombre del edificio y la retorna como String
function getBuidEdificio(){
    var edificioBuid = document.getElementsByName("buidEdificio")[0];
    if(!edificioBuid.value || edificioBuid.value == undefined) return false;
    return edificioBuid.value;
}
// getBuidEdificio()
// Recoge los pois del edificio y la retorna como String
function getPoisEdificio(){
	var poisEdificio = document.getElementsByName("poisEdificio")[0];
    if(!poisEdificio.value || poisEdificio.value == undefined) return false;
    return poisEdificio.value;
}

// choseEdificio(poi)
// para elgeir edificio
function choseEdificio(poi){
	var poisEdificio = getPoisEdificio();
	if(!poisEdificio) return false;
	var poisEdificio = JSON.parse(poisEdificio);
	var keys = Object.keys(poisEdificio);
	keys.forEach(function(key) {
		if(poi == poisEdificio[key]["puid"] ){
			return true;
		}
		
	});
	return false;
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


// getEdificios()
// retorna todos los edificios con rutas
function getEdificios() {
	var nombreEdificio = getEdificio();
	if(!nombreEdificio) return false;

	var retorno;
	$.ajax({
      type: "GET",
      url: "https://geoindoorapi.herokuapp.com/Edificios",
      success: function(retornodata) {
          retorno=retornodata;
          var edificios = [];
          var idEdificios = Object.keys(retornodata);
          idEdificios.forEach(function(key) {
          	if(retornodata[key]["nombre"].toLowerCase() == nombreEdificio.toLowerCase()){
          		var edificio = {
          			idmail: retornodata[key]["idmail"],
          			nombre: retornodata[key]["nombre"]
          		}
          		edificios.push(edificio);
          	}
          });
          console.log(JSON.stringify(edificios) + "SHIUUUUU");
          if(edificios.lenght < 1) return false;

          //Rutas Edificio
          edificios.forEach(function(elemento) {
          	//console.log(elemento["idmail"] + " lo del mail");
          	//console.log(elemento["nombre"] + " lo del nombre");
	          	var mydatarequest = {
	          		email: elemento["idmail"],
	          		edificio: elemento["nombre"]
	          	}
	          	$.ajax({
			      type: "POST",
			      url: "https://geoindoorapi.herokuapp.com/Rutas/Edificio",
			      data: mydatarequest,
			      success: function(retornodata) {
			      	  //var todosPuntos = [];
			          /*var id = Object.keys(retornodata)[0];
			          var rutas = retornodata[id];
			          var idrutaskeys = Object.keys(rutas);
			          var key = Object.keys(rutas)[0];
			          if(!key) return false;
			          //var ruta = rutas[key];
			          var puntos = rutas[key]["puntos"];
			          var punto = JSON.parse(puntos)[0];
			          console.log(punto + " lo delos puntos");
			          var buid = getBuidEdificio();
			          var poisEdificio = getPoisEdificio();
			          if(!buid) return false;
			          if(choseEdificio(punto)){
						var poisEdificio = JSON.parse(poisEdificio);
						var keys = Object.keys(poisEdificio);
						var options = [];
						keys.forEach(function(key) {
							idrutaskeys.forEach(function(id) {
								if(rutas[id]["puntos"].indexOf(poisEdificio[key]["puid"]) != -1){
									var object = {
										nombre: rutas[id]["nombre"]
									}
								}
							});
							
							
						});
			          	var keys = Object.keys(rutas);
			          	showRoutes();
			          }*/
			          console.log(retornodata);
			         
			          
			      },
			      error: function(retornodata) {
			      	console.log(retornodata);
			      }

	    	   });
	          	console.log("casa");

           });
          
         




      },
      error:function(retornodata) {
          retorno=false;
      }
    });

    return retorno;
}