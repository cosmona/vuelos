/* var myHeaders = new Headers();
myHeaders.append("Content-type", "application/x-www-form-urlencoded");

var urlencoded = new URLSearchParams();
urlencoded.append("grant_type", "client_credentials");
urlencoded.append("client_id", "RZmM20pVrP5mwD6DA52ebS0JHoM2aZ6I");
urlencoded.append("client_secret", "hyezkVaUsomG0Usw");

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
  redirect: 'follow'
};

fetch("https://test.api.amadeus.com/v1/security/oauth2/token", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
   */

let myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer gIWNriBfPgcYNmy4qOV4fJ18K5UU");

let urlencoded = new URLSearchParams();

let requestOptions = {
  method: "GET",
  headers: myHeaders,
  body: urlencoded,
  redirect: "follow",
};

fetch(
  "https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=SYD&destinationLocationCode=BKK&departureDate=2022-11-01&returnDate=2022-11-18&adults=2&max=5",
  requestOptions
)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.log("error", error));
