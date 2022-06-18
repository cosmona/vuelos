function getToken() {
  var myHeaders = new Headers();
  myHeaders.append("Content-type", "application/x-www-form-urlencoded");

  var urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");
  urlencoded.append("client_id", "RZmM20pVrP5mwD6DA52ebS0JHoM2aZ6I");
  urlencoded.append("client_secret", "hyezkVaUsomG0Usw");

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  return fetch(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => JSON.parse(result).access_token)
    .catch((error) => console.log("error", error));
}

function vuelosDisponibles(link, accessToken) {
  let myHeaders = new Headers();

  myHeaders.append("Authorization", `Bearer ${accessToken}`);

  let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  let vuelos = fetch(link, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      result = JSON.parse(result);
      return result;
    })
    .catch((error) => console.log("error", error));
  return vuelos;
}

/*  originLocation-> origen del vuelo
    destinationLocation-> destino del vuelo
    deptDate-> fecha de salida
    numAdultos-> numero de personas que vuelan, al principio solo 1
    maxFlights-> numero de vuelos que se obtendran con el API, se puede obtener 250
    flightClass-> Economy porque no hay plata
    esto luego de los ejemplos agarrala la info de el form html */

let originLocation = "SYD";
let destinationLocation = "BKK";
let deptDate = "2022-11-01";
let numAdultos = 1;
let maxFlights = 1;
let flightClass = "ECONOMY";
let enlace = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originLocation}&destinationLocationCode=${destinationLocation}&departureDate=${deptDate}&adults=${numAdultos}&travelClass=ECONOMY&max=${maxFlights}`;

getToken().then((res) => {
  console.log("res", res);
  vuelosDisponibles(enlace, res).then((result) => console.log(result));
});

//console.log('getToken();', getToken());
