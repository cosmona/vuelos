"use strict";

//& Carga la animacion de loading true:muestra false:oculta
function loadingState(activo) {
  //! modificado inaki noche del domingo
  let load = document.querySelector(".loading");

  if (activo) {
    //* muestra loading
    load.style.display = "block";
  } else {
    //* oculta loading
    load.style.display = "none";
  }
}

export { loadingState };
