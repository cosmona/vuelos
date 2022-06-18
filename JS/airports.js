
 function tellAirports(text){

  //& Define cabeceras
  var myHeaders = new Headers();
  myHeaders.append("Content-type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", "Bearer SH6DTUEjxSWEvhln0iREOctYgiYJ");

  //& Define parametros
  var urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");
  urlencoded.append("client_id", "RZmM20pVrP5mwD6DA52ebS0JHoM2aZ6I");
  urlencoded.append("client_secret", "hyezkVaUsomG0Usw");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch(`https://test.api.amadeus.com/v1/reference-data/locations?keyword=${text}&subType=AIRPORT`, requestOptions)
        .then(response => response.text())
                .then((result)=>{
                  console.log('[JSON.parse(result)]', [JSON.parse(result)]);
                  showSuggestions([JSON.parse(result)]);
                  console.log('result', result)
                })
                .catch(error => console.log('error', error));
}



const searchWrapper = document.querySelector(".search-input");
const inputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector(".autocom-box ul");
const icon = searchWrapper.querySelector(".icon");
let introducidoUsuario = [];
let res =[];

inputBox.onkeyup = (e)=>{
  console.log('e', e)

  if (e.key === "Enter") {
    console.log('introducidoUsuario', introducidoUsuario);
    console.log('tellAirports(introducidoUsuario.toString())', tellAirports(introducidoUsuario.toString()))
    tellAirports(introducidoUsuario.toString());
  } else {
    introducidoUsuario +=[e.key]
  }
};


function showSuggestions(list){
  let listData;
  if(!list[0].data[0].length){
    for (let i = 0; i < list[0].data.length; i++) {
      listData += `<li>${list[0].data[i]["iataCode"]} - ${list[0].data[i]["detailedName"]},${list[0].data[i]["address"]["countryName"]} </li></ul>`;
      suggBox.innerHTML = listData;
    }
    //listData = element.join('');   
  /*   userValue = inputBox.value;
    
    
    
      console.log('list[0].data[0]["detailedName"]', list[0].data[0]["detailedName"])
      console.log('suggBox', suggBox)

      console.log('listData', listData)
 */
  }
  
}  
  


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