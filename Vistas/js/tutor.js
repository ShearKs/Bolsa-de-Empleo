import { promesaGeneral } from './funcionesFetch.js';
import { cadenaFormateada, eliminarDatosObjecto, dialogoInformacion, mensajeDialogo, dialogoSimple } from './funcionesGenerales.js';
import { crearBotonImg, crearNodo, limpiarContenido } from './utilsDom.js';

export function alumnosPeticiones(contenedor, tutor) {

    //Sobre este div vamos a escribir todos nuestros nodos
    let divPeticiones = crearNodo("div", "", "divPeticiones", "", contenedor)

    crearNodo("h2", "Alumnos de " + tutor.nombre + "," + tutor.apellidos
        , "", "", divPeticiones)
    crearNodo("h3", "Tutor/a de " + tutor.curso, "", "", divPeticiones)

    //Obtenemos todos los alumnos que tutoriza
    promesaGeneral({ tutor: tutor, modo: 1 }, '../Controladores/peticionesAlumnos.php')
        .then((alumnos => {
            //Creamos una tabla con los alumnos de los que somos tutor..
            let tablaAlumnos = crearNodo("table", "", "tAlumTutor", "", divPeticiones);
            //Creamos la cabecera
            let trh = crearNodo("tr", "", "", "", tablaAlumnos);
            //Llenamos la cabecera
            for (let propieadesAlum in alumnos[0]) {
                crearNodo("th", cadenaFormateada(propieadesAlum), "", "", trh);
            }

            //Llenamos la tabla con los alumnos
            for (let alumno of alumnos) {
                //Por cada alumno creamos una fila..
                let tr = crearNodo("tr", "", "", "", tablaAlumnos);

                for (let valor in alumno) {
                    crearNodo("td", alumno[valor], "", "", tr)
                }
            }
        }))
}


