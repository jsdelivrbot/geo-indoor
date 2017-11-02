@echo off
echo 				       *********************
echo 				       *    ATENTION !!!   *
echo 				       *********************
echo  **********************************************************************************************
echo  * 1.- Python has to be installed to run the application                                      *
echo  * 2.- The file named 'inicio.bat' has to be in the same path than the folder 'geoindoor'     *
echo  * 3.- The file named 'server_init.bat' has to be in the same path than the folder 'geoindoor'*
echo  **********************************************************************************************
    
python -m http.server 9000
