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

  try {
   /*  if (text.length > 3){
      console.log('textantes', text)
      text = text.slice(0,3);
      console.log('textdespues', text)
    } */
    const response = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations?keyword=${text}&subType=AIRPORT&view=FULL`,
      requestOptions
      );
      
    const result_1 = await response.text();
    return [JSON.parse(result_1)];
  } catch (error) {
    return console.error("API ERROR", error);
  } //TODO Control de errores
}
//& Obtiene los vuelos
async function vuelosDisponibles(link, accessToken) {
  //* define cabeceras
  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${accessToken}`);
  let result = "";
  try {
    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    let vuelos = await fetch(link, requestOptions);
    vuelos = await vuelos.text();

    result = JSON.parse(vuelos);
  } catch (error) {
    console.error("API ERROR:", error);
  }
  //* devuelve listado de vuelos
  return result;
}

export { vuelosDisponibles, tellAirports };
