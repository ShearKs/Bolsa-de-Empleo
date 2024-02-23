import { crearCursos, promesaGeneral } from './funcionesFetch.js';
import { cadenaFormateada, eliminarDatosObjecto, dialogoInformacion, mensajeDialogo, dialogoSimple, eliminarSiExiste } from './funcionesGenerales.js';
import { crearBotonImg, crearNodo, limpiarContenido } from './utilsDom.js';


export async function listarAlumnos(contenedor) {

    let divListAlum = crearNodo("div", "", "divListadoAlum", "", contenedor);

    let divCriterios = crearNodo("div", "", "divCriterios", "divCriterios", divListAlum)

    let botonGenerarListado = crearNodo("button", "Generar Listado Alumno", "", "", divCriterios);
    let perfilProfesional = await crearCursos("DAW", divCriterios, true, 1)

    let optionTodo = crearNodo("option","Todos","","",perfilProfesional)
    optionTodo.value = 0

    let listadoAlumnos = crearNodo("div", "", "", "", divListAlum)

    botonGenerarListado.addEventListener('click', () => {

        eliminarSiExiste('tablaListadoAlum')
        eliminarSiExiste('btnGpdf')

        let idCurso = parseInt(perfilProfesional.value)
        //Creamos una tabla para los alumnos
        let tablaAlum = crearNodo("table", "", "tablaListadoAlum", "tablaListadoAlum", listadoAlumnos)
        promesaGeneral({ perfilP: idCurso }, '../Controladores/listadoAlumnos.php')
            //Alumnos obtenidos de la promesa...
            .then((alumnos => {

                console.log(alumnos)

                let filaCabecera = crearNodo("tr", "", "", "", tablaAlum)
                for (let propiedad in alumnos[0]) {
                    let th = crearNodo("th", cadenaFormateada(propiedad), "", "", filaCabecera)
                }

                alumnos.forEach(alumno => {
                    //Por cada alumno creamos una fila
                    let filaAlum = crearNodo("tr", "", "", "", tablaAlum)
                    //De cada alumno creamos un td
                    for (let clave in alumno) {
                        let td = crearNodo("td", alumno[clave], "", "", filaAlum)
                    }

                })

                let btnGeneraPdf = crearNodo("button", "Genera PDF", "btnGpdf", "btnGpdf", listadoAlumnos)
                btnGeneraPdf.addEventListener('click', () => {
                    console.log(perfilProfesional.value)
                })
            }))
    })
}







