"use strict";
//& Obtiene el Token
async function getToken() {
  let myHeaders = new Headers();
  myHeaders.append("Content-type", "application/x-www-form-urlencoded");

  let urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");
  urlencoded.append("client_id", "RZmM20pVrP5mwD6DA52ebS0JHoM2aZ6I");
  urlencoded.append("client_secret", "hyezkVaUsomG0Usw");

  let requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      requestOptions
    );
    const result_1 = await response.text();
    return JSON.parse(result_1).access_token;
  } catch (error) {
    return console.log("error", error);
  }
}

//& Obtiene los vuelos
function vuelosDisponibles(link, accessToken) {
  let myHeaders = new Headers();

  myHeaders.append("Authorization", `Bearer ${accessToken}`);

  let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  let vuelos = fetch(link, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      result = JSON.parse(result);
      return result;
    })
    .catch((error) => console.log("error", error));
  return vuelos;
}

//& Pinta un vuelo
function pintaVuelo(vuelo) {
  //console.log("vuelo", vuelo);

  let aerolinea = vuelo.itineraries[0].segments[0].carrierCode;
  let escalas = vuelo.itineraries[0].segments.length - 1;
  let salida = vuelo.itineraries[0].segments[0].departure.at;
  // slice corta hora de salida y llegada
  salida = salida.slice(-8, -3);
  let llegada = vuelo.itineraries[0].segments[escalas].arrival.at; // Todo: confirmar con dos o más escalas
  llegada = llegada.slice(-8, -3);
  let duracion = vuelo.itineraries[0].duration;
  duracion = duracion.slice(2);
  let precio = vuelo.price.grandTotal;
  //DOM
  let domElement = document.querySelector(".vuelos"); //DOM
  const newArticle = document.createElement("article"); //DOM
  domElement.appendChild(newArticle);
  //Pinta tarjetas de vuelo
  newArticle.innerHTML += `
	  <p>${aerolinea}</p>
	  <p> ${salida} - ${llegada}</p>
	  <p>${escalas}</p>
	  <p>${duracion}</p>
	  <p>${precio} € </p>
	  `;
}

//& Muestra aeropuertos por ciudad
function tellAirports(text, token) {
  //console.log("token", token);

  //& Define cabeceras
  var myHeaders = new Headers();
  myHeaders.append("Content-type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", `Bearer ${token}`);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(
    `https://test.api.amadeus.com/v1/reference-data/locations?keyword=${text}&subType=AIRPORT`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      return [JSON.parse(result)];
    })
    .catch((error) => console.log("error", error));
}

//& Muestra sugerencias origen/destino
function showSuggestions(list, lugar) {
  //!lugar - true:origen false: destino

  let listData = "";
  if (list.length) {
    for (let i = 0; i < list.length; i++) {
      listData += `<li id="${list[i]["iataCode"]}" class="icon">${list[i]["iataCode"]} - ${list[i]["detailedName"]},${list[i]["address"]["countryName"]} </li></ul>`;
      // DOM
      if (lugar) {
        suggBoxORIGEN.innerHTML = listData;
      } else {
        suggBoxDESTINO.innerHTML = listData;
      }
    }
  }
}

//& Gestiona llamadas a los vuelos inputs origen / destino
function gestionInputs(origen, destino) {
  let originLocation = origen;
  let destinationLocation = destino;
  let deptDate = "2022-06-19"; //TODO getDate Bonus(form)
  let numAdultos = 1; //TODO nº personas
  let maxFlights = 11;
  let enlace = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originLocation}&destinationLocationCode=${destinationLocation}&departureDate=${deptDate}&adults=${numAdultos}&max=${maxFlights}`;

  //* Origen y destino rellenados, procede a buscar vuelos
  getToken().then((res) => {
    vuelosDisponibles(enlace, res).then((result) => {
      for (let i = 0; i < result.data.length; i++) {
        pintaVuelo(result.data[i]);
      }
    });
  });
}

//*Cabecera Scope Principal/////////////////////////////////////////////////////////

/*  originLocation-> origen del vuelo
destinationLocation-> destino del vuelo
deptDate-> fecha de salida
numAdultos-> numero de personas que vuelan, al principio solo 1
maxFlights-> numero de vuelos que se obtendran con el API, se puede obtener 250
flightClass-> Economy porque no hay plata
*/

//? SCOPE PRINCIPAL ORIGEN

const searchWrapperORIGEN = document.querySelector(".origen .search-input"); //DOM
const inputBoxORIGEN = searchWrapperORIGEN.querySelector("input"); //DOM
//todo a una línea
const suggBoxORIGEN = document.querySelector(".origen .autocom-box ul");
//todo hABRIA QUE PASARLO POR PARAMETRO? A showSuggestions
let introducidoUsuarioORIGEN = [];
let origen;

//* defino función manejadora de li al hacer click en él
const handleClickLiORIGEN = (event) => {
  origen = event.target.id; //* Guardo en item el li donde hizo click el usuario
  //todo cambiar a ternario
  if (origen && destino) {
    gestionInputs(origen, destino);
  }
};

inputBoxORIGEN.onkeyup = (e) => {
  if (e.key === "Enter") {
    //* pedimos el token
    getToken()
      .then((res) => {
        return tellAirports(inputBoxORIGEN.value.toString(), res);
      })
      .then((result) => {
        showSuggestions(result[0].data, true);
        //* seleciona los li de ul
        const listLi = document.querySelectorAll(".origen .autocom-box ul li");
        //* asocio a cada li la funcion manejadora handleClickLi
        for (const li of listLi) {
          li.addEventListener("click", handleClickLiORIGEN);
        }
      });
  } else {
    introducidoUsuarioORIGEN += [e.key];
  }
};

//? SCOPE PRINCIPAL DESTINO

const searchWrapperDESTINO = document.querySelector(".destino .search-input");
const inputBoxDESTINO = searchWrapperDESTINO.querySelector("input");
const suggBoxDESTINO = document.querySelector(".destino .autocom-box ul");
let introducidoUsuarioDESTINO = [];
let destino;
//* defino función manejadora de li al hacer click en el
const handleClickLiDESTINO = (event) => {
  //* guardo en item el li donde hizo click el usuario
  destino = event.target.id;
  if (origen && destino) {
    gestionInputs(origen, destino);
  }
};

inputBoxDESTINO.onkeyup = (e) => {
  if (e.key === "Enter") {
    //* pedimos el token
    getToken()
      .then((res) => {
        return tellAirports(inputBoxDESTINO.value.toString(), res);
      })
      .then((result) => {
        showSuggestions(result[0].data, false);
        //* seleciona los li de ul
        const listLi = document.querySelectorAll(".destino ul li");
        //* asocio a cada li la funcion manejadora handleClickLi
        for (const li of listLi) {
          li.addEventListener("click", handleClickLiDESTINO);
        }
      });
  } else {
    introducidoUsuarioDESTINO += [e.key];
  }
};

//?BONUS
//todo solicitar el token una vez y guardar FUNCIÓN > VARIABLE GLOBAL
