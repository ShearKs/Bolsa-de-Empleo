import {crearCursos,insertarTitulo} from './funcionesFetch.js';
import { cadenaFormateada, eliminarDatosObjecto, dialogoInformacion, mensajeDialogo, dialogoSimple } from './funcionesGenerales.js';
import { crearNodo,limpiarContenido } from './utilsDom.js';

export function anadirTitulacion(contenedor,alumno) {
  
    //Sobre este div vamos a escribir todos nuestros nodos
    let divTitulacion = crearNodo("div", "", "divTitulacion", "", contenedor)

    let selectOption = crearNodo("select", "", "", "", divTitulacion)
    let option1 = crearNodo("option", "Cursos del centro", "", "", selectOption)
    option1.value = "centro"
    let option2 = crearNodo("option", "Cursos fuera del centro", "", "", selectOption)
    option2.value = "fuera"

    let divTitulacionesCentro = crearNodo("div", "", "", "", divTitulacion)

    titulacion(alumno,divTitulacionesCentro, "centro")

    selectOption.addEventListener('change', () => {
        if (selectOption.value === "centro") {
            titulacion(alumno,divTitulacionesCentro, "centro")
        } else {
            titulacion(alumno,divTitulacionesCentro, "fuera")
        }
    })
}

function titulacion(alumno,divPadre, centro) {
   
    limpiarContenido(divPadre)
    let divTitulacionesCentro = crearNodo("div", "", "", "", divPadre)

    if (centro == 'centro') {
        //Si el centro cargaremos el combo con unos datos
        let parrafo = crearNodo("p", "Titulos del centro", "", "", divTitulacionesCentro)
        crearCursos(alumno.curso, parrafo, true, 1);
    } else {
        //Si es de fuera el combo será con cursos cursados fuera
        let parrafo = crearNodo("p", "Titulos fuera del centro", "", "", divTitulacionesCentro)
        crearCursos(alumno.curso, parrafo, true, 2);
    }

    let btnAnadirTitulacion = crearNodo("button", "Añade la titulación", "", "", divPadre)
    btnAnadirTitulacion.addEventListener('click', () => {

        let selectCurso = document.getElementById('selectCursos');

        let solicitudCurso = {
            idCurso: selectCurso.value,
            dni: alumno.dni
        }
        insertarTitulo(solicitudCurso)

    })
}