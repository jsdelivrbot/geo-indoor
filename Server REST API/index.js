/************************************************************
*															*
* Autor: Juan Pedro Pascual Vitores							*
* Fecha: 25/06/17											*
* Versión: 1.0												*
*															*
*************************************************************
*															*
* - Las comparaciones se hacen ignorando la distinción		*
* entre mayúsculas y minísculas.							*
*															*
* - Los edificios, emails y rutas (nombres), no se 			*
* disntinguirá entre mayúsculas y minúsculas. 				*
*															*
* UBU = Ubu = UbU = ubu = uBu = ubU	= UBu					*
*															*
* - Si se intenta añadir uno de estos nombres, el nombre 	*
* quedará sobreescrito con el nuevo nombre pero con los     *
* valores anteriores.										*
*															*
*************************************************************/



var express = require('express');
var app = express();
var path = require('path')
var serveStatic = require('serve-static')


app.set('port', (process.env.PORT || 5000));


var bodyParser = require("body-parser");
app.use(bodyParser.json());//soporte para codificar json
app.use(bodyParser.urlencoded({extended: true})); // Soporte para decodificar las urls

var firebase = require("firebase");

firebase.initializeApp({
  serviceAccount: "geoindoorDB-cae0e18aff1f",
  databaseURL: "https://geoindoordb.firebaseio.com"
});

/*
// Lo anterior
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});*/

/*
************************AÑADIR FLOOR+++++++++++++++++++++

*/



app.use('/', express.static(__dirname + '/geoindoor/'));



app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'accept, content-type, x-parse-application-id, x-parse-rest-api-key, x-parse-session-token');
     // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
});

