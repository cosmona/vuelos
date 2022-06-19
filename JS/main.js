"use strict";
//& Obtiene el Token
function getToken() {
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

  return fetch(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => JSON.parse(result).access_token)
    .catch((error) => console.log("error", error));
}

//& Obtiene el los vuelos
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

//& Pinta un vuelo
function pintaVuelo(vuelo) {
  console.log("vuelo", vuelo);

  let aerolinea = vuelo.itineraries[0].segments[0].carrierCode;
  let escalas = vuelo.itineraries[0].segments.length - 1;
  let salida = vuelo.itineraries[0].segments[0].departure.at;
  salida = salida.slice(-8, -3);
  // let llegada = "00:00";
  let llegada = vuelo.itineraries[0].segments[escalas].arrival.at;
  llegada = llegada.slice(-8, -3);
  let duracion = vuelo.itineraries[0].duration;
  duracion = duracion.slice(2);
  let precio = vuelo.price.grandTotal;
  //console.log();
  console.log("ID: ", vuelo.id);
  console.log("hora salida: ", salida);
  console.log("hora llegada: ", llegada);
  console.log("escalas: ", escalas);
  console.log("duracion total: ", duracion);
  console.log("precio: ", precio);

  let domElement = document.querySelector(".vuelos");
  const newArticle = document.createElement("article");
  domElement.appendChild(newArticle);
  newArticle.innerHTML += `
	<p>${aerolinea}</p>
	<p> ${salida} - ${llegada}</p>
	<p>${escalas}</p>
	<p>${duracion}</p>
	<p>${precio} € </p>
	`;
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
let maxFlights = 11;
let flightClass = "ECONOMY";
let enlace = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originLocation}&destinationLocationCode=${destinationLocation}&departureDate=${deptDate}&adults=${numAdultos}&travelClass=ECONOMY&max=${maxFlights}`;

getToken().then((res) => {
  vuelosDisponibles(enlace, res).then((result) => {
    //console.log("result", result);

    for (let i = 0; i < result.data.length; i++) {
      //console.log("AQUI", result.data[i].id);
      //console.log("AQUI", result.data[i].price.grandTotal);
      pintaVuelo(result.data[i]);
    }
  });
});
