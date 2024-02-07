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
