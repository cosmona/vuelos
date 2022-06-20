"use strict";
//& Obtiene el Token
async function getToken() {
  //* define cabeceras
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
    return console.log("error", error);                                   //TODO Control de errores
  }
}

//& Obtiene los vuelos
function vuelosDisponibles(link, accessToken) {
  //* define cabeceras
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
    .catch((error) => console.log("error", error));                       //TODO Control de errores
  //* devuelve listado de vuelos  
  return vuelos;
}

//& Pinta un vuelo
function pintaVuelo(vuelo) {
  //* si el listado de vuelos esta vacio
  if (!vuelo) {
    //* busca si ya hay una tarjeta con error en pantalla
    let errorClase = document.getElementsByClassName("error");  //~DOM

    //* si no hay tarjeta de error en pantalla pinta una
    if (errorClase.length === 0) {
      let domElement = document.querySelector(".vuelos");       //~DOM
      const newArticle = document.createElement("article");     //~DOM
      newArticle.classList.add("error");                        
      domElement.appendChild(newArticle);

      //*Pinta tarjetas de vuelo
      newArticle.innerHTML = `<p>ERROR: no hay vuelos</p>`;               //TODO poner algo mas bonito
    }
   //* si el listado no esta vacio pinta tarjeta 
  } else {
    let domElement = document.querySelector(".vuelos");          //~DOM
    const newArticle = document.createElement("article");        //~DOM

    let aerolinea = vuelo.itineraries[0].segments[0].carrierCode;
    let escalas = vuelo.itineraries[0].segments.length - 1;
    let salida = vuelo.itineraries[0].segments[0].departure.at;
    let llegada = vuelo.itineraries[0].segments[escalas].arrival.at;      //TODO: confirmar con dos o más escalas
    let duracion = vuelo.itineraries[0].duration;
    let precio = vuelo.price.grandTotal;
    
    //* slice corta hora de salida y llegada
    salida = salida.slice(-8, -3);
    llegada = llegada.slice(-8, -3);
    duracion = duracion.slice(2);
    
    //* añade un nuevo article al index.html
    domElement.appendChild(newArticle);

    //* pinta datos tarjetas de vuelo
    newArticle.innerHTML += `<p>${aerolinea}</p><p> ${salida} - ${llegada}</p><p>${escalas}</p><p>${duracion}</p><p>${precio} € </p>`;  //TODO: poner bien
  }
}

//& Muestra aeropuertos por ciudad
function tellAirports(text, token) {

  //* define cabeceras
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
      //* devuelve listado de aeropiertos
      return [JSON.parse(result)];
    })
    .catch((error) => console.log("error", error));                     //TODO Control de errores
}