export function peticionesFCTS(contenedor, tutor) {
    //Div sobre el que se mostrarán las peticiones
    let divPeticionesFcts = crearNodo("div", "", "divPeticiones", "", contenedor);

    crearNodo("h2", "Peticiones de los Alumnos", "", "", divPeticionesFcts)
    crearNodo("p", "Para asignar un alumno con una empresa pinchas en más y seleccionar el alumno que se quiera asignar a esa empresa", "", "", divPeticionesFcts);

    tablaPeticiones(divPeticionesFcts, tutor);


}
async function tablaPeticiones(contenedor, tutor) {

    let alumnosSeleccionados = []
    let objetoPeticion = {}

    let divTabla = crearNodo("div", "", "contenedorPeticiones", "", contenedor);
    let tablaAnterior = null;

    let botonAsignar;


    async function crearTablaPeticiones() {
        await promesaGeneral({ modo: 2, idCurso: tutor.idCursoT }, '../Controladores/peticionesAlumnos.php')
            .then((peticiones => {

                if (peticiones.hasOwnProperty('Error')) {
                    crearNodo("p", "No se ha encontrado ninguna petición...", "", "", contenedor)
                    return;
                }

                // Recorremos todas las peticiones y las mostramos en forma de tabla
                peticiones.forEach(peticion => {
                    let tablaPeticiones = crearNodo("table", "", "tablaSolicitud", "", divTabla);
                    let encabezado = crearNodo("thead", "", "theadTablaSoli", "", tablaPeticiones);
                    let cuerpoTabla = crearNodo("tbody", "", "tbodyTablaSoli", "", tablaPeticiones);

                    // Crea la fila de encabezado con las columnas
                    let encabezadoFila = crearNodo("tr", "", "trEncabezado", "", encabezado);
                    for (let clave in peticion) {
                        let th = crearNodo("th", cadenaFormateada(clave), "", "", encabezadoFila);
                    }
                    crearNodo("th", "", "", "", encabezadoFila);

                    // Crea una fila de datos para cada peticion
                    let datosFila = crearNodo("tr", "", "trDatos", "", cuerpoTabla);
                    for (let clave in peticion) {
                        let td = crearNodo("td", peticion[clave], clave, "", datosFila);
                    }

                    // Creamos una fila y una celda para ver los alumnos de la petición
                    let trAlumno = crearNodo("tr", "", "", "", tablaPeticiones);
                    let celda = crearNodo("td", "", "", "", trAlumno);
                    celda.colSpan = Object.keys(peticion).length + 1;

                    let btnMas = crearNodo("td", "", "btnMasAlumno", "", datosFila);
                    crearBotonImg(btnMas,"boton","btnMasAlum","./img/mas.png","#75caff")

                    btnMas.addEventListener('click', async () => {
                        btnMas.style.display = 'none'
                        let botonRemove = crearNodo("td", "", "btnMasAlumno", "", datosFila)
                        crearBotonImg(botonRemove,"boton","btnMasAlum","./img/menos.png","#75caff")
                        botonRemove.addEventListener('click', () => {
                            botonRemove.remove();
                            btnMas.style.display = "flex"
                            tablaAlumnos.remove();
                        })

                        let tablaAlumnos = crearNodo("table", "", "tAlumnos", "", celda);
                        await promesaGeneral({ modo: 3, id: peticion.id, idCurso: tutor.idCursoT }, "../Controladores/peticionesAlumnos.php")
                            .then((alumnos => {

                                let trCabecera = crearNodo("tr", "", "trAlumno", "", tablaAlumnos)
                                    //cabecera
                                    for (let propiedad in alumnos[0]) {

                                        if(propiedad != 'dniAlumno'){
                                            let th = crearNodo("th", cadenaFormateada(propiedad), "", "", trCabecera);
                                        }
                                    }

                                alumnos.forEach(alumno => {

                                    let trAlum = crearNodo("tr", "", "trAlumno", "", tablaAlumnos);
                                    for (let propiedad in alumno) {

                                        let td = crearNodo("td", alumno[propiedad], propiedad, "", trAlum);
                                        if (propiedad == 'dniAlumno') td.style.display = 'none'
                                    }

                                    trAlum.addEventListener('click', () => {
                                        let alumnos = {}

                                        //Cada vez que clico en un alumno vacio la peticón y si clico un mismo alumno de esa petición se sutituirá por un mismo valor...

                                        let filaCabecera = tablaPeticiones.querySelectorAll('.trDatos');
                                        console.log(filaCabecera)
                                        console.log(trAlum)

                                        filaCabecera.forEach(fila => {
                                            // Seleccionar tanto <th> como <td>
                                            let celdas = fila.querySelectorAll('th, td');
                                            for (let i = 0; i < celdas.length - 1; i++) {
                                                let clave = celdas[i].className
                                                let dato = celdas[i].textContent
                                                objetoPeticion[clave] = dato

                                            }
                                        });


                                        if (tablaAnterior !== tablaPeticiones) {
                                            // Si la tabla anterior es diferente a la tabla actual, desmarcar todos los alumnos de la tabla anterior
                                            if (tablaAnterior !== null) {

                                                //Vaciamos el array de objetos
                                                alumnosSeleccionados = []
                                                let alumnosTablaAnterior = tablaAnterior.querySelectorAll(".trAlumno");
                                                alumnosTablaAnterior.forEach(alumno => {
                                                    alumno.style.backgroundColor = "";
                                                });
                                            }
                                        }

                                        let celdas = trAlum.querySelectorAll("td");
                                        for (let i = 0; i < celdas.length; i++) {
                                            let campo = celdas[i].className
                                            let contenido = celdas[i].textContent

                                            alumnos[campo] = contenido;
                                        }
                                        alumnosSeleccionados.push(alumnos)

                                        // Marcar al alumno como seleccionado
                                        trAlum.style.backgroundColor = "#66ffff";
                                        // Actualizar la tabla anterior
                                        tablaAnterior = tablaPeticiones;
                                    });
                                });
                            }));
                    });
                });

                botonAsignar = crearNodo("button", "Asignar Alumnx", "", "", divTabla)
            }));


    }


    await crearTablaPeticiones();

    botonAsignar.addEventListener('click', async (event) => {

        event.stopPropagation();

        if (alumnosSeleccionados.length === 0) {
            dialogoSimple("Tienes que seleccionar algún alumno para realizar su asignación")
            return;
        }

        let cifEmpresa = objetoPeticion.cif
        let idPeticion = objetoPeticion.id
        console.log(alumnosSeleccionados)

        let confirmación = await dialogoInformacion("Asignación de alumnos", "¿Quieres asignar estos alumnox a la empresa:?" + objetoPeticion["Nombre Empresa"])

        console.log(objetoPeticion)

        if (confirmación) {
            promesaGeneral({ modo: 4, cif: cifEmpresa, dniTutor: tutor.dni, alumnos: alumnosSeleccionados }, '../Controladores/peticionesAlumnos.php')
                .then((respuesta => {
                    //Te muestra el mensaje tanto si ha sido todo como el error que ha pasado
                    mensajeDialogo(respuesta)

                    if (respuesta.hasOwnProperty('Exito')) {
                        limpiarContenido(divTabla)
                        crearTablaPeticiones();
                    }
                }))
        }

    })

}
