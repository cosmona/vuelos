

// Obtener la lista, para recorrer cada elemento
let listGroup = document.querySelector('ul.list-group');
console.log('listGroup', listGroup)


// Asignar evento al campo de texto
document.querySelector('#inputArticulo').addEventListener('keydown', e => {
	console.log("dentro")

if(!listGroup) {
	return; // No existe la lista
}
// Obtener todos los elementos
let items = listGroup.querySelectorAll('li');
// Saber si alguno está activo
let actual = Array.from(items).findIndex(item => item.classList.contains('active'));
// Analizar tecla pulsada
if(e.keyCode == 13) {
	// Tecla Enter, evitar que se procese el formulario
	e.preventDefault();
	// ¿Hay un elemento activo?
	if(items[actual]) {
		// Hacer clic
		items[actual].click();
	}
} if(e.keyCode == 38 || e.keyCode == 40) {
	// Flecha arriba (restar) o abajo (sumar)
	if(items[actual]) {
		// Solo si hay un elemento activo, eliminar clase
		items[actual].classList.remove('active');
	}
	// Calcular posición del siguiente
	actual += (e.keyCode == 38) ? -1 : 1;
	// Asegurar que está dentro de los límites
	if(actual < 0) {
		actual = 0;
	} else if(actual >= items.length) {
		actual = items.length - 1;
	}
	// Asignar clase activa
	items[actual].classList.add('active');
}
});
// En la función donde generas la lista debes activar evento clic para cada elemento
// Para este ejemplo se hace manual
listGroup.querySelectorAll('li').forEach(li => {
li.addEventListener('click', e => {
	// Asignar valor al campo
	document.querySelector('#inputArticulo').value = e.currentTarget.textContent;
	// Aquí deberías cerrar la lista y/o eliminar el contenido
});
});