"using strict";

// Función Token Generator
function tokenGen() {
  let myHeaders = new Headers();
  myHeaders.append("Content-type", "application/x-www-form-urlencoded");

  let urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");
  urlencoded.append("client_id", "RZmM20pVrP5mwD6DA52ebS0JHoM2aZ6I");
  urlencoded.append("client_secret", "hyezkVaUsomG0Usw");

  let requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  let resultado = fetch(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      result = JSON.parse(result);
      resultadoFetch = result.access_token;
      //return JSON.stringify(result.access_token);
      let listadoVuelos = vuelosDisponibles(enlace, result.access_token);
    })
    .catch((error) => console.log("error", error));
  console.log("resultado", resultado);
  return JSON.stringify(resultado);
}

function vuelosDisponibles(link, accessToken) {
  console.log("funciona cabrón", accessToken);
  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${accessToken}`);

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
  //console.log(trying);
  //console.log("Llamando trying");
  return trying;
}
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
let enlace = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originLocation}&destinationLocationCode=${destinationLocation}&departureDate=${deptDate}&adults=${numAdultos}&travelClass=ECONOMY&max=${maxFlights}`;

//  principio de el enlace que luego se va a llenar de info
//  los campos estan separados por un &

//console.log(enlace); //debbug

let resultadoFetch;
let accessToken = tokenGen();
console.log("aquí", resultadoFetch);
let listadoVuelos = vuelosDisponibles(enlace, accessToken);
//console.log(listadoVuelos);
