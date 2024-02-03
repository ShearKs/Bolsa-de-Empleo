import { crearLabel, crearInput, crearNodo, crearNodoDebajo, limpiarContenido } from './utilsDom.js';

//Devuelve una cadena pasada de forma que la primera letra esté en mayuscula y las demás en minúsculas
export function cadenaFormateada(cadena) {


    let cadenaPasada = cadena.charAt(0).toUpperCase() +
        cadena.slice(1).toLowerCase();

    return cadenaPasada;

}

export function cambioRuta(esIndex){
    let ruta='';
    if(esIndex){
        ruta = '../'
    }
    return ruta;
}

export function eventoCheckBox(checkbox, elementoCreado, idNodo,nodo,nodoAnterior) {

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
























