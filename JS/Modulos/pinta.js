"use strict";
import { getToken } from "./token.js";
import { vuelosDisponibles, tellAirports } from "./api.js";
import { gestionInputs } from "./inputs.js";
import { loadingState } from "./carga.js";

//&+ Pinta un vuelo
async function pintaVuelo(vuelo, access_token) {
  console.log("vuelo", vuelo);
  let domElement = document.querySelector(".vuelos"); //~DOM - const?
  const newArticle = document.createElement("article"); //~DOM

  /*//* pedimos token
  let token = await getToken(); //TODO: INCORRECTO PEDIR TOKEN HAY QUE PASARLO A PINTAVUELO */

  //* si el listado de vuelos está vacio busca si ya hay una tarjeta con error en pantalla
  //* si no hay tarjeta de error en pantalla pinta una añade clase error y la inserta
  if (!vuelo) {
    let errorClase = document.getElementsByClassName("error"); //~DOM

    if (errorClase.length === 0) {
      newArticle.classList.add("error");
      domElement.appendChild(newArticle);
      newArticle.innerHTML = `<p>No hay vuelos</p>
      <p><img src="./IMG/its-a-trap.gif"></p>`; //!Its a trap!!
    }

    //* si el listado no esta vacio pinta la tarjeta de vuelo
  } else {
    //* valores de la tarjeta para pintar
    let aerolinea = vuelo.itineraries[0].segments[0].carrierCode;
    let escalas = vuelo.itineraries[0].segments.length - 1;
    let salida = vuelo.itineraries[0].segments[0].departure.at;
    let llegada = vuelo.itineraries[0].segments[escalas].arrival.at;
    let duracion = vuelo.itineraries[0].duration;
    let precio = vuelo.price.grandTotal;
    let idVuelo = vuelo.id;
    let segmentos = vuelo.itineraries[0].segments;

    //* si escala es = 0 pone "Directo" en DOM
    escalas === 0 ? (escalas = "Directo") : escalas;

    //* slice corta hora de salida y llegada
    salida = salida.slice(-8, -3);
    llegada = llegada.slice(-8, -3);
    duracion = duracion.slice(2);

    //* pinta datos tarjetas de vuelo y añade un nuevo vuelo article al index.html
    domElement.appendChild(newArticle);

    //* añade la clase idVuelo (numero) + el literal "idVuelo" y lo pinta
    newArticle.classList.add(idVuelo);
    newArticle.classList.add(`idVuelo`);

    //* pinta cabecera literal
    newArticle.innerHTML = `
    <article> <p id="aerolinea"></p>
    <p>Sal/Lleg</p>
    <p>Escalas</p>
    <p>Duracion</p>
    <p>Precio</p> </article>`;

    //* pinta el logo
    //! DOC api logos aerolines
    newArticle.innerHTML += `
    <article id="cabeceraVuelo${idVuelo}">
    <p
    ><img class="logo" src="https://daisycon.io/images/airline/?width=300&height=150&color=ffffff&iata=${aerolinea}" alt="">
    </p>
    <p> ${salida} - ${llegada}</p><p>${escalas}</p><p>${duracion}</p><p>${precio} € </p>
    </article>`;

    //*+ por cada escala (segementos) prepara el section y guarda el codigo de aerolinea e iataCode
    for (let i = 0; i < segmentos.length; i++) {
      let detalleSect = document.createElement("section");

      //* informacion de salida
      let sal = segmentos[i].departure;
      let salTiempo = sal.at;
      salTiempo = salTiempo.slice(-8, -3);

      //* informacion de llegada
      let lleg = segmentos[i].arrival;
      let llegTiempo = lleg.at;
      llegTiempo = llegTiempo.slice(-8, -3);

      //* duracion del vuelo
      let durac = segmentos[i].duration;
      durac = durac.slice(2);

      //* modelo de avion
      let avion = segmentos[i].aircraft.code;

      //* añade al vuelo la seccion de escala, mete los datos y pinta
      newArticle.appendChild(detalleSect);
      detalleSect.classList.add("detalle");
      detalleSect.innerHTML += `         
      <p>Salida</p>
      <p>${durac}</p>
      <p>Llegada</p>
      <p>${sal.iataCode}</p>
      <p>✈️</p>
      <p>${lleg.iataCode}</p>
      <p>${salTiempo}</p>
      <p>${avion}</p>
      <p>${llegTiempo}</p>`;

      //* escucha click en cada (o solo una?) tarjeta del vuelo para plegar/desplegar escalas
      let pescadorVuelo = document.querySelector(`#cabeceraVuelo${idVuelo}`);
      pescadorVuelo.addEventListener("click", (e) => {
        //* pesca los detalles del vuelo
        let pescadorDetalle = document.querySelectorAll(
          `#cabeceraVuelo${idVuelo} ~ .detalle`
        );

        //* oculta/muestra cada detalle del vuelo
        pescadorDetalle.forEach((x) => {
          if (!x.classList.contains("notHide")) {
            x.classList.add("notHide");
          } else if (x.classList.contains("notHide")) {
            x.classList.remove("notHide");
          }
        });
        e.stopImmediatePropagation();
      });
    }
    //~ COVID
    //^+ callback (funcion de flecha)=> consulta covid
    const datosCovid = async (access_token, aeropuertoParam) => {
      console.log("aeropuertoParam", aeropuertoParam);

      //* fech covid
      let myHeaders = new Headers();
      myHeaders.append("Content-type", "application/x-www-form-urlencoded");
      myHeaders.append("Authorization", `Bearer ${access_token}`);
      let response;

      let requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      }; //!DOC API
      try {
        response = await fetch(
          "https://62b432cca36f3a973d2e4b86.mockapi.io/api/v1/country",
          requestOptions
        ); //!mockupapi.io!
        /*  response = await fetch(
            `https://test.api.amadeus.com/v1/duty-of-care/diseases/covid19-area-report?countryCode=${aeropuertoParam[0].data[0].address.countryCode}&cityCode=${aeropuertoParam[0].data[0].address.cityCode}`,requestOptions); 
             */
      } catch (error) {
        console.error("COVID ERROR: ", error);
      }
      console.log(`response${idVuelo}`, response);
      /*  console.log('await response.text()', await response.text()) */
      const result_1 = await response.text();
      //* Return datos covid parseados
      return JSON.parse(result_1);
    };

    //* pide datos del aeropuerto pasandole el codido iata
    console.log("UMPALUMPA");
    console.log("escalas", escalas);
    if (escalas === "Directo") {
      escalas = 0;
    }
    let aeropuerto = await tellAirports(
      vuelo.itineraries[0].segments[escalas].arrival.iataCode,
      access_token
    );
    console.log(`aeropuerto${idVuelo}`, aeropuerto);

    //* prepara la seccion de covid
    //*+ llama a la funcion callback pasandole token y el objeto aeropuerto
    let detalleSect2 = document.createElement("section");
    console.log("aeropuerto", aeropuerto);
    if (!aeropuerto[0].error) {
      let covid = await datosCovid(access_token, aeropuerto);
      let covidRest = covid.data.areaAccessRestriction;

      //* añade a el vuelo la seccion de covid y mete los datos
      newArticle.appendChild(detalleSect2);
      detalleSect2.classList.add("covidCard");
      detalleSect2.innerHTML += `
        <section id="cabeceraCovid${idVuelo}" class="">
          <p>
            <img class="logo" src="./IMG/covid_icon.png" alt="">
          </p>
          <p>${covid.data.area.name}</p>
        </section>
        <section class="detallesCovid${idVuelo}">
            
            <details>
              <summary>Mask</summary>
              <h2>${covidRest.mask.isRequired}</h2>
              <p>${covidRest.mask.text}</p>
            </details>
            <details>
              <summary>Documents</summary>
              <h2>${covidRest.declarationDocuments.documentRequired}</h2>
              <p>${covidRest.declarationDocuments.text}</p>
            </details>
            <details>
              <summary>Test</summary>
              <h2>Required:${covidRest.diseaseTesting.isRequired}</h2>
              <p>Min age:${covidRest.diseaseTesting.minimumAge}</p>
              <p>Min age:${covidRest.diseaseTesting.testType}</p>
              <p>Test type:${covidRest.diseaseTesting.testType}</p>
              <p>${covidRest.diseaseTesting.text}</p>
            </details>
          </section>`;

      //* tarjeta del vuelo para plegar/desplegar restricciones covid
      /*   detalleSect2.addEventListener("click", (e) => {
          let pescador = document.querySelector(`#${e.target.id} ~ section:first-child`); //~DOM
          console.log('pescador', pescador)
          pescador.classList.toggle("notHide");
        }); */
    }
    //~ FIN COVID
  }
}