// GET
// https://geoindoorapi.herokuapp.com/Contador
// Devuelve el contador de edificios
app.get('/Contador',function(request,response) {
	var db = firebase.database();
	var ref = db.ref("Contador/");
	var respuestaux;
	ref.on("value", function (snapshot) {
		respuestaux=snapshot.val();
	});
	response.send(respuestaux);
});
// POST
// https://geoindoorapi.herokuapp.com/CrearEdificio
// Añadir un nuevo edificio
app.post("/CrearEdificio", function(request, response) {

	var db = firebase.database();
	var nombreEdificio = request.body.edificio;
	var mail = request.body.email;
	var contrasena = request.body.contrasena;

	var idMail = getIdEmail(db,mail);
	var idEdificio;
	var edificios=JSON.parse(getEdificios(db));
	var emails = JSON.parse(getEmails(db));

	if (!idMail){
		var emails = JSON.parse(getEmails(db));
		if(!emails){
			idMail="e1";
		}else{
			var keys = Object.keys(emails);
			var lastid=0;
			keys.forEach(function(key) {
				if(getNumber(key)>lastid){
					lastid=getNumber(key);
				}
			});
			idMail="e" + (++lastid);
		}
		var Emails = db.ref("Emails/" + idMail );
		Emails.set({
			email: mail,
			contrasena: contrasena
		});
		//Obtener el siguiente id
		var edificios=JSON.parse(getEdificios(db));
		if(!edificios){
			idEdificio="id1";
		}else{
			var keys = Object.keys(edificios);
			var lastid=0;
			keys.forEach(function(key) {
				if(getNumber(key)>lastid){
					lastid=getNumber(key);
				}
			});
			idEdificio="id" + (++lastid);
		}
		var Edificio = db.ref("Edificios/" + idEdificio);
		Edificio.set({
			nombre: nombreEdificio,
			idmail: mail
		});
		var Contador = db.ref("Contador/");
		Contador.set({
			id: idEdificio
		});
		response.status = 200;
		response.send( nombreEdificio + " idEdificio " );
	}else{

		if( !validacion(db,mail,contrasena) ){
			response.status = 400;
			response.send('Incorrect password ' + idEdificio + "idEdificio");
			return;
		}
		var edificios=JSON.parse(getEdificios(db));
		if(!edificios){
			idEdificio="id1";
		}else{
			var keys = Object.keys(edificios);
			var lastid=0;
			keys.forEach(function(key) {
				if(getNumber(key)>lastid){
					lastid=getNumber(key);
				}
			});
			idEdificio="id" + (++lastid);
		}
		var Edificio = db.ref("Edificios/" + idEdificio);
		Edificio.set({
			nombre: nombreEdificio,
			idmail: mail
		});
		var Contador = db.ref("Contador/");
		Contador.set({
			id: idEdificio
		});
		response.status = 200;
		response.send( nombreEdificio + " idEdificio " );
		
	}

});
// POST
// https://geoindoorapi.herokuapp.com/Ruta
// Añadir ruta nueva, a un edificio con unos puntos determinados
app.post("/Ruta", function(request, response) {

	var db = firebase.database();
	var nombreEdificio = request.body.edificio;
	var mail = request.body.email;
	var nombreRuta = request.body.ruta;
	var puntos = request.body.puntos;
	var camino = request.body.camino;
	var contrasena = request.body.contrasena;

	

	var idMail = getIdEmail(db,mail);
	var idEdificio = getIdEdificio(db,nombreEdificio,mail);
	var idEdificioRutas = Object.keys(JSON.parse(getRutasEdificio(db,nombreEdificio,mail)))[0];
	var idRuta = getIdRuta(db,nombreEdificio,nombreRuta,mail);
	
	if (!idMail){
		var emails = JSON.parse(getEmails(db));
		if(!emails){
			idMail="e1";
		}else{
			var keys = Object.keys(emails);
			var lastid=0;
			keys.forEach(function(key) {
				if(getNumber(key)>lastid){
					lastid=getNumber(key);
				}
			});
			idMail="e" + (++lastid);
		}
		var Emails = db.ref("Emails/" + idMail );
		Emails.set({
			email: mail,
			contrasena: contrasena
		});
		//Obtener el siguiente id
		var edificios=JSON.parse(getEdificios(db));
		if(!edificios){
			idEdificio="id1";
		}else{
			var keys = Object.keys(edificios);
			var lastid=0;
			keys.forEach(function(key) {
				if(getNumber(key)>lastid){
					lastid=getNumber(key);
				}
			});
			idEdificio="id" + (++lastid);
		}
		var Edificio = db.ref("Edificios/" + idEdificio);
		Edificio.set({
			nombre: nombreEdificio,
			idmail: mail
		});
		var Contador = db.ref("Contador/");
		Contador.set({
			id: idEdificio
		});
		idEdificioRutas = idEdificio + "rutas";
		idRuta = "r1";
		var Rutas = db.ref("Edificios/Rutas/" + idEdificioRutas + "/" + idRuta + "/");
		Rutas.set({
			nombre: nombreRuta,
			puntos: puntos,
			ruta: camino
		});

		response.status = 200;
		response.send(nombreRuta + " idMail " +  idMail + " emails " + emails);

	}else if( !idEdificio ){

		if( !validacion(db,mail,contrasena) ){
			response.status = 400;
			response.send('Incorrect password ' + idEdificio + "idEdificio");
			return;
		}
		var edificios=JSON.parse(getEdificios(db));
		if(!edificios){
			idEdificio="id1";
		}else{
			var keys = Object.keys(edificios);
			var lastid=0;
			keys.forEach(function(key) {
				if(getNumber(key)>lastid){
					lastid=getNumber(key);
				}
			});
			idEdificio="id" + (++lastid);
		}
		var Edificio = db.ref("Edificios/" + idEdificio);
		Edificio.set({
			nombre: nombreEdificio,
			idmail: mail
		});
		var Contador = db.ref("Contador/");
		Contador.set({
			id: idEdificio
		});
		idEdificioRutas = idEdificio + "rutas";
		idRuta = "r1";
		var Rutas = db.ref("Edificios/Rutas/" + idEdificioRutas + "/" + idRuta + "/");
		Rutas.set({
			nombre: nombreRuta,
			puntos: puntos,
			ruta: camino
		});

		response.status = 200;
		response.send( nombreRuta + " idEdificio " );
		
	}else if(!idEdificioRutas){

		if( !validacion(db,mail,contrasena) ){
			response.status = 400;
			response.send('Incorrect password ' + idEdificioRutas + " idEdificioRutas");
			return;
		}

		idEdificioRutas = idEdificio + "rutas";
		idRuta = "r1";
		var Rutas = db.ref("Edificios/Rutas/" + idEdificioRutas + "/" + idRuta + "/");
		Rutas.set({
			nombre: nombreRuta,
			puntos: puntos,
			ruta: camino
		});

		response.status = 200;
		response.send( nombreRuta + " idEdificioRutas " );

	}else if(!idRuta){

		if( !validacion(db,mail,contrasena) ){
			response.status = 400;
			response.send('Incorrect password' + idRuta + " idRuta");
			return;
		}

		idEdificioRutas = idEdificio + "rutas";
		var rutasEdificio = JSON.parse(getRutasEdificio(db,nombreEdificio,mail));
		if(!rutasEdificio){
			idRuta = "r1";
		}else{
			var key = Object.keys(rutasEdificio)[0];
			rutasEdificio = rutasEdificio[key];
			var keys = Object.keys(rutasEdificio);
			var lastid=0;
			keys.forEach(function(key) {
				if(getNumber(key)>lastid){
					lastid=getNumber(key);
				}
			});
			idRuta = "r" + (++lastid);
		}
		
		var Rutas = db.ref("Edificios/Rutas/" + idEdificioRutas + "/" + idRuta + "/");
		Rutas.set({
			nombre: nombreRuta,
			puntos: puntos,
			ruta: camino
		});


		response.status = 200;
		response.send( nombreRuta + " idRuta " );

	}else{
		//Update 
		if( !validacion(db,mail,contrasena) ){
			response.status = 400;
			response.send('Incorrect password' + "Update");
			return;
		}

		var Emails = db.ref("Emails/" + idMail );
		Emails.set({
			email: mail,
			contrasena: contrasena
		});

		var Edificio = db.ref("Edificios/" + idEdificio);
		Edificio.set({
			nombre: nombreEdificio,
			idmail: mail
		});

		var Rutas = db.ref("Edificios/Rutas/" + idEdificioRutas + "/" + idRuta + "/");
		Rutas.set({
			nombre: nombreRuta,
			puntos: puntos,
			ruta: camino
		});

		response.status = 200;
		response.send(nombreRuta + " Update ");
	}
	
});


