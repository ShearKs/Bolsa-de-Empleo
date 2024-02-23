import { promesaGeneral } from './funcionesFetch.js';
import { cadenaFormateada, eliminarDatosObjecto, dialogoInformacion, mensajeDialogo, dialogoSimple, eliminarSiExiste } from './funcionesGenerales.js';
import { crearBotonImg, crearNodo, limpiarContenido } from './utilsDom.js';


export function listarAlumnos(contenedor) {

    let divListAlum = crearNodo("div", "", "divListadoAlum", "", contenedor);

    let botonGenerarListado = crearNodo("button", "Generar Listado Alumno", "", "", divListAlum);

    let listadoAlumnos = crearNodo("div", "", "", "", divListAlum)

    botonGenerarListado.addEventListener('click', () => {
        eliminarSiExiste('tablaListadoAlum')
        //Creamos una tabla para los alumnos
        let tablaAlum = crearNodo("table", "", "tablaListadoAlum", "tablaListadoAlum", listadoAlumnos)
        promesaGeneral({}, '../Controladores/listadoAlumnos.php')
            //Alumnos obtenidos de la promesa...
            .then((alumnos => {
                alumnos.forEach(alumno => {
                    //Por cada alumno creamos una fila
                    let filaAlum = crearNodo("tr", "", "", "", tablaAlum)
                    //De cada alumno creamos un td
                    // for (clave in alumno) {
                    //     let td = crearNodo("td", alumno[clave], "", "", filaAlum)
                    // }
                    console.log(alumno)
                    for (let i = 0; i < alumno.length; i++) {
                        let td = crearNodo("td", alumno[i], "", "", filaAlum)
                    }

                })
            }))
    })

}







