"use strict";
import { getToken } from "./token.js";
import { pintaVuelo, showSuggestions } from "./pinta.js";
import { gestionInputs } from "./inputs.js";
import { loadingState } from "./carga.js";

//& Muestra aeropuertos por palabra clave (ciudad)
async function tellAirports(text, token) {
  //* define cabeceras
  let myHeaders = new Headers();
  myHeaders.append("Content-type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  //console.log(`https://test.api.amadeus.com/v1/reference-data/locations?keyword=${text}&subType=AIRPORT&view=FULL`);
  try {
    const response = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations?keyword=${text}&subType=AIRPORT&view=FULL`,
      requestOptions
    );

    //console.log("response", response);

    const result_1 = await response.text();
    return [JSON.parse(result_1)];
  } catch (error) {
    return console.log("error", error);
  } //TODO Control de errores
}
//& Obtiene los vuelos
async function vuelosDisponibles(link, accessToken) {
  //* define cabeceras
  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${accessToken}`);

  let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  let vuelos = await fetch(link, requestOptions); //!resuelto fetch con async
  vuelos = await vuelos.text(); //!resuelto fetch con async

  let result = JSON.parse(vuelos); //!resuelto fetch con async

  /* let vuelos = fetch(link, requestOptions).then((response) => response.text()).then((result) => {
      result = JSON.parse(result);
      return result;
    })
    .catch((error) => console.log("error", error)); //TODO Control de errores */
  //* devuelve listado de vuelos
  return result;
}

export { vuelosDisponibles, tellAirports };