// POST
// https://geoindoorapi.herokuapp.com/EdificioDelete
// Borrar Edificio y todo lo relacionado
app.post("/EdificioDelete", function(request, response) {

	var db = firebase.database();
	var nombreEdificio = request.body.edificio;
	var mail = request.body.email;
	var contrasena = request.body.contrasena;

	if( !validacion(db,mail,contrasena) ){
		response.status = 400;
		response.send('Incorrect password');
		return;
	}
	var idMail = getIdEmail(db,mail);
	var idEdificio = getIdEdificio(db,nombreEdificio,mail);
	var idEdificioRutas = Object.keys(JSON.parse(getRutasEdificio(db,nombreEdificio,mail)))[0];

	
	if ( !idMail ){
		response.status = 400;
		response.send('Impossible to remove the building, idMail does not exist');
	}else if(!idEdificio){
		response.status = 400;
		response.send('Impossible to remove the building, idEdificio does not exist');
	}else if(!idEdificioRutas){
		response.status = 400;
		response.send('Impossible to remove the building, idEdificioRutas does not exist');
	}else{
		var Edificio = db.ref("Edificios/" + idEdificio);
		Edificio.remove();

		var Rutas = db.ref("Edificios/Rutas/" + idEdificioRutas);
		Rutas.remove();

		response.status = 200;
		response.send(nombreEdificio + " removed ");
	}
	
});

// POST
// https://geoindoorapi.herokuapp.com/RutaDelete
// Borrar ruta, de un edificio
app.post("/RutaDelete", function(request, response) {

	var db = firebase.database();
	var nombreEdificio = request.body.edificio;
	var mail = request.body.email;
	var nombreRuta = request.body.ruta;
	var contrasena = request.body.contrasena;

	if( !validacion(db,mail,contrasena) ){
		response.status = 400;
		response.send('Incorrect password');
		return;
	}

	var idMail = getIdEmail(db,mail);
	var idEdificio = getIdEdificio(db,nombreEdificio,mail);
	var idEdificioRutas = Object.keys(JSON.parse(getRutasEdificio(db,nombreEdificio,mail)))[0];
	var idRuta = getIdRuta(db,nombreEdificio,nombreRuta,mail);
	
	if (!idMail){
		response.status = 400;
		response.send('Impossible to delete the route, idMail');
	}else if( !idEdificio ){
		response.status = 400;
		response.send('Impossible to delete the route, idEdificio');
	}else if(!idEdificioRutas){
		response.status = 400;
		response.send('Impossible to delete the route, idEdificioRutas');
	}else if(!idRuta){
		response.status = 400;
		response.send('Impossible to delete the route, idRuta');
	}else{

		var Ruta = db.ref("Edificios/Rutas/" + idEdificioRutas + "/" + idRuta + "/");
		Ruta.remove();

		response.status = 200;
		response.send(nombreRuta + " removed ");
	}
	
});

