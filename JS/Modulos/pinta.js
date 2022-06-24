"use strict";
import { getToken } from "./token.js";
import { vuelosDisponibles, tellAirports } from "./api.js";
import { gestionInputs } from "./inputs.js";
import { loadingState } from "./carga.js";

//& Pinta un vuelo
async function pintaVuelo(vuelo) {
  //* si el listado de vuelos esta vacio busca si ya hay una tarjeta con error en pantalla
  if (!vuelo) {
    let errorClase = document.getElementsByClassName("error"); //~DOM

    //* si no hay tarjeta de error en pantalla pinta una
    if (errorClase.length === 0) {
      let domElement = document.querySelector(".vuelos"); //~DOM
      const newArticle = document.createElement("article"); //~DOM
      //* añade clase error y la inserta
      newArticle.classList.add("error");
      domElement.appendChild(newArticle);

      //* pinta tarjeta de errorde vuelo
      newArticle.innerHTML = `<p>ERROR: no hay vuelos</p>`; //TODO poner algo mas bonito
    }
    //* si el listado no esta vacio pinta la tarjeta de vuelo
  } else {
    let domElement = document.querySelector(".vuelos"); //~DOM
    const newArticle = document.createElement("article"); //~DOM

    //* valorer de la tarjeta para pintar
    let aerolinea = vuelo.itineraries[0].segments[0].carrierCode;
    let escalas = vuelo.itineraries[0].segments.length - 1;

    let salida = vuelo.itineraries[0].segments[0].departure.at;
    let llegada = vuelo.itineraries[0].segments[escalas].arrival.at;
    let duracion = vuelo.itineraries[0].duration;
    let precio = vuelo.price.grandTotal;
    let idVuelo = vuelo.id;
    escalas === 0 ? (escalas = "Directo") : escalas;
    //* slice corta hora de salida y llegada
    salida = salida.slice(-8, -3);
    llegada = llegada.slice(-8, -3);
    duracion = duracion.slice(2);

    //* pinta datos tarjetas de vuelo y añade un nuevo vuelo article al index.html
    domElement.appendChild(newArticle);

    //* añade la clase idVuelo (numero) y el literal "idVuelo" y lo pinta
    newArticle.classList.add(idVuelo);
    newArticle.classList.add(`idVuelo`);

    //* pinta cabecera literal
    // TODO meter cabecera dentro de tarjeta
    newArticle.innerHTML = `
    <article> <p id="aerolinea"></p>
    <p>Sal/Lleg</p>
    <p>Escalas</p>
    <p>Duracion</p>
    <p>Precio</p> </article>`;
    //* pinta el logo
    newArticle.innerHTML += `<article id="cabeceraVuelo${idVuelo}"><p><img class="logo" src="https://daisycon.io/images/airline/?width=300&height=150&color=ffffff&iata=${aerolinea}" alt=""></p><p> ${salida} - ${llegada}</p><p>${escalas}</p><p>${duracion}</p><p>${precio} € </p> </article>`; //TODO: poner bien

    //* busca las escalas
    let segmentos = vuelo.itineraries[0].segments;
    // console.log("segmentos", segmentos);

    //* por cada escala prepara el section y guarda el codigo de aerolinea e iataCode
    for (let i = 0; i < segmentos.length; i++) {
      let detalleSect = document.createElement("section");
      let aerolinea = segmentos[i].carrierCode;
      let iata = segmentos[i].arrival.iataCode;

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

      let avion = segmentos[i].aircraft.code;

      //* añade al vuelo la seccion de escala y mete los datos
      newArticle.appendChild(detalleSect);
      detalleSect.classList.add("detalle");

      //TODO RELLENAR
      detalleSect.innerHTML += `         
      <p>Salida</p>
      <p>${durac}</p>
      <p>Llegada</p>
      <p>${sal.iataCode}</p>
      <p>✈️</p>
      <p>${lleg.iataCode}</p>
      <p>${salTiempo}</p>
      <p>${avion}</p>
      <p>${llegTiempo}</p>
      `;

      //~ COVID
      //^callback (funcion de flecha)=> consulta covid
      const datosCovid = async (access_token, aeropuerto) => {
        console.log("aerop", aeropuerto);

        console.log(
          `·······  ${aeropuerto[0].data[0].address.countryCode}, ${aeropuerto[0].data[0].address.cityCode}`
        );

        //* fech covid
        let myHeaders = new Headers();
        myHeaders.append("Content-type", "application/x-www-form-urlencoded");
        myHeaders.append("Authorization", `Bearer ${access_token}`);
        console.log("access_token", access_token);
        let response;

        //!mockupapi.io!
        let requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };
        try {
          /*   let requestOptions = {
            method: 'GET',
            redirect: 'follow'
          }; */

          /*          response = await fetch(
          "https://62b432cca36f3a973d2e4b86.mockapi.io/api/v1/country",
          requestOptions
        ); */
          //!mockupapi.io!
          response = await fetch(
            `https://test.api.amadeus.com/v1/duty-of-care/diseases/covid19-area-report?countryCode=${aeropuerto[0].data[0].address.countryCode}&cityCode=${aeropuerto[0].data[0].address.cityCode}`,

            requestOptions
          );
        } catch (error) {
          console.error("COVID ERROR: ", error);
        }

        console.log("response", response);
        const result_1 = await response.text();
        return JSON.parse(result_1);
      };

      //* pedimos token
      let token = await getToken(); //TODO CORRECTO PEDIR TOKEN HAY QUE PASARLO A PINTAVUELO
      console.log("token", token);
      console.log("iata", iata);
      //* pide datos del aeropuerto pasandole el codido iata
      let aeropuerto = await tellAirports(iata, token);

      //* prepara el seccion de covid
      let detalleSect2 = document.createElement("section"); //~DOM
      if (aeropuerto[0].data.length !== 0) {
        //! no esta imprimiendo el ultimo covid form
        //* llama a la funcion callback pasandole token y el objeto aeropuerto
        let covid = await datosCovid(token, aeropuerto);
        console.log("covid", covid);
        //*
        let covidRest = covid.data.areaAccessRestriction;

        //* añade a el vuelo la seccion de covid y mete los datos
        newArticle.appendChild(detalleSect2);
        detalleSect2.classList.add("covidCard");
        //TODO meter en variables
        detalleSect2.innerHTML += `
        <section id="cabeceraCovid${idVuelo}" class="">
          <p>
            <img class="logo" src="https://www.chg.org.uk/wp-content/uploads/2020/03/Website-covid-icons-01.png" alt="">
          </p>
        </section>
        <section class="detallesCovid">
            ${covid.data.area.name}
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

        detalleSect2.addEventListener("click", (e) => {
          console.log("HOLA", e.target.id);
          let pescador = document.querySelector(`#${e.target.id} + section`);
          pescador.classList.toggle("notHide");
        });
      }
      //~ FIN COVID
      let pescadorVuelo = document.querySelector(`#cabeceraVuelo${idVuelo}`);
      // console.log("pescadorVuelo", pescadorVuelo);
      pescadorVuelo.addEventListener("click", (e) => {
        let pescadorDetalle = document.querySelectorAll(
          `#cabeceraVuelo${idVuelo} ~ .detalle`
        );
        // console.log("pescadorDetalle", pescadorDetalle);
        //pescadorDetalle.style.backgroundColor="red";
        //pescadorDetalle.classList.toggle("notHide");
        pescadorDetalle.forEach((x) => {
          console.log(
            'x.classList.contains("notHide")',
            x.classList.contains("notHide")
          );
          if (!x.classList.contains("notHide")) {
            x.classList.add("notHide");
            console.log("Umpa Lumpa pintador");
          } else if (x.classList.contains("notHide")) {
            x.classList.remove("notHide");
            console.log("Umpa Lumpa borrador");
          }
        });
        e.stopImmediatePropagation();
        //pescadorDetalle.forEach(x => console.log("Esta", x));
        //console.log("HOLA",e.target.id)
      });
    }
  }
}
//& Muestra sugerencias origen/destino [lugar - true:origen false: destino]
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
    //*
    const oops = document.getElementById("oops");
    oops.removeEventListener("click", handleClickLiORIGEN);
  }
}

export { pintaVuelo, showSuggestions };
