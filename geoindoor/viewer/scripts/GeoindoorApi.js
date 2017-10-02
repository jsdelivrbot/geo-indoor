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
// getPoisEdificio()
// Recoge los pois del edificio y la retorna como String
function getPoisEdificio(){
	var poisEdificio = document.getElementsByName("poisEdificio")[0];
    if(!poisEdificio.value || poisEdificio.value == undefined) return false;
    return poisEdificio.value;
}