//& Muestra sugerencias origen/destino [lugar - true:origen false: destino]
function showSuggestions(list, lugar) {
  let listData = ""; //! si no se inicializa a string vacio en las predicciones pone un undefined

  //* si la lista no esta vacia
  if (list.length) {
    for (let i = 0; i < list.length; i++) {
      //* crea un li nuevo
      listData += `<li id="${list[i]["iataCode"]}" class="icon">${list[i]["iataCode"]} - ${list[i]["detailedName"]},${list[i]["address"]["countryName"]} </li>`;
      
      if (lugar) {
        suggBoxORIGEN.innerHTML = listData;                   //TODO Funcion NO pura 
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

//& Gestiona llamadas a los vuelos inputs origen / destino
function gestionInputs(origen, destino) {
  let fecha = document.getElementById("start");
  let numAdultos = document.getElementById("pasajeros");
  let tituloinputORIGEN = document.getElementById("origen");
  
  let originLocation = origen;
  let destinationLocation = destino;
  let maxFlights = 11;
  let enlace = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originLocation}&destinationLocationCode=${destinationLocation}&departureDate=${fecha.value}&adults=${numAdultos.value}&max=${maxFlights}`;
  
  //* muestra loading
  loadingState(true);                                         //! modificado inaki noche del domingo
  
  //* Origen y destino rellenados, procede a buscar vuelos
  getToken().then((res) => {
    vuelosDisponibles(enlace, res).then((result) => {
      if (result.data.length === 0) {
        pintaVuelo(false);
      } else {
        for (let i = 0; i < result.data.length; i++) {
          pintaVuelo(result.data[i]);
        }
      }
      //* oculta loading                                        
      loadingState(false);                                      //! modificado inaki noche del domingo
    });
  });
}

//& Carga la animacion de loading true:muestra false:oculta
function loadingState(activo){                                    //! modificado inaki noche del domingo
  let load = document.querySelector(".loading");
  
  if (activo) {
    //* muestra loading
    load.style.display ="block";
  } else {
    //* oculta loading
    load.style.display ="none";
  }
}


/*
!  __ __ __  __  __   __  __       __  __         
! (_ /  /  \|__)|_   |__)|__)||\ |/  ||__) /\ |   
! __)\__\__/|   |__  |   | \ || \|\__||   /--\|__ 

? originLocation-> origen del vuelo
? destinationLocation-> destino del vuelo
? deptDate-> fecha de salida
? numAdultos-> numero de personas que vuelan, al principio solo 1
? maxFlights-> numero de vuelos que se obtendran con el API, se puede obtener 250
? flightClass-> Economy porque no hay plata*/

//? SCOPE PRINCIPAL ORIGEN
//TODO a una línea
const searchWrapperORIGEN = document.querySelector(".origen .search-input"); //~DOM    
const inputBoxORIGEN = searchWrapperORIGEN.querySelector("input");           //~DOM    
const suggBoxORIGEN = document.querySelector(".origen .autocom-box ul");     //~DOM    
//todo hABRIA QUE PASARLO POR PARAMETRO? A showSuggestions
let introducidoUsuarioORIGEN = [];
let origen;

//* defino función manejadora de li al hacer click en él
const handleClickLiORIGEN = (event) => {
  //* Pongo en el texto del imput lo que pone en el li del click                
  let inputBoxORIGEN = document.querySelector(".origen .search-input input");   //! modificado inaki noche del domingo
  inputBoxORIGEN.value = event.target.innerText;                                //! modificado inaki noche del domingo

  //* Hago desaparecer todos los li's                                           
  let suggBoxORIGEN = document.querySelector(".origen .autocom-box ul");        //! modificado inaki noche del domingo
  suggBoxORIGEN.innerHTML = "";                                                 //! modificado inaki noche del domingo
  
  //* Guardo en el item el li donde hizo click el usuario
  origen = event.target.id; 
  //* si hay valor en origen y destino y son diferentes
  if (origen && destino) {
    if (origen != destino) {
      gestionInputs(origen, destino);
    } else {
      console.error("Origen y destino igual (origen)");
      //! control de error capa8: si el origen y destino es igual
    }
  }
};

//* escucha el teclado
inputBoxORIGEN.onkeyup = (e) => {
  if (e.target.value.length >= 3) {                        //! modificado inaki noche del domingo
//if (e.key === "Enter" && e.target.value.length >= 3) {   //! modificado inaki noche del domingo
    console.log("e.targer.val", e.target.value);
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
//TODO a una línea
const searchWrapperDESTINO = document.querySelector(".destino .search-input");  //~DOM 
const inputBoxDESTINO = searchWrapperDESTINO.querySelector("input");            //~DOM 
const suggBoxDESTINO = document.querySelector(".destino .autocom-box ul");      //~DOM 
//todo hABRIA QUE PASARLO POR PARAMETRO? A showSuggestions
let introducidoUsuarioDESTINO = [];
let destino;

//* defino función manejadora de li al hacer click en el
const handleClickLiDESTINO = (event) => {
   //* Pongo en el texto del imput lo que pone en el li del click                
   let inputBoxDESTINO = document.querySelector(".destino .search-input input");   //! modificado inaki noche del domingo
   inputBoxDESTINO.value = event.target.innerText;                                 //! modificado inaki noche del domingo
  
  //* Hago desaparecer todos los li's                                           
  let suggBoxDESTINO = document.querySelector(".destino .autocom-box ul");        //! modificado inaki noche del domingo
  suggBoxDESTINO.innerHTML = "";                                                  //! modificado inaki noche del domingo
  
   //* guardo en item el li donde hizo click el usuario
  destino = event.target.id;
  if (origen && destino) {
    if (origen != destino) {
      gestionInputs(origen, destino);
    } else {
      pintaVuelo(false);
      console.error("Origen y destino igual (destino)");
      //! control de error capa8: si el origen y destino es igual
    }
  }
};

//* escucha el teclado
inputBoxDESTINO.onkeyup = (e) => {
  if (e.target.value.length >= 3) {                                             //! modificado inaki noche del domingo
  //if (e.key === "Enter" && e.target.value.length >= 3) {                      //! modificado inaki noche del domingo
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
 //! modificado inaki noche del domingo
//TODO las const en mayusculas y con _                                          
