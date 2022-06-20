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

function tellCovid(pais,ciudad,accessToken){
	let myHeaders = new Headers();
	myHeaders.append("Content-type", "application/x-www-form-urlencoded");
	myHeaders.append("Authorization", `Bearer ${accessToken}`);

	let requestOptions = {
  		method: 'GET',
  		headers: myHeaders,
  		redirect: 'follow'
};

fetch("https://test.api.amadeus.com/v1/duty-of-care/diseases/covid19-area-report?countryCode=ES&cityCode=BCN", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
}


/*
!  __ __ __  __  __   __  __       __  __         
! (_ /  /  \|__)|_   |__)|__)||\ |/  ||__) /\ |   
! __)\__\__/|   |__  |   | \ || \|\__||   /--\|__ */

//* Origen y destino rellenados, procede a buscar vuelos
getToken().then((res) => {
	console.log('res', res)
	tellCovid("ES","BCN",res);
  });
