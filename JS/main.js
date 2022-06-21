"use strict";
import { getToken } from "./Modulos/token.js";
import { vuelosDisponibles, tellAirports } from "./Modulos/api.js";
import { pintaVuelo, showSuggestions } from "./Modulos/pinta.js";
import { gestionInputs } from "./Modulos/inputs.js";
import { loadingState } from "./Modulos/carga.js";

//& Funcion principal
async function main() {
  //? SCOPE PRINCIPAL ORIGEN

  //TODO a una línea
  const searchWrapperORIGEN = document.querySelector(".origen .search-input"); //~DOM
  const inputBoxORIGEN = searchWrapperORIGEN.querySelector("input"); //~DOM
  const suggBoxORIGEN = document.querySelector(".origen .autocom-box ul"); //~DOM
  //todo hABRIA QUE PASARLO POR PARAMETRO? A showSuggestions
  let introducidoUsuarioORIGEN = [];
  let origen;
  //* pedimos token
  let res = await getToken();

  //* defino función manejadora de li al hacer click en él
  const handleClickLiORIGEN = (event) => {
    //* Pongo en el texto del imput lo que pone en el li del click
    let inputBoxORIGEN = document.querySelector(".origen .search-input input"); //! modificado inaki noche del domingo
    inputBoxORIGEN.value = event.target.innerText; //! modificado inaki noche del domingo

    //* Hago desaparecer todos los li's
    //!DUPLICADO
    //let suggBoxORIGEN = document.querySelector(".origen .autocom-box ul"); //! modificado inaki noche del domingo
    suggBoxORIGEN.innerHTML = ""; //! modificado inaki noche del domingo

    //* Guardo en el item el li donde hizo click el usuario
    origen = event.target.id;
    //* si hay valor en origen y destino y son diferentes
    if (origen && destino) {
      if (origen != destino) {
        gestionInputs(origen, destino, res); //! TOKEN ADDED
      } else {
        console.error("Origen y destino igual (origen)");
        //! control de error capa8: si el origen y destino es igual
      }
    }
  };

  //* escucha el teclado
  inputBoxORIGEN.onkeyup = async (e) => {
    if (e.target.value.length >= 3) {
      //* pedimos el token
      let result = await tellAirports(inputBoxORIGEN.value.toString(), res);

      if (e.key != "ArrowUp") {
        if (e.key != "ArrowDown") {
          showSuggestions(result[0].data, true);
        }
      }

      //* seleciona los li de ul
      const listLi = document.querySelectorAll(".origen .autocom-box ul li");
      //* asocio a cada li la funcion manejadora handleClickLi
      for (const li of listLi) {
        li.addEventListener("click", handleClickLiORIGEN);
      }
      //!subir bajar en suguerencias con teclado
      // Saber si alguno está activo
      document
        .querySelector("#aeropuerto-salida")
        .addEventListener("keydown", (e) => {
          let actual = Array.from(listLi).findIndex((item) =>
            item.classList.contains("active")
          );
          // Analizar tecla pulsada
          if (e.key == "Enter" && origen && destino) {
            // Tecla Enter, evitar que se procese el formulario
            e.preventDefault();
            // ¿Hay un elemento activo?
            if (listLi[actual]) {
              // Hacer clic
              listLi[actual].click();
            }
          }
          if (e.key == "ArrowUp" || e.key == "ArrowDown") {
            // Flecha arriba (restar) o abajo (sumar)
            if (listLi[actual]) {
              // Solo si hay un elemento activo, eliminar clase
              listLi[actual].classList.remove("active");
            }
            // Calcular posición del siguiente
            actual += e.keyCode == 38 ? -1 : 1;
            console.log("actualelement", actual);
            // Asegurar que está dentro de los límites
            /*  if(actual < 0) {
                      actual = 0;
                    } else if(actual >= listLi.length) {
                      actual = listLi.length - 1;
                    } */
            // Asignar clase activa
            listLi[actual].classList.add("active");
          }
        });

      //!fin subir bajar en suguerencias con teclado
    } else {
      introducidoUsuarioORIGEN += [e.key];
    }
  };

  //* limpia input de origen
  inputBoxORIGEN.onclick = () => {
    inputBoxORIGEN.select();
  };

  //? SCOPE PRINCIPAL DESTINO
  //TODO a una línea
  const searchWrapperDESTINO = document.querySelector(".destino .search-input"); //~DOM
  const inputBoxDESTINO = searchWrapperDESTINO.querySelector("input"); //~DOM
  const suggBoxDESTINO = document.querySelector(".destino .autocom-box ul"); //~DOM
  //todo hABRIA QUE PASARLO POR PARAMETRO? A showSuggestions
  let introducidoUsuarioDESTINO = [];
  let destino;

  //* defino función manejadora de li al hacer click en el
  const handleClickLiDESTINO = (event) => {
    //* Pongo en el texto del imput lo que pone en el li del click
    let inputBoxDESTINO = document.querySelector(
      ".destino .search-input input"
    );
    inputBoxDESTINO.value = event.target.innerText;

    //* Hago desaparecer todos los li's
    //let suggBoxDESTINO = document.querySelector(".destino .autocom-box ul"); //!REPETIDA
    suggBoxDESTINO.innerHTML = "";

    //* guardo en item el li donde hizo click el usuario
    destino = event.target.id;
    if (origen && destino) {
      if (origen != destino) {
        gestionInputs(origen, destino, res); //!TOKEN ADDED
      } else {
        pintaVuelo(false);
        console.error("Origen y destino igual (destino)");
        //! control de error capa8: si el origen y destino es igual
      }
    }
  };

  //* escucha el teclado
  inputBoxDESTINO.onkeyup = async (e) => {
    if (e.target.value.length >= 3) {
      //* pedimos listado de aeropuertos pasandole el token
      let result = await tellAirports(inputBoxDESTINO.value.toString(), res);
      if (e.key != "ArrowUp") {
        if (e.key != "ArrowDown") {
          showSuggestions(result[0].data, false);
        }
      }
      //* seleciona los li de ul
      const listLi = document.querySelectorAll(".destino ul li");
      //* asocio a cada li la funcion manejadora handleClickLi
      for (const li of listLi) {
        li.addEventListener("click", handleClickLiDESTINO);
      }
    } else {
      introducidoUsuarioDESTINO += [e.key];
    }
  };

  //* limpia input de destino
  inputBoxDESTINO.onclick = () => {
    inputBoxDESTINO.select();
  };
  //?BONUS
  //todo solicitar el token una vez y guardar FUNCIÓN > VARIABLE GLOBAL
  //! modificado inaki noche del domingo
  //TODO las const en mayusculas y con _
}
/*
? originLocation-> origen del vuelo
? destinationLocation-> destino del vuelo
? deptDate-> fecha de salida
? numAdultos-> numero de personas que vuelan, al principio solo 1
? maxFlights-> numero de vuelos que se obtendran con el API, se puede obtener 250
? flightClass-> Economy porque no hay plata
*/
/*
!  __ __ __  __  __   __  __       __  __         
! (_ /  /  \|__)|_   |__)|__)||\ |/   ||__) /\ |   
! __)\__\__/|   |__  |   | \ || \|\__ ||   /--\|__ 
*/

//? SCOPE PRINCIPAL ORIGEN
main();
