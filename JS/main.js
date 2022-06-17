var myHeaders = new Headers();
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
  