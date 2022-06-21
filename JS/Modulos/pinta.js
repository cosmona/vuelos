"use strict";
import { getToken } from "./token.js";
import { vuelosDisponibles, tellAirports } from "./api.js";
import { gestionInputs } from "./inputs.js";
import { loadingState } from "./carga.js";

//& Pinta un vuelo
function pintaVuelo(vuelo) {
  //* si el listado de vuelos esta vacio
  if (!vuelo) {
    //* busca si ya hay una tarjeta con error en pantalla
    let errorClase = document.getElementsByClassName("error"); //~DOM

    //* si no hay tarjeta de error en pantalla pinta una
    if (errorClase.length === 0) {
      let domElement = document.querySelector(".vuelos"); //~DOM
      const newArticle = document.createElement("article"); //~DOM
      newArticle.classList.add("error");
      domElement.appendChild(newArticle);

      //*Pinta tarjetas de vuelo
      newArticle.innerHTML = `<p>ERROR: no hay vuelos</p>`; //TODO poner algo mas bonito
    }
    //* si el listado no esta vacio pinta tarjeta
  } else {
    let domElement = document.querySelector(".vuelos"); //~DOM
    const newArticle = document.createElement("article"); //~DOM

    let aerolinea = vuelo.itineraries[0].segments[0].carrierCode;
    let escalas = vuelo.itineraries[0].segments.length - 1;
    let salida = vuelo.itineraries[0].segments[0].departure.at;
    let llegada = vuelo.itineraries[0].segments[escalas].arrival.at; //TODO: confirmar con dos o más escalas
    let duracion = vuelo.itineraries[0].duration;
    let precio = vuelo.price.grandTotal;

    //* slice corta hora de salida y llegada
    salida = salida.slice(-8, -3);
    llegada = llegada.slice(-8, -3);
    duracion = duracion.slice(2);

    //* añade un nuevo article al index.html
    domElement.appendChild(newArticle);

    //* pinta datos tarjetas de vuelo
    newArticle.innerHTML += `<p><img class="logo" src="https://daisycon.io/images/airline/?width=300&height=150&color=ffffff&iata=${aerolinea}" alt=""></p><p> ${salida} - ${llegada}</p><p>${escalas}</p><p>${duracion}</p><p>${precio} € </p>`; //TODO: poner bien
  }
}

//& Muestra sugerencias origen/destino [lugar - true:origen false: destino]
function showSuggestions(list, lugar) {
  let listData = ""; //! si no se inicializa a string vacio en las predicciones pone un undefined
  const suggBoxORIGEN = document.querySelector(".origen .autocom-box ul"); //~DOM
  const suggBoxDESTINO = document.querySelector(".destino .autocom-box ul"); //~DOM

  //* si la lista no esta vacia
  if (list.length) {
    for (let i = 0; i < list.length; i++) {
      //* crea un li nuevo
      listData += `<li id="${list[i]["iataCode"]}" class="icon">${list[i]["iataCode"]} - ${list[i]["detailedName"]},${list[i]["address"]["countryName"]} </li>`;

      if (lugar) {
        suggBoxORIGEN.innerHTML = listData; //TODO Funcion NO pura
      } else {
        suggBoxDESTINO.innerHTML = listData;
      }
    }
  } else {
    listData += `<li id="oops" class="icon">oops, cuidad no valida</li>`;
    if (lugar) {
      suggBoxORIGEN.innerHTML = listData;
    } else {
      suggBoxDESTINO.innerHTML = listData;
    }
  }
}
export { pintaVuelo, showSuggestions };
