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
  let origen;

  //* Solicita token
  let res = await getToken();

  //^ defino función manejadora de li al hacer click en él
  const handleClickLiORIGEN = (event) => {
    //* Pone en el texto del imput lo que pone en el li del click
    let inputBoxORIGEN = document.querySelector(".origen .search-input input"); //~DOM
    inputBoxORIGEN.value = event.target.innerText;

    //* Hace desaparecer todos los li's
    suggBoxORIGEN.innerHTML = "";

    //* Guarda en el origen el li donde hizo click el usuario
    origen = event.target.id;

    //* Si hay valor en origen y destino y son diferentes
    if (origen && destino) {
      if (origen != destino) {
        gestionInputs(origen, destino, res);
      } else {
        console.error("Origen y destino igual (origen)");
        //! control de error capa8: si el origen y destino es igual
      }
    }
  };

  //~ Accesibilidad a desplegable de sugerencias sin raton (teclado)
  //* Obtener la lista de sugerencias, para recorrer cada elemento
  let listGroupORIGEN = document.querySelector(".origen .autocom-box ul"); //~DOM

  //* Asignar evento al input de origen para escuchar el teclado para sugerencias
  //~DOM
  document
    .querySelector("#aeropuerto-salida")
    .addEventListener("keydown", (e) => {
      //* No existe la lista
      if (!listGroupORIGEN) {
        return;
      }

      //* Obtener todos los elementos
      let items = listGroupORIGEN.querySelectorAll("li"); //~DOM

      //* Saber si alguno está activo
      let actualo = Array.from(items).findIndex((item) =>
        item.classList.contains("active")
      );

      //* Si la tecla pulsada es enter emula un evento click
      if (e.key == "Enter") {
        //* Tecla Enter, evitar que se procese el formulario
        e.preventDefault();
        //* ¿Hay un elemento activo? hacer clic
        if (items[actualo]) {
          items[actualo].click();
        }
      }

      //* Si el usuario a pulsado subir o bajar Flecha arriba (restar) o abajo (sumar)
      if (e.key == "ArrowUp" || e.key == "ArrowDown") {
        //* Solo si hay un elemento activo, eliminar clase
        if (items[actualo]) {
          items[actualo].classList.remove("active");
        }

        //* Calcular posición del siguiente
        actualo += e.key == "ArrowUp" ? -1 : 1;

        //* Asegurar que está dentro de los límites
        if (actualo < 0) {
          actualo = 0;
        } else if (actualo >= items.length) {
          actualo = items.length - 1;
        }

        //* Asignar clase activa
        items[actualo].classList.add("active");
      }
    });
  //~ Fin Accesibilidad

  //* EVENTO escucha el teclado para texto del input
  inputBoxORIGEN.onkeyup = async (e) => {
    //* especifica min 3 caracteres
    if (e.target.value.length >= 3) {
      //* Pide listado de aeropuertos pasandole el token
      let result = await tellAirports(inputBoxORIGEN.value.toString(), res);

      //TODO revisar error undefined reading length
      //* si no ha pulsado ni subir ni bajar (evitar consultas api innecesarias), llama a enseñar sugerencias
      if (e.key != "ArrowUp") {
        if (e.key != "ArrowDown") {
          showSuggestions(result[0].data, true);
        }
      }

      //* seleciona los li de ul de sugerencias
      const listLi = document.querySelectorAll(".origen .autocom-box ul li"); //~DOM

      //* asocia a cada li la funcion manejadora handleClickLi
      for (const li of listLi) {
        li.addEventListener("click", handleClickLiORIGEN);
      }
    }
  };

  //* cuando se clica el input selecciona todo el texto
  inputBoxORIGEN.onclick = () => {
    inputBoxORIGEN.select();
  };

  //? SCOPE PRINCIPAL DESTINO
  //TODO a una línea
  const searchWrapperDESTINO = document.querySelector(".destino .search-input"); //~DOM
  const inputBoxDESTINO = searchWrapperDESTINO.querySelector("input"); //~DOM
  const suggBoxDESTINO = document.querySelector(".destino .autocom-box ul"); //~DOM
  //todo hABRIA QUE PASARLO POR PARAMETRO? A showSuggestions
  let destino;

  //^ defino función manejadora de li al hacer click en el
  const handleClickLiDESTINO = (event) => {
    //* Pone en el texto del imput lo que pone en el li del click
    let inputBoxDESTINO = document.querySelector(
      ".destino .search-input input"
    );
    inputBoxDESTINO.value = event.target.innerText;

    //* Hace desaparecer todos los li's
    suggBoxDESTINO.innerHTML = "";

    //* guarda en destino el li donde hizo click el usuario
    destino = event.target.id;

    //* si hay valor en origen y destino y son diferentes
    if (origen && destino) {
      if (origen != destino) {
        gestionInputs(origen, destino, res);
      } else {
        pintaVuelo(false);
        console.error("Origen y destino igual (destino)");
        //! control de error capa8: si el origen y destino es igual
      }
    }
  };

  //~ Accesibilidad a desplegable de sugerencias sin raton (teclado)
  //* Obtener la lista, para recorrer cada elemento
  let listGroupDestino = document.querySelector(".destino .autocom-box ul");

  //* Asignar evento al input de destino para escuchar el teclado para sugerencias
  //~DOM
  document
    .querySelector("#aeropuerto-llegada")
    .addEventListener("keydown", (e) => {
      //* No existe la lista
      if (!listGroupDestino) {
        return;
      }

      //* Obtener todos los elementos
      let items = listGroupDestino.querySelectorAll("li"); //~DOM

      //* Saber si alguno está activo
      let actuald = Array.from(items).findIndex((item) =>
        item.classList.contains("active")
      );

      //* Si la tecla pulsada es enter emula un evento click
      if (e.key == "Enter") {
        //* Tecla Enter, evitar que se procese el formulario
        e.preventDefault();
        //* ¿Hay un elemento activo? hacer click
        if (items[actuald]) {
          items[actuald].click();
        }
      }

      //* Si el usuario a pulsado subir o bajar Flecha arriba (restar) o abajo (sumar)
      if (e.key == "ArrowUp" || e.key == "ArrowDown") {
        //* Solo si hay un elemento activo, eliminar clase
        if (items[actuald]) {
          items[actuald].classList.remove("active");
        }

        //* Calcular posición del siguiente
        actuald += e.key == "ArrowUp" ? -1 : 1;

        //* Asegurar que está dentro de los límites
        if (actuald < 0) {
          actuald = 0;
        } else if (actuald >= items.length) {
          actuald = items.length - 1;
        }
        //* Asignar clase activa
        items[actuald].classList.add("active");
      }
    });

  //~ Fin Accesibilidad

  //* EVENTO escucha el teclado para texto del input
  inputBoxDESTINO.onkeyup = async (e) => {
    //* especifica min 3 caracteres
    if (e.target.value.length >= 3) {
      //* pide listado de aeropuertos pasandole el token
      let result = await tellAirports(inputBoxDESTINO.value.toString(), res);

      //TODO revisar error undefined reading length
      if (e.key != "ArrowUp") {
        if (e.key != "ArrowDown") {
          showSuggestions(result[0].data, false);
        }
      }
      //* seleciona los li de ul
      const listLi = document.querySelectorAll(".destino ul li"); //~DOM

      //* asocia a cada li la funcion manejadora handleClickLi
      for (const li of listLi) {
        li.addEventListener("click", handleClickLiDESTINO);
      }
    }
  };

  //* cuando se clica el input selecciona todo el texto
  inputBoxDESTINO.onclick = () => {
    inputBoxDESTINO.select();
  };

  //?BONUS
  //TODO las const en mayusculas y con _

  //* Evento nº de pasajeros y fecha
  const inputAdultsDate = (event) => {
    if (origen && destino) {
      if (origen != destino) {
        gestionInputs(origen, destino, res);
      } else {
        pintaVuelo(false);
        console.error("Origen y destino igual (destino)");
        //! control de error capa8: si el origen y destino es igual
      }
    }
  };
  const numAdultos = document.getElementById("pasajeros"); //~DOM
  numAdultos.addEventListener("input", inputAdultsDate);

  //* cuando se clica el input selecciona todo el texto
  numAdultos.onclick = () => {
    numAdultos.select();
  };

  //* Evento cambio de fecha
  const fecha = document.getElementById("start"); //~DOM
  fecha.addEventListener("change", inputAdultsDate);
}

/*
!  __ __ __  __  __   __  __       __  __         
! (_ /  /  \|__)|_   |__)|__)||\ |/   ||__) /\ |   
! __)\__\__/|   |__  |   | \ || \|\__ ||   /--\|__ 
*/
main();
