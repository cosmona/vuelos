//& Obtiene el los vuelos (Done)
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

//& Pinta un vuelo dom index (Done)
function pintaVuelo(vuelo) {
  console.log("vuelo", vuelo);

  let domElement = document.querySelector(".vuelos");
  const newArticle = document.createElement("article");
  domElement.appendChild(newArticle);
  newArticle.innerHTML += `<p>${vuelo.itineraries[0].segments[0].carrierCode}</p>`;
}

//& Muestra syguerencias (Done)
function tellAirports(text, token) {
  console.log("token", token);

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

//& Muestra syguerencias (Done)
function showSuggestions(list, lugar) {
  //!lugar - true:origen false: destino

  let listData = "";
  if (list.length) {
    for (let i = 0; i < list.length; i++) {
      listData += `<li id="${list[i]["iataCode"]}" class="icon">${list[i]["iataCode"]} - ${list[i]["detailedName"]},${list[i]["address"]["countryName"]} </li></ul>`;
      if (lugar) {
        suggBoxORIGEN.innerHTML = listData;
      } else {
        suggBoxDESTINO.innerHTML = listData;
      }
    }
  }
}

//& Obtiene el Token (Done)
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

//^ SCOPE PRINCIPAL ORIGEN

const searchWrapperORIGEN = document.querySelector(".origen .search-input");
const inputBoxORIGEN = searchWrapperORIGEN.querySelector("input");
const suggBoxORIGEN = document.querySelector(".origen .autocom-box ul"); //! hABRIA QUE PASARLO POR PARAMETRO? A showSuggestions
let introducidoUsuarioORIGEN = [];
let origen;

//* defino función manejadora de li al hacer click en el
const handleClickLiORIGEN = (event) => {
  console.log("ORIGEN:", event.target.id);
  origen = event.target.id; //* Guardo en item el li donde hizo click el usuario

  if (origen && destino) {
    //* Origen y destino rellenados, procede a buscar
    let originLocation = origen;
    let destinationLocation = destino;
    let deptDate = "2022-06-19";
    let numAdultos = 1;
    let maxFlights = 11;
    let enlace = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originLocation}&destinationLocationCode=${destinationLocation}&departureDate=${deptDate}&adults=${numAdultos}&max=${maxFlights}`;

    getToken().then((res) => {
      vuelosDisponibles(enlace, res).then((result) => {
        console.log("Vuelos disponibles:", result);

        for (let i = 0; i < result.data.length; i++) {
          console.log(pintaVuelo(result.data[i])); //todo PINTA LISTADO EN INDEX.HTML
        }
      });
    });
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

//^ SCOPE PRINCIPAL DESTINO

const searchWrapperDESTINO = document.querySelector(".destino .search-input");
const inputBoxDESTINO = searchWrapperDESTINO.querySelector("input");
const suggBoxDESTINO = document.querySelector(".destino .autocom-box ul");
let introducidoUsuarioDESTINO = [];
let destino;
//* defino función manejadora de li al hacer click en el
const handleClickLiDESTINO = (event) => {
  console.log("DESTINO", event.target.id);
  //* guardo en item el li donde hizo click el usuario
  destino = event.target.id;
  if (origen && destino) {
    console.log("los dos");
    let originLocation = origen;
    let destinationLocation = destino;
    let deptDate = "2022-06-19";
    let numAdultos = 1;
    let maxFlights = 11;
    let flightClass = "ECONOMY";
    let enlace = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originLocation}&destinationLocationCode=${destinationLocation}&departureDate=${deptDate}&adults=${numAdultos}&max=${maxFlights}`;

    getToken().then((res) => {
      vuelosDisponibles(enlace, res).then((result) => {
        console.log("result", result);

        for (let i = 0; i < result.data.length; i++) {
          console.log("AQUI", result.data[i].id);
          console.log("AQUI", result.data[i].price.grandTotal);
          console.log(pintaVuelo(result.data[i]));
        }
      });
    });
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

/* document.getElementById
icon.onclick = function(){
  console.log("click")
};
   */

// if user press any key and release
/* inputBox.onkeyup = (e)=>{
    let userData = e.target.value; //user enetered data
    let emptyArray = [];
    if(userData){
        icon.onclick = ()=>{
            webLink = "https://www.google.com/search?q=" + userData;
            linkTag.setAttribute("href", webLink);
            console.log(webLink);
            linkTag.click();
        }
        emptyArray = suggestions.filter((data)=>{
            //filtering array value and user characters to lowercase and return only those words which are start with user enetered chars
            return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase()); 
        });
        emptyArray = emptyArray.map((data)=>{
            // passing return data inside li tag
            return data = '<li>'+ data +'</li>';
        });
        searchWrapper.classList.add("active"); //show autocomplete box
        showSuggestions(emptyArray);
        let allList = suggBox.querySelectorAll("li");
        for (let i = 0; i < allList.length; i++) {
            //adding onclick attribute in all li tag
            allList[i].setAttribute("onclick", "select(this)");
        }
    }else{
        searchWrapper.classList.remove("active"); //hide autocomplete box
    }
}

function select(element){
    let selectData = element.textContent;
    inputBox.value = selectData;
    icon.onclick = ()=>{
        webLink = "https://www.google.com/search?q=" + selectData;
        linkTag.setAttribute("href", webLink);
        linkTag.click();
    }
    searchWrapper.classList.remove("active");
}

function showSuggestions(list){
    let listData;
    if(!list.length){
        userValue = inputBox.value;
        listData = '<li>'+ userValue +'</li>';
    }else{
        listData = list.join('');
    }
    suggBox.innerHTML = listData;
}  */
