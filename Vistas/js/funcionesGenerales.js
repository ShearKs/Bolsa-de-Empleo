import { crearLabel, crearInput, crearNodo, crearNodoDebajo, limpiarContenido } from './utilsDom.js';

//Devuelve una cadena pasada de forma que la primera letra esté en mayuscula y las demás en minúsculas
export function cadenaFormateada(cadena) {


    let cadenaPasada = cadena.charAt(0).toUpperCase() +
        cadena.slice(1).toLowerCase();

    return cadenaPasada;

}

export function eliminarSiExiste(idElimnado) {

    let nodo = document.getElementById(idElimnado);
    if (nodo) {
        nodo.remove();
    }

}

//Le pasamos un objeto y una array con las propiedades a borrar y nos devuelve una copia del objeto con los elementos eliminados
export function eliminarDatosObjecto(objeto, arrayEliminados) {

    //Hacemos una copia del objeto pasado
    let copiaObjeto = { ...objeto }

    //Iteramos el objeto y nos encargamos de eliminar lo que no desemos
    arrayEliminados.forEach(propiedad => {
        delete copiaObjeto[propiedad]
    })

    //retornamos la copia del objeto
    return copiaObjeto;


}

export function cambioRuta(esIndex) {
    let ruta = '';
    if (esIndex) {
        ruta = '../'
    }
    return ruta;
}

//comprueba que todos los campos están rellenados
export function comprobarFormulario(inputs) {
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value.trim() === '') {
            alert("Por favor rellene todos los campos");
            return false; // Retorna false si algún campo está vacío
        }
    }
    return true;
}

export function eventoCheckBox(checkbox, elementoCreado, idNodo, nodo, nodoAnterior) {

    //Le añadimos un evento al checkbox que si lo pulsas te salga un text area con la información
    checkbox.addEventListener('click', () => {

        if (checkbox.checked) {

            nodo = crearNodoDebajo(elementoCreado, "", "", idNodo, nodoAnterior)
        } else {
            let exp = document.getElementById(idNodo);
            exp.remove();
        }

    })
}


export function mensajeDialogo(respuesta) {

    let exito = false

    let dialog = crearNodo("dialog", "", "dialog", "dialog", document.body)
    let tituloDia = crearNodo("h1","","","dialogoTitulo",dialog)

    if (respuesta.hasOwnProperty('Exito')) {
        tituloDia.textContent = "Acción Realizada"
        dialog.innerHTML += "<p>" + respuesta.Exito + "</p>"
        exito = true
    } else {

        tituloDia.textContent = "Error"
        dialog.innerHTML += "<p>" + respuesta.Error + "</p>"

        dialog.style.backgroundColor = "#ffe6e6";
        dialog.style.border = "5px solid #e60000";
        //Lo he tenido que hacer así porque con el tituloDia.style ...  no me funcionaba...
        document.getElementById("dialogoTitulo").style.color = "#e60000"

    }

    let btnAceptar = crearNodo("button", "Aceptar", "botonMenDialogo", "botonMenDialogo", dialog)
    if (!exito) { btnAceptar.style.backgroundColor = "#e60000"; }

    btnAceptar.addEventListener('click', () => {

        dialog.close()
        dialog.remove()

        document.querySelectorAll("body > *").forEach(element => {
            element.classList.remove("blur");
        });

    })
    dialog.show()

    // Cerrar el diálogo cuando fuera del dialogo lo quitamos y le quitamos el blur que contenga
    //Evento click a todo el documento
    document.addEventListener('click', (event) => {
        //Hacemos que cuando 
        if (!dialog.contains(event.target)) {
            dialog.close();
            dialog.remove();
            document.querySelectorAll("body > *").forEach(element => {
                element.classList.remove("blur");
            });
        }
    });
    // Cerrar el diálogo cuando se presiona una tecla de escape (con keydown nos referimos a clicamos en cualquier tecla)
    window.addEventListener('keydown', (event) => {
        //Si hacemos escape cerramos el dialogo y eliminamos el blur
        if (event.key === 'Escape') {
            dialog.close();
            dialog.remove();
            element.classList.remove("blur");
        }
    });

    //Activamos el blur a toda la página menos al dialogo 
                             //buscamos todos los que no son dialogos y le añadimos el blur
    document.querySelectorAll("body > *:not(.dialog)").forEach(element => {
        //El blur está está establecido en nuestro css
        element.classList.add("blur");
    });

    return exito
}