// POST
// https://geoindoorapi.herokuapp.com/Rutas/EdificioArchitect
// Devuelve las rutas relativas a un edifico con el idEdificioRutas
app.post("/Rutas/EdificioArchitect", function(request, response) {

	var db = firebase.database();
	var nomEdificio = request.body.edificio;
	var email = request.body.email;
	var contrasena =  request.body.contrasena;
	var respuesta=getRutasEdificio(db,nomEdificio,email);

	if(!respuesta){
		response.status = 400;
		response.send('There are not routes');
	}else{
		//response.setHeader("Content-Type","aplication/json");
		response.status = 200;
		//response.send(respuesta);
		response.send(JSON.parse(respuesta));
	}
});

// POST
// https://geoindoorapi.herokuapp.com/Rutas/Edificio
// Devuelve las rutas relativas a un edifico con el idEdificioRutas
app.post("/Rutas/Edificio", function(request, response) {

	var db = firebase.database();
	var idEdificio = request.body.idedificio;
	
	var respuesta = _getRutasEdificio(db,idEdificio);
	if(!respuesta){
		response.status = 400;
		response.send('There are not routes');
	}else{
		//response.setHeader("Content-Type","aplication/json");
		response.status = 200;
		//response.send(respuesta);
		response.send(JSON.parse(respuesta));
	}
});

// GET
// https://geoindoorapi.herokuapp.com/Rutas
// Devuelve los edificios con los identificadores
app.get("/Edificios", function(request, response) {

	var db = firebase.database();
	var respuesta=getEdificios(db);
	if(!respuesta){
		response.status = 400;
		response.send('There are not Buildings');
	}else{
		//response.setHeader("Content-Type","aplication/json");
		response.status = 200;
		response.send(JSON.parse(respuesta));
	}
	
});


// GET
// https://geoindoorapi.herokuapp.com/Rutas
// Devuelve los mails con los identificadores
app.get("/Emails", function(request, response) {

	var db = firebase.database();
	var respuesta=getEmails(db);
	if(!respuesta){
		response.status = 400;
		response.send('There are not Emails');
	}else{
		//response.setHeader("Content-Type","aplication/json");
		response.status = 200;
		response.send(JSON.parse(respuesta));
	}
	
});

// getEdificios(db,idmail)
// Devuelve los edificios de idmail que hay en la base de datos, con sus identificadores
function getEdificios(db){
	var respuesta;
	var ref = db.ref("Edificios/");

	ref.on("value", function (snapshot) {
		respuestaux=snapshot.val();
	});
	var keys=Object.keys(respuestaux);

	if(!keys) return false;

	var i=1;
	keys.forEach(function(key){
		if(i==2){
			respuesta="\"" + key + "\" : " + JSON.stringify(respuestaux[key]) ;
		}else if(i>2){
			respuesta=respuesta + ", " + "\"" + key + "\" : " + JSON.stringify(respuestaux[key]);
		}
		i++;
	});
	if(!respuesta) return false;
	respuesta="{"+ respuesta +"}";
	return respuesta;
}

// getEdificios(db,idmail)
// Devuelve los edificios de idmail que hay en la base de datos, con sus identificadores
function getEdificiosIdMail(db,idmail){
	var respuesta = false;
	var ref = db.ref("Edificios/");

	ref.on("value", function (snapshot) {
		respuestaux=snapshot.val();
	});
	var keys=Object.keys(respuestaux);

	if(!keys) return false;

	var i=1;
	keys.forEach(function(key){
		if( respuestaux[key]["idmail"] && idmail.toLowerCase() == respuestaux[key]["idmail"].toLowerCase() ){
			if(i==1){
				respuesta="\"" + key + "\" : " + JSON.stringify(respuestaux[key]) ;
			}else{
				respuesta=respuesta + ", " + "\"" + key + "\" : " + JSON.stringify(respuestaux[key]);
			}
			i++;
		}
	});
	if ( respuesta == false ) return false;
	respuesta="{"+ respuesta +"}";
	return respuesta;
}


