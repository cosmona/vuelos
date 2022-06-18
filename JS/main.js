"using strict";
/* var myHeaders = new Headers();
myHeaders.append("Content-type", "application/x-www-form-urlencoded");

var urlencoded = new URLSearchParams();
urlencoded.append("grant_type", "client_credentials");

todo: ocultar los tokens, id y secret
rlencoded.append("client_id", "RZmM20pVrP5mwD6DA52ebS0JHoM2aZ6I");
urlencoded.append("client_secret", "hyezkVaUsomG0Usw");

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
  redirect: 'follow'
};

fetch("https://test.api.amadeus.com/v1/security/oauth2/token", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
   */

/* 
  ?
  ? Inicializacion de variables
  ?
  ? */
/*
 *  originLocation-> origen del vuelo
 *  destinationLocation-> destino del vuelo
 *  deptDate-> fecha de salida
 *  numAdultos-> numero de personas que vuelan, al principio solo 1
 *  maxFlights-> numero de vuelos que se obtendran con el API, se puede obtener 250
 *  flightClass-> Economy porque no hay plata
 *
 * esto luego de los ejemplos agarrala la info de el form html
 */
let originLocation = "SYD";
let destinationLocation = "BKK";
let deptDate = "2022-11-01";
let numAdultos = 1;
let maxFlights = 1;
let flightClass = "ECONOMY";
/*
 *  principio de el enlace que luego se va a llenar de info
 *  los campos estan separados por un &
 */
let enlace = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originLocation}&destinationLocationCode=${destinationLocation}&departureDate=${deptDate}&adults=${numAdultos}&travelClass=ECONOMY&max=${maxFlights}`;

console.log(enlace); //debbug

function vuelosDisponibles(link) {
  let myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer eMDKatLQxfKQpRet0JLHHkUYanEA");

  let urlencoded = new URLSearchParams();

  let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  let trying = {};

  trying = fetch(link, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      //console.log(typeof result, result);
      result = JSON.parse(result);
      // console.log(typeof result, result);
      return result;
    })
    .catch((error) => console.log("error", error));

  //debbug
  console.log(trying);
  console.log("Llamando trying");
  return trying;
}

vuelosDisponibles(enlace);
