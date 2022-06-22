"use strict";
import { getToken } from "./token.js";
import { vuelosDisponibles, tellAirports } from "./api.js";
import { pintaVuelo, showSuggestions } from "./pinta.js";
import { loadingState } from "./carga.js";

//& Gestiona llamadas a los vuelos inputs origen / destino
async function gestionInputs(origen, destino, token) {
  let fecha = document.getElementById("start");
  let numAdultos = document.getElementById("pasajeros");
  //let tituloinputORIGEN = document.getElementById("origen"); //! no se usa

  let originLocation = origen;
  let destinationLocation = destino;
  let maxFlights = 11;
  let enlace = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originLocation}&destinationLocationCode=${destinationLocation}&departureDate=${fecha.value}&adults=${numAdultos.value}&max=${maxFlights}`;

  //* muestra loading
  loadingState(true); //! modificado inaki noche del domingo

  //* Origen y destino rellenados, procede a buscar vuelos
  const sect = document.querySelector(".vuelos"); //!resuelto fetch con async
  sect.innerHTML = "";
  let result = await vuelosDisponibles(enlace, token);
  if (result.data.length === 0) {
    pintaVuelo(false);
  } else {
    /*     //! NUEVO
    
    let domElement = document.querySelector(".vuelos"); //~DOM
    const newArticle = document.createElement("article"); //~DOM

    domElement.appendChild(newArticle);
    newArticle.innerHTML = `
      <p id="aerolinea">Aerolinea</p>
      <p>Salida - Llegada</p>
      <p>Escalas</p>
      <p>Tiempo de Vuelo</p>
      <p>Precio</p>
    `;
    newArticle.style.justifyContent = "space-around"; //! estilo de la tarjeta guia
    console.log("newArticle", newArticle);
     */

    for (let i = 0; i < result.data.length; i++) {
      pintaVuelo(result.data[i]);
    }
  }
  //* oculta loading
  loadingState(false); //! modificado inaki noche del domingo

  //! FUERA
  /*   getToken().then((res) => {
    const sect = document.querySelector(".vuelos");
    sect.innerHTML = "";
    vuelosDisponibles(enlace, res).then((result) => {
      if (result.data.length === 0) {
        pintaVuelo(false);
      } else {
        for (let i = 0; i < result.data.length; i++) {
          pintaVuelo(result.data[i]);
        }
      }
      //* oculta loading
      loadingState(false); //! modificado inaki noche del domingo
    });
  }); */
  return result; //!ALE
}

export { gestionInputs };