// getIdEdificio(db,edificio)
// Retorna el id del edificio o false si no le encuentra
function getIdEdificio(db,edificio,idmail) {
	var edificios=JSON.parse(getEdificiosIdMail(db,idmail));
	if(!edificios) return false;

	var keys=Object.keys(edificios);
	var retorno=false;
	keys.forEach(function(key){
		if( edificios[key]["nombre"].toLowerCase() == edificio.toLowerCase() ){
			retorno = key;
		}
	});
		return retorno;
}



// getRutasEdificio(db)
// Devuelve los edificios que hay en la base de datos, con sus identificadores
function getRutasEdificio(db,nomEdificio,idmail){
	var idEdificio = getIdEdificio(db,nomEdificio,idmail);
	if(!idEdificio) return false;
	var respuesta;
	var rutasEdificio=false;
	var retorno;
	var ref = db.ref("Edificios/Rutas/");

	ref.on("value", function (snapshot) {
		respuesta=snapshot.val();
	});
	keys=Object.keys(respuesta);
	keys.forEach(function(key){
		if( key == idEdificio + "rutas" ){
			rutasEdificio = respuesta[key];
		}
	});
	if(!rutasEdificio) return false;
	retorno = "{\"" + idEdificio+"rutas\"" + ":" + JSON.stringify(rutasEdificio) + "}" ;
	return retorno;
}

// getRutasEdificio(db)
// Devuelve los edificios que hay en la base de datos, con sus identificadores
function _getRutasEdificio(db,idEdificio){
	var respuesta;
	var ref = db.ref("Edificios/Rutas/" + idEdificio + "rutas");

	ref.on("value", function (snapshot) {
		respuesta=snapshot.val();
	});
	if (!respuesta) { return false;}
	
	return JSON.stringify(respuesta);
}

//getIdRuta(db,nombreEdificio,nombreRuta)
// retorna el id de la ruta con sus valores
function getIdRuta(db,nombreEdificio,nombreRuta,idmail) {
	var rutasEdificio = JSON.parse(getRutasEdificio(db,nombreEdificio,idmail));
	if(!rutasEdificio) return false;
	var retorno=false;

	edificioRutaKey=Object.keys(rutasEdificio)[0];
	if(!edificioRutaKey) return false;
	rutasEdificio=rutasEdificio[edificioRutaKey];
	keys=Object.keys(rutasEdificio);
	keys.forEach(function(key){
		if( rutasEdificio[key]["nombre"].toLowerCase() == nombreRuta.toLowerCase()){
			retorno = key;
		}
	});
	if(!retorno) return false;
	return retorno;
}


// getEmails(db)
// Devuelve emails con sus identificadores
function getEmails(db) {
	var ref = db.ref("Emails/");
	var respuesta;
	ref.on("value", function (snapshot) {
		respuesta=snapshot.val();
	});
	//if(!respuesta) return false;
	return JSON.stringify(respuesta);
}

// getEmails(db)
// Devuelve emails con sus identificadores
function getIdEmail(db,email) {
	var emails = JSON.parse(getEmails(db));
	var respuesta = false;
	keys=Object.keys(emails);
	keys.forEach(function(key){
		var mykey=key.toString();
		if( emails[key]["email"] == email ){
			respuesta = key;
		}
	});
	return respuesta;
}

// getNumber(string)
// Se le pasa una cadena de testo y devuelve el numero entero contenido en el texto
function getNumber(cadena) {
	var retorno = cadena.replace(/[a-zA-z]/g,'');
	return parseInt(retorno);
}

// validacion(db,mail,contrasena)
// Retorna true o false si es la contraseña adecuada
function validacion(db,email,contrasena) {
	var emails = JSON.parse(getEmails(db));
	var idemail = getIdEmail(db,email).toString();
	var retorno = false;
	console.info("idemail validacion " + idemail + " la otra " + email);
	console.info("contrasena validacion " + emails[idemail]["contrasena"] + " aqui la otra " + contrasena );
	if(!idemail) return false;

	if( emails[idemail]["contrasena"].toString() == contrasena ) retorno = true;

	return retorno;
}





app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


