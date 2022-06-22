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
    let inputBoxORIGEN = document.querySelector(".origen .search-input input"); 
    inputBoxORIGEN.value = event.target.innerText; 

    //* Hago desaparecer todos los li's
    //let suggBoxORIGEN = document.querySelector(".origen .autocom-box ul"); //!DUPLICADO
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
  //!TECLAS ORIGEN
  // Obtener la lista, para recorrer cada elemento
        let listGroupORIGEN = document.querySelector('.origen .autocom-box ul');
        console.log('listGroup', listGroupORIGEN)
        // Asignar evento al campo de texto
        document.querySelector('#aeropuerto-salida').addEventListener('keydown', e => {
          console.log("dentro")

        if(!listGroupORIGEN) {
          return; // No existe la lista
        }
        // Obtener todos los elementos
        let items = listGroupORIGEN.querySelectorAll('li');
        console.log('items', items)
        // Saber si alguno está activo
        let actual = Array.from(items).findIndex(item => item.classList.contains('active'));
        console.log('actual', actual)
        // Analizar tecla pulsada
        if(e.key == "Enter") {
          // Tecla Enter, evitar que se procese el formulario
          e.preventDefault();
          // ¿Hay un elemento activo?
          if(items[actual]) {
            // Hacer clic
            items[actual].click();
          }
        } if(e.key == "ArrowUp" || e.key == "ArrowDown") {
          // Flecha arriba (restar) o abajo (sumar)
          if(items[actual]) {
            // Solo si hay un elemento activo, eliminar clase
            items[actual].classList.remove('active');
          }
          // Calcular posición del siguiente
          actual += (e.key == "ArrowUp") ? -1 : 1;
          // Asegurar que está dentro de los límites
          if(actual < 0) {
            actual = 0;
          } else if(actual >= items.length) {
            actual = items.length - 1;
          }
          // Asignar clase activa
          items[actual].classList.add('active');
        }
        });
        // En la función donde generas la lista debes activar evento clic para cada elemento
        // Para este ejemplo se hace manual
        listGroupORIGEN.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', e => {
          // Asignar valor al campo
          document.querySelector('#inputArticulo').value = e.currentTarget.textContent;
          // Aquí deberías cerrar la lista y/o eliminar el contenido
        });
        });
  
  //!FIN TECLA



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
