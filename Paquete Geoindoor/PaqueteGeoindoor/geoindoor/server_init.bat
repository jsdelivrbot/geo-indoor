@echo off
echo 				       **********************
echo 				       *    ATTENTION !!!   *
echo 				       **********************
echo  **********************************************************************************************
echo  * 1.- Python has to be installed to run the application                                      *
echo  * 2.- The file named 'inicio.bat' has to be in the same path than the folder 'geoindoor'     *
echo  * 3.- The file named 'server_init.bat' has to be inside the folder 'geoindoor'               *
echo  *                                                                                            *
echo  * BROWSER:                                                                                   *
echo  * Default: Google Chrome                                                                     *
echo  *                                                                                            *
echo  * If you want to change the browser you have to execute the file 'inicio.bat', from the path *
echo  * where 'inicio.bat' is.                                                                     *
echo  *                                                                                            *
echo  * Mozilla Firefox: 'start inicio.bat firefox'                                                *
echo  * Internet Explorer: 'start inicio.bat iexplore'                                             *
echo  * Google Chrome: 'start inicio.bat chrome'                                                   *
echo  **********************************************************************************************
    
python -m http.server 9000
