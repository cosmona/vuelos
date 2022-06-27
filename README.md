# FlightFinder

FlightFinder, o Busca Vuelos es una aplicación que se encarga de buscar los 5 vuelos mas baratos entre 2 aeropuertos dados.

[CSS1](https://vuelosinaki.netlify.app/inaki.html)
[CSS2](https://vuelosinaki.netlify.app/inaki.html)
[CSS3](https://vuelosinaki.netlify.app/inaki.html)

## Especificaciones dadas

- La aplicación debe mostrar una página inicial con el título y un formulario con dos campos de texto y un botón.
- Los campos de texto deben permitir introducir el código IATA 1 de 3 letras.
- El formulario solo se puede enviar si los dos campos están cubiertos con 3 caracteres cada uno.
- La aplicación asume que el vuelo es para una persona y con fecha del día siguiente al actual.
- Al enviar el formulario la aplicación debe hacer una petición a la API de Amadeus de forma correcta y recoger el resultado.
- Después de tener el resultado la aplicación debe extraer la información del vuelo más barato y mostrarlos en la página debajo del formulario.
- Si hay algún error (aeropuertos no existen, no hay vuelos, error de conexión, etc...) la aplicación debe informar del error en pantalla.
- La aplicación debe permitir repetir la búsqueda con otros aeropuertos.

## Cambios hechos por el equipo

- Campos de texto permiten más de 3 letras, detectando y dando sugerencias de posibles ciudades.
- El usuario puede especificar tanto la cantidad de pasajeros como la fecha de viaje.
- Se mostrarán los 5 vuelos mas baratos entre las ciudades dadas, organizadas en orden alfabetico.
- Existe la posibilidad de mostrar los detalles del vuelo al hacer click en el vuelo deseado.
- Se pueden ver las restricciones que el pais de destino tiene con respecto al covid.

## APIs usadas

Siguiendo las indicaciones dadas, esta página utiliza multiples APIs creadas por [Amadeus](https://developers.amadeus.com/)

1- [Flight offer search](https://developers.amadeus.com/self-service/category/air/api-doc/flight-offers-search)
2- [Airport & city search](https://developers.amadeus.com/self-service/category/air/api-doc/airport-and-city-search)
3- [Travel restrictions](https://developers.amadeus.com/self-service/category/covid-19-and-travel-safety/api-doc/travel-restrictions)
4- [MockApi](https://mockapi.io/)

### 1- Busca vuelos

API que nos permitirá obtener la información de los vuelos que necesitamos, con acceso a itinerarios de mas de 500 aerolineas. La busqueda nos devolverá los vuelos desde el más barato al más costoso, con un límite de 250 objetos.
La información obtenida incluye: detalles de los vuelos, posibles escalas, horarios de los mismos, detalles de precios, posibilidad de poner ida y vuelta y equipaje, entre otras cosas.

### 2- Busqueda de ciudades

API que recibe el nombre de las posibles ciudades y automáticamente devuelve información de las mismas, incluyendo nombre completo del aeropuerto, codigo IATA, dónde se localiza el aeropuerto, número de pasajeros que transitan por este anualmente y coordenadas, entre otras.

**_Límites_**

Esta API solo tiene datos de destinos en:

- Estados Unidos
- España
- Reino Unido
- Alemania
- India

### API para especificaciones covid

API que dará toda la información necesaria con relación a las restricciones que actualmente vigentes en el pais de destino, se puede obtener:

- Estadísticas: total de casos, casos activos y porcentaje de infecciones por cada 100.000 habitantes.
- Restricciones: restricciones y prohibiciones de viaje, posibles requerimientos necesarios para entrar al pais o procedimientos de cuarentena.
- Regulaciones: regulaciones, zonas con mas casos, aislamiento, confinamiento, toques de queda y leyes de mascarilla.

**_¡Importante!_**

Esta API tiene un número máximo de llamadas para un usuario sin pagar, puede hacer 200 llamadas.

### API MockUp

Esta API nos permite recrear llamadas a otras APIs, nos permite definir la estructura de los datos, su relacion, posibles errores y otras caracteristicas de la API que se esta recreando.

Se usa esta API debido a el limite de llamadas que se nos impone en la que nos da la informacion sobre las restricciones por Covid-19

## Recusos

Pantalla de carga: esperando recursos

## Desarrolladores

Alejandra Latorraca Población, Iñaki Perez Fernández y Mario Collar Álvarez
