@echo off
echo "Starting Geoindoor..."
PING localhost -n 2 >NUL
cd .\geoindoor\
python -m http.server 9000
pause