console.log('1- pulsado abajo e', e.key)
          let actual = Array.from(listLi).findIndex((item) =>
            item.classList.contains("active")
          );
          //* Analizar tecla pulsada
          if (e.key == "Enter" && origen && destino) {
            //* Tecla Enter, evitar que se procese el formulario
            e.preventDefault();
            //* ¿Hay un elemento activo?
            if (listLi[actual]) {
              //* Hacer clic
              listLi[actual].click();
            } else if {
				actual = item.lenght-1;
			}
          }
          if (e.key == "ArrowUp" || e.key == "ArrowDown") {
            //* Flecha arriba (restar) o abajo (sumar)
            if (listLi[actual]) {
              // Solo si hay un elemento activo, eliminar clase
              listLi[actual].classList.remove("active");
            }
            // Calcular posición del siguiente
            actual += e.keyCode == 38 ? -1 : 1;
            console.log("actualelement", actual);
            console.log('e', e)
            // Asegurar que está dentro de los límites
            /*  if(actual < 0) {
                      actual = 0;
                    } else if(actual >= listLi.length) {
                      actual = listLi.length - 1;
                    } */
            // Asignar clase activa
            listLi[actual].classList.add("active");
          }