//&+ Muestra sugerencias origen/destino [lugar - true:origen false: destino]
function showSuggestions(list, lugar) {
  //* si no se inicializa a string vacio en las predicciones pone un undefined
  let listData = "";

  const suggBoxORIGEN = document.querySelector(".origen .autocom-box ul"); //~DOM
  const suggBoxDESTINO = document.querySelector(".destino .autocom-box ul"); //~DOM

  //* si la lista no esta vacia crea un li nuevo por cada sugerencia encontrada
  if (list.length) {
    for (let i = 0; i < list.length; i++) {
      listData += `<li id="${list[i]["iataCode"]}" class="icon">${list[i]["iataCode"]} - ${list[i]["detailedName"]},${list[i]["address"]["countryName"]} </li>`;

      //* lugar = true (origen) : false (destino) pinta la lista
      if (lugar) {
        suggBoxORIGEN.innerHTML = listData;
      } else {
        suggBoxDESTINO.innerHTML = listData;
      }
    }
  } else {
    //* pinta error de ciudad no valida
    listData += `<li id="oops" class="icon">oops, cuidad no valida</li>`;

    //* lugar = true (origen) : false (destino) pinta la lista
    if (lugar) {
      suggBoxORIGEN.innerHTML = listData;
    } else {
      suggBoxDESTINO.innerHTML = listData;
    }
    //* desactiva el escuchador si es de error
    const oops = document.getElementById("oops");
    oops.removeEventListener("click", handleClickLiORIGEN);
  }

  let liOrigen = suggBoxORIGEN.getElementsByTagName("li");
  let liDestino = suggBoxDESTINO.getElementsByTagName("li");

  //*+ quita la classe "active" al pasar el raton por otro li
  suggBoxORIGEN.addEventListener("mouseover", (e) => {
    for (let index = 0; index < liOrigen.length; index++) {
      liOrigen[index].classList.forEach((element) => {
        if (element === "active") {
          liOrigen[index].classList.remove("active");
        }
      });
    }
  });

  //*+ quita la classe "active" al pasar el raton por otro li
  suggBoxDESTINO.addEventListener("mouseover", (e) => {
    for (let index = 0; index < liDestino.length; index++) {
      liDestino[index].classList.forEach((element) => {
        if (element === "active") {
          liDestino[index].classList.remove("active");
        }
      });
    }
  });
}

export { pintaVuelo, showSuggestions };
