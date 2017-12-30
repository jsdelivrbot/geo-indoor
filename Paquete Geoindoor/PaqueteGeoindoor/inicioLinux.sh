#!/bin/bash

echo "				       **********************"
echo "				       *    ATTENTION !!!   *"
echo "				       **********************"
echo " **********************************************************************************************"
echo " * 1.- Python has to be installed to run the application                                      *"
echo " * 2.- The file named 'inicioLinux.sh' has to be in the same path than the folder 'geoindoor' *"
echo " *                                                                                            *"
echo " * BROWSER:                                                                                   *"
echo " * Default: Mozilla Firefox                                                                   *"
echo " *                                                                                            *"
echo " * Mozilla Firefox: 'bash inicioLinux.sh firefox'                                             *"
echo " * Google Chrome: 'bash inicioLinux.sh chrome'                                                *"
echo " **********************************************************************************************"

mypath=`dirname $0`
geoindoorpath="${mypath}/geoindoor"

if ! [[ -z "$1" ]]; then
	if [[ "$1" == "firefox" ]]; then
		firefox http://localhost:9000/
	elif [[ "$1" == "chrome" ]]; then
		google-chrome http://localhost:9000/
	else
		echo -e "\e[1;31mError: $1 is not valid value, try with 'firefox' or 'chrome' \e[0m"
		exit 1
	fi
else
	firefox http://localhost:9000/
fi	

cd "${geoindoorpath}/"

`python -V > /tmp/mypythontext 2>&1`
myversion=$( sed 's/^[^0-9]*//' /tmp/mypythontext | grep -o '^[0-9]' )

if [[ ${myversion} -gt 2 ]]; then
	#echo "3 OR MORE v-> ${myversion}"
	python -m http.server 9000
else
	#echo "2 OR LESS v-> ${myversion}"
	python -m SimpleHTTPServer 9000
fi