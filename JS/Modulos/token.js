"use strict";
//& Obtiene el Token
async function getToken() {
  
  //* define cabeceras
  let myHeaders = new Headers();
  myHeaders.append("Content-type", "application/x-www-form-urlencoded");

  let urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");
  urlencoded.append("client_id", "5djtWLIBBsUkJkex393hCuXKE28UiGZE");
  urlencoded.append("client_secret", "Nk2jwYlQnf9WYuVr");

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
    return console.log("error", error); //TODO Control de errores
  }
}

export { getToken };
