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
   
echo Starting Geoindoor...
PING localhost -n 2 >NUL
set "my_path=%cd%"
cd "%my_path%\geoindoor"
start server_init.bat

if "%1" == "" (
	start chrome "http://localhost:9000/index.html"
)

if "%1" == "chrome" ( 
	start chrome "http://localhost:9000/index.html"
)

if "%1" == "firefox" ( 
	start firefox "http://localhost:9000/index.html"
)

if "%1" == "iexplore" ( 
	start iexplore "http://localhost:9000/index.html"
)

if NOT "%1" == "" (
	if NOT "%1" == "chrome" ( 
		if NOT "%1" == "firefox" ( 
			if NOT "%1" == "iexplore" ( 
				start chrome "http://localhost:9000/index.html"
			)
		)
	)
)

