"use strict";
import { getToken } from "./token.js";
import { vuelosDisponibles, tellAirports } from "./api.js";
import { pintaVuelo, showSuggestions } from "./pinta.js";
import { loadingState } from "./carga.js";

//& Gestiona llamadas a los vuelos inputs origen / destino
async function gestionInputs(origen, destino, token) {
  let fecha = document.getElementById("start"); //~DOM
  let numAdultos = document.getElementById("pasajeros"); //~DOM

  let originLocation = origen;
  let destinationLocation = destino;
  let maxFlights = 5;
  let enlace = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originLocation}&destinationLocationCode=${destinationLocation}&departureDate=${fecha.value}&adults=${numAdultos.value}&max=${maxFlights}`;

  //* muestra loading
  loadingState(true);

  //* Origen y destino rellenados, procede a buscar vuelos
  const sect = document.querySelector(".vuelos");
  sect.innerHTML = "";
  let result = await vuelosDisponibles(enlace, token);

  //* si el listado de vuelos esta vacio manda false (error) a pintaVuelo
  //* sino selecciona lo que hay (listado de vuelos) y se lo pasa a pintaVuelo
  if (result.data.length === 0) {
    pintaVuelo(false);
  } else {
    let domElement = document.querySelector(".vuelos"); //~DOM
    //* por cada vuelo de la lista (11)
    for (let i = 0; i < result.data.length; i++) {
      pintaVuelo(result.data[i],token);
    }
  }

  //* oculta loading
  loadingState(false);
}

export { gestionInputs };
