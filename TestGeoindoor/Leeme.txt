
#---# ATENCIÓN!!!! #---#

- El test se ha realizado con Selenium, para ejecutarlo debe tener ejecutada la herramienta (lanzada en el puerto 9000),
debe ejecutar "inicio.bat".

- Para elegir con que navegador lanzar el test, por defecto aparecerá Firefox si le pasa al test como argumento un 1,
se lanzará con Google Chrome.

- Existe un vídeo que recoge la prueba: "Test.mp4".

- No se recogen todas las funciones y funcionalidades de Goeindoor ya que entonces el test se haría demasiado largo,
y poco útil.

- Hay dos puntos que no están automatizados, la elección de un plano y el de introducción de la cuenta, ya que no se
sabe el path del plano, y el sistema de autorización de google no permite la introducción automática.

- Se proporciona una cuenta con la que hacer pruebas, en el fichero "TestCuenta.txt" 

- El fichero con el test en java se encuentra en "Test.zip", es importable como un proyecto. 

- Se proporciona los WebDriver de Firefox (geckodriver) y de Google Chrome, además de los jar correspondientes de 
Selenium. 