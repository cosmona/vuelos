"use strict";
import { getToken } from "./Modulos/token.js";
import { vuelosDisponibles, tellAirports } from "./Modulos/api.js";
import { pintaVuelo, showSuggestions } from "./Modulos/pinta.js";
import { gestionInputs } from "./Modulos/inputs.js";
import { loadingState } from "./Modulos/carga.js";

//& Funcion principal
async function main() {
  //? SCOPE PRINCIPAL ORIGEN
  const NUM_ADULTOS = document.getElementById("pasajeros"); //~DOM
  const FECHA = document.getElementById("start"); //~DOM
  //TODO a una línea
  const searchWrapperORIGEN = document.querySelector(".origen .search-input"); //~DOM
  const INPUT_BOX_ORIGEN = searchWrapperORIGEN.querySelector("input"); //~DOM
  let listGroupORIGEN = document.querySelector(".origen .autocom-box ul"); //~DOM
  let actualOrigen;
  let origen;
  //TODO a una línea
  const searchWrapperDESTINO = document.querySelector(".destino .search-input"); //~DOM
  const INPUT_BOX_DESTINO = searchWrapperDESTINO.querySelector("input"); //~DOM
  let listGroupDESTINO = document.querySelector(".destino .autocom-box ul"); //~DOM
  let actualDestino;
  let destino;
  
  //^ función manejadora de li al hacer click en él
  const handleClickLiORIGEN = (event) => {
    //* Pone en el texto del input lo que pone en el li del click
    let INPUT_BOX_ORIGEN = document.querySelector(".origen .search-input input"); //~DOM
    INPUT_BOX_ORIGEN.value = event.target.innerText;

    //* Hace desaparecer todos los li's
    listGroupORIGEN.innerHTML = "";

    //* Guarda en el origen el li donde hizo click el usuario
    origen = event.target.id;

    //* Si hay valor en origen y destino y son diferentes llama a gestionInputs
    //* gestionInputs: funcion que llama a buscar/pintar resultados de la busqueda
    if (origen && destino) {
      if (origen != destino) {
        gestionInputs(origen, destino, token);
      } else {
        console.error("Origen y destino igual (origen)");
        //! control de error capa8: si el origen y destino es igual
      }
    } 
  };

  //* solicita token
  let token = await getToken();
  
  //* evento al input de origen para escuchar el teclado para sugerencias
  INPUT_BOX_ORIGEN.addEventListener("keyup",async (e) => {
    
    //* especifica min 3 caracteres
    if (e.target.value.length >= 3) {
      //* Llamadas a apis solamente cuando se escribe texto
      if (e.key != "ArrowUp" && e.key != "ArrowDown") {
        //* Pide listado de aeropuertos pasandole el token
        let resultOrigen = await tellAirports(INPUT_BOX_ORIGEN.value.toString(), token);
        //* Llama a enseñar sugerencias
        if (resultOrigen){
          showSuggestions(resultOrigen[0].data, true);
        }
      }

      //* Seleciona los li de sugerencias
      const LIST_LI_ORIGEN = document.querySelectorAll(".origen .autocom-box ul li"); //~DOM
      
      
      //* asocia a cada li la funcion  manejadora handleClickLiORIGEN
      for (const li of LIST_LI_ORIGEN) { //! const?
         li.addEventListener("click", handleClickLiORIGEN);
       }
          
      //* Si el usuario a pulsado subir o bajar Flecha arriba (restar) o abajo (sumar)
       if (e.key === "ArrowUp" || e.key === "ArrowDown") {
         
        //* Saber si alguno está activo
        actualOrigen = Array.from(LIST_LI_ORIGEN).findIndex((item) =>{
          return item.classList.contains("active");
        });
                
        //* Solo si hay un elemento activo, eliminar clase
        if (LIST_LI_ORIGEN[actualOrigen]) {
         LIST_LI_ORIGEN[actualOrigen].classList.remove("active");
        }

        //* Calcular posición del siguiente
        if (e.key === "ArrowUp"){
          actualOrigen -= 1;
        }
        if (e.key === "ArrowDown"){
          actualOrigen += 1;
        }
              
        //* Asegurar que está dentro de los límites
        if (actualOrigen < 0) {
          actualOrigen = 0;
        } else if (actualOrigen >= LIST_LI_ORIGEN.length) {
          actualOrigen = LIST_LI_ORIGEN.length - 1;
        }         
          
        //* Asignar clase activa
        LIST_LI_ORIGEN[actualOrigen].classList.add("active");
      }           

        //* Si la tecla pulsada es enter emula un evento click
        if (e.key == "Enter") {
          //* Tecla Enter, evitar que se procese el formulario
          e.preventDefault();
          //* ¿Hay un elemento activo? hacer clic
          if (LIST_LI_ORIGEN[actualOrigen]) {
            LIST_LI_ORIGEN[actualOrigen].click();
          }
        }   
        }         
  });

  //* cuando se clica el input selecciona todo el texto
  INPUT_BOX_ORIGEN.onclick = () => { INPUT_BOX_ORIGEN.select() };
  
//? SCOPE PRINCIPAL DESTINO
  
  //^ defino función manejadora de li al hacer click en él
  const handleClickLiDESTINO = (event) => {
    //* Pone en el texto del imput lo que pone en el li del click
    let INPUT_BOX_DESTINO = document.querySelector(".destino .search-input input"); //~DOM
    INPUT_BOX_DESTINO.value = event.target.innerText;

    //* Hace desaparecer todos los li's
     listGroupDESTINO.innerHTML = "";

    //* Guarda en el origen el li donde hizo click el usuario
    destino = event.target.id;

    //* Si hay valor en origen y destino y son diferentes
    if (origen && destino) {
      if (origen != destino) {
        gestionInputs(origen, destino, token);
      } else {
        console.error("Origen y destino igual (origen)");
        pintaVuelo(false);
        //! control de error capa8: si el origen y destino es igual
      }
    } 
  };
  
  //* evento al input de origen para escuchar el teclado para sugerencias
  INPUT_BOX_DESTINO.addEventListener("keyup",async (e) => {
    //* especifica min 3 caracteres
    if (e.target.value.length >= 3) {

      //* llamadas a apis solamente cuando se escribe texto
      if (e.key != "ArrowUp" && e.key != "ArrowDown") {
        //* Pide listado de aeropuertos pasandole el token
        let resultDestino = await tellAirports(INPUT_BOX_DESTINO.value.toString(), token);
        //*llama a enseñar sugerencias
        if (resultDestino){
          showSuggestions(resultDestino[0].data, false);
        }
      }

      //* seleciona los li de ul de sugerencias
      const LIST_LI_DESTINO = document.querySelectorAll(".destino .autocom-box ul li"); //~DOM
      
      
      //* asocia a cada li la funcion  manejadora handleClickLi
      for (const li of LIST_LI_DESTINO) { //! const
         li.addEventListener("click", handleClickLiDESTINO);
       }
          
      //* Si el usuario a pulsado subir o bajar Flecha arriba (restar) o abajo (sumar)
       if (e.key === "ArrowUp" || e.key === "ArrowDown") {
         
        //* Saber si alguno está activo
        actualDestino = Array.from(LIST_LI_DESTINO).findIndex((item) =>{
          return item.classList.contains("active");
        });
                
        //* Solo si hay un elemento activo, eliminar clase
        if (LIST_LI_DESTINO[actualDestino]) {
         LIST_LI_DESTINO[actualDestino].classList.remove("active");
        }

        //* Calcular posición del siguiente
        if (e.key === "ArrowUp"){
          actualDestino -= 1;
        }
        if (e.key === "ArrowDown"){
          actualDestino += 1;
        }
              
        //* Asegurar que está dentro de los límites
        if (actualDestino < 0) {
          actualDestino = 0;
        } else if (actualDestino >= LIST_LI_DESTINO.length) {
          actualDestino = LIST_LI_DESTINO.length - 1;
        }         
          
        //* Asignar clase activa
        LIST_LI_DESTINO[actualDestino].classList.add("active");
      }           

        //* Si la tecla pulsada es enter emula un evento click
        if (e.key == "Enter") {
          //* Tecla Enter, evitar que se procese el formulario
          e.preventDefault();
          //* ¿Hay un elemento activo? hacer clic
          if (LIST_LI_DESTINO[actualDestino]) {
            LIST_LI_DESTINO[actualDestino].click();
          }
        }   
        }         
  });

  //* cuando se clica el input selecciona todo el texto
  INPUT_BOX_DESTINO.onclick = () => {
    INPUT_BOX_DESTINO.select();
  };

  //* Evento nº de pasajeros y fecha
  const inputAdultsDate = (event) => {
    if (origen && destino) {
      if (origen != destino) {
        gestionInputs(origen, destino, token);
      } else {
        pintaVuelo(false);
        console.error("Origen y destino igual (destino)");
        //! control de error capa8: si el origen y destino es igual
      }
    }
  };

  NUM_ADULTOS.addEventListener("input", inputAdultsDate);

  //* cuando se clica el input selecciona todo el texto
  NUM_ADULTOS.onclick = () => {
    NUM_ADULTOS.select();
  };

  //* Evento cambio de fecha
  FECHA.addEventListener("change", inputAdultsDate);
};
/*
!  __ __ __  __  __   __  __       __   __         
! (_ /  /  \|__)|_   |__)|__)||\ |/   ||__) /\ |   
! __)\__\__/|   |__  |   | \ || \|\__ ||   /--\|__ 
*/
main();
