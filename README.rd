#FlightFinder

FlightFinder, o Busca Vuelos es una aplicación que se encarga de buscar los 10 primeros vuelos mas baratos entre 2 aeropuertos dados

##Especificaiones dadas

- La aplicación debe mostrar una página inicial con el título y un formulario con dos campos de texto y un botón.
- Los campos de texto deben permitir introducir el código IATA 1 de 3 letras.
- El formulario solo se puede enviar si los dos campos están cubiertos con 3 caracteres cada uno.
- La aplicación asume que el vuelo es para una persona y con fecha del día siguiente al actual.
- Al enviar el formulario la aplicación debe hacer una petición a la API de Amadeus de forma correcta y recoger el resultado.
- Después de tener el resultado la aplicación debe extraer la información del vuelo más barato y mostrarlos en la página debajo del formulario.
- Si hay algún error (aeropuertos no existen, no hay vuelos, error de conexión, etc...) la aplicación debe informar del error en pantalla.
- La aplicación debe permitir repetir la búsqueda con otros aeropuertos.


##Cambios hechos por el equipo

- Campos de texto permiten mas de 3 letras, detectando  y dando sujerencias de posibles ciudades
- El usuario puede especificar tanto la cantidad de pasajeros como la fecha a viajar
- Se mostraran los 10 vuelos mas baratos entre las ciudades dadas, organizadas en orden alfabetico
- Existe la posibilidad de mostrar los detalles del vuelo al hacer click en el vuelo deseado
- Se pueden ver las restricciones que el pais de destino tiene con respecto al covid 


##APIs usadas

Siguiendo las indicaciones dadas, esta pagina utiliza multiples APIs creadas por [Amadeus](https://developers.amadeus.com/) 
1- (Flight offer search)[https://developers.amadeus.com/self-service/category/air/api-doc/flight-offers-search] 
2- (Airport & city search)[https://developers.amadeus.com/self-service/category/air/api-doc/airport-and-city-search]  
3- (Travel restrictions)[https://developers.amadeus.com/self-service/category/covid-19-and-travel-safety/api-doc/travel-restrictions] 



###1- Busca vuelos
API que nos permitira obtener la informacion de los vuelos que necesitamos, con acceso a itinerarios de mas de 500 aerolineas. La busqueda nos devolvera los vuelos desde el mas barato al mas costoso, con un limite de 250 objetos que se pueden regresar.
Informacion que regresa incluye: detalles de los vuelos, posibles escalas, horarios de estos, detalles de precios, posibilidad de poner ida y vuelta, equipaje, entre otras cosas

###2- Busqueda de ciudades
API que recibe nombre de las posibles ciudades y automaticamente nos da opciones de estas, incluyendo nombre completo del aeropuerto, codigo IATA, donde se localiza el mismo, numero de pasajeros que transitan por este anualmente, coordenadas entre otros

***Limitantes***
Esta API solo tiene datos de destinos en:
- Estados Unidos
- España
- Reino Unido
- Alemania
- India 

###API para especificaciones covid
 API que dara toda la informacion necesaria con relacion a las restricciones que estan actualmente siendo seguidas en el pais de destino, se puede obtener:
 - Estadisticas: total de casos, casos activos y porcentaje de infecciones por cada 100.000 habitantes
 - Restricciones: restricciones y prohibiciones de viaje, posibles requerimientos necesarios para entrar al pais o procedimientos de cuarentena
 - Regulaciones: regulaciones, zones con mas casos, aislamiento, confinamiento, toques de queda y leyes de mascarilla

 ***¡Importante!***
  Esta API tiene un numero maxima de llamadas que un usuario no pago puede hacer de 200 llamadas

###Contribuyentes
Alejandra Latorraca Población, Iñaki Perez y Mario Collar Álvarez