
import {
    crearCursos, enviarSolicitudes, solicitudes, devuelveAlumnosOferta, promesaGeneral, modalidadFct
} from './funcionesFetch.js';
import { cadenaFormateada, eliminarDatosObjecto, dialogoInformacion, mensajeDialogo, dialogoSimple, devolverObjetaTabla } from './funcionesGenerales.js';
import { crearLabel, crearInput, crearNodo, crearNodoDebajo, limpiarContenido, crearBotonImg, crearCaja, crearSelect, eliminarExistente } from './utilsDom.js';

export async function alumnFCTS(contenedor, empresa) {

    let divFCT = crearNodo("div", "", "divFCT", "", contenedor);

    let titulo = crearNodo("h1", "Escoge alumnos para las FCTS", "", "", divFCT)

    let select = await modalidadFct({ modo: 1 }, titulo)

    //Mensaje del error por si surge
    let mensajeError = crearNodo("p", "", "mensajeError", "", divFCT)

    let botonFCT = crearNodo("button", "Seleccionar Modalidad", "", "", divFCT)

    botonFCT.addEventListener('click', () => {

        let tipoFct = select.value
        promesaGeneral({ modo: 2, tipo: tipoFct }, '../Controladores/realizacionFCT.php')
            .then((alumnosFcts => {

                //Para recoger lo que hay dentro del option
                let tipo = select.options[select.value - 1].textContent;
                eliminarExistente("divAlumFct")

                if (alumnosFcts.hasOwnProperty('Error')) {
                    mensajeError.textContent = alumnosFcts.Error
                    return
                }
                mensajeError.textContent = ""
                visualizarAlumnosFct(alumnosFcts, empresa, tipo, contenedor)
            }))
    })
}


function visualizarAlumnosFct(alumnos, empresa, tipo, contenedor) {

    //Array de objetos donde guardaremos todos los alumnos que envie el cliente
    let alumnosPeti = []

    let divMuestraFct = crearNodo("div", "", "divAlumFct", "divAlumFct", contenedor)

    crearNodo("h2", "Cantidad de alumnos recogidos en " + tipo + "  :" + alumnos.length, "", "", divMuestraFct)

    //Creamos la tabla donde visualizaremos a alos alumnos
    let tabla = crearNodo("table", "", "tAlumFcts", "", divMuestraFct)
    let tr = crearNodo("tr", "", "", "", tabla)
    for (let propiedad in alumnos[0]) {
        if (propiedad !== 'dni') {
            crearNodo("th", cadenaFormateada(propiedad), "", "", tr);
        }
    }

    for (let alum of alumnos) {
        let tr = crearNodo("tr", "", "filaAlumno", "filaAlumno", tabla)
        for (let propiedad in alum) {
            let td = crearNodo("td", alum[propiedad], propiedad, "", tr)
            if (propiedad === 'dni') {
                td.style.display = 'none'
            }
        }
    }

    let filasAlumno = document.getElementsByClassName("filaAlumno");

    for (let i = 0; i < filasAlumno.length; i++) {
        filasAlumno[i].addEventListener('click', () => {
            console.log(filasAlumno[i])

            //Recogemos de esa fila su td correspondiente para obtener los datos del alumno
            let alumno = {}
            let tdFila = filasAlumno[i].children
            console.log(tdFila)
            for (let j = 0; j < tdFila.length; j++) {
                //Accedemos al classname de la celda
                let nombreClase = tdFila[j].className
                //Contenido que hay en ese td
                let contenido = tdFila[j].textContent
                //Creamos el objeto alumno que le añadimos al array de objetos
                alumno[nombreClase] = contenido
            }
            //Nos devuelve el index si un alumno está contenido en el array de objetos
            let index = alumnosPeti.findIndex(item => {

                //Buscamos por todos los objetos si está el objeto alumno..
                return Object.keys(item).every(key => {
                    return item[key] === alumno[key];
                })
            });

            if (index !== -1) {
                console.log("El objeto es igual al que contienes en el array")
                alumnosPeti.splice(index, 1)
                //Al estar deseleccionado le quitamos el color
                filasAlumno[i].style.backgroundColor = ''

            } else {
                alumnosPeti.push(alumno)
                filasAlumno[i].style.backgroundColor = "#74bf87";
            }

            console.log(alumnosPeti)

        })
    }

    let btnPeticion = crearNodo("button", "Realizar Petición", "", "", divMuestraFct)
    btnPeticion.addEventListener('click', async (event) => {
        event.stopPropagation();

        if (alumnosPeti.length === 0) {
            dialogoSimple("Tienes que seleccionar algun alumno...")
            return
        }

        const confirmado = await dialogoInformacion("Peticiones FCTS", "¿Quieres seleccionar a estos alumno/s para fcts? ");
        if (confirmado) {

            //Realizamos una petición de los alumnos seleccionados
            promesaGeneral({ modo: 3, tipo: tipo, alumnos: alumnosPeti, empresa: empresa }, '../Controladores/realizacionFCT.php')
                .then((respuesta => {
                    mensajeDialogo(respuesta)
                }))
        }
    })
}

/*  ------------------------------------- OFERTAS -------------------------------------------------------                     */
export async function enviarOferta(contenedor, empresa) {

    let formularioOfertas = crearNodo("form", "", "", "", contenedor)
    formularioOfertas.method = "POST"

    let divOferta = crearNodo("div", "", "divOferta", "", formularioOfertas)

    let nombreOferta = crearLabel("nombreOferta", "Nombre de la Oferta ", "", divOferta)
    let inputNomOferta = crearInput("nombreOferta", "", "text", divOferta)

    let p = crearNodo("p", "Elige intervención profesional", "", "", divOferta)
    let selectCursos = await crearCursos("DAW", p, true, 1);
    selectCursos.setAttribute("multiple", "true")
    selectCursos.setAttribute("name", "cursos[]")

    for (let i = 0; i < selectCursos.length; i++) {
        // let selectCurso = selectCursos.options[i];
        // console.log(selectCurso)
        selectCursos.options[i].setAttribute("name", "cursos");
    }

    crearCaja("ofertaViaje", "Disponibilidad para Viajar", divOferta);
    crearSelect("selectOferta", "posViajar", ["Sí", "No", "Todos"], divOferta);

    crearCaja("experienciaSector", "Experiencia en el sector", divOferta);
    crearSelect("selectOferta", "experienciaLaboral", ["Sí", "No", "Todos"], divOferta);

    crearCaja("residencia", "Otra residencia", divOferta);
    crearSelect("selectOferta", "residencia", ["Sí", "No", "Todos"], divOferta);

    let parrafoError = crearNodo("p", "", "mensajeError", "", divOferta)

    let btnAlumOf = crearNodo("button", "Obtener Alumnos", "btnOferta", "", divOferta)
    btnAlumOf.addEventListener("click", (event) => {
        event.preventDefault();

        if (inputNomOferta.value === "") {
            parrafoError.textContent = "Tienes que indicar un nombre a la oferta"
            return
        }

        //Borro el que haya ,ya que siempre que le de al botón se va a crear uno nuevo
        eliminarExistente('mostrarAlumnos')

        let solicitud = {}
        let formData = new FormData(formularioOfertas);

        // Iterar sobre los valores de formData
        for (let [clave, valor] of formData.entries()) {
            // Si la clave es "cursos[]", significa que es el elemento select múltiple
            // y manejamos sus valores de manera especial
            if (clave === "cursos[]") {
                // Los valores de "cursos[]" se pueden recoger directamente de formData
                // ya que FormData automáticamente maneja elementos select múltiples
                solicitud[clave] = Array.from(formData.getAll(clave));
            } else {
                solicitud[clave] = valor;
            }
        }
        console.log(solicitud)
        promesaGeneral({ criterios: solicitud, empresa: empresa }, '../Controladores/devuelveAlumnoOferta.php')
            .then((alumnos => {
                if (alumnos.length === 0) {
                    parrafoError.textContent = "No hay ningun alumno que cumpla esos requisitos.."
                    return
                }
                parrafoError.textContent = ""
                visualizarAlumnosOferta(alumnos, empresa, solicitud, contenedor)
            }))
    })

}

function visualizarAlumnosOferta(alumnosOfertados, empresa, criterios, contenedor) {

    let alumnosOferta = []

    let divMostrado = crearNodo("div", "", "mostrarAlumnos", "mostrarAlumnos", contenedor)

    crearNodo("h2", "Alumnos obtenidos de los cursos indicados: " + alumnosOfertados.length, "", "", divMostrado)

    let tabla = crearNodo("table", "", "", "", divMostrado)

    let trh = crearNodo("tr", "", "", "", tabla);

    // Crear los encabezados de las columnas
    for (let propiedad in alumnosOfertados[0]) {
        if (propiedad !== 'dni') { // Excluir la columna 'dni'
            let th = crearNodo("th", cadenaFormateada(propiedad), "", "", trh);
        }
    }
    for (let alumno of alumnosOfertados) {


        let tr = crearNodo("tr", "", "filaAlumno", "", tabla)
        for (let propiedad in alumno) {

            let td = crearNodo("td", alumno[propiedad], propiedad, "", tr)
            if (propiedad === 'dni') {
                td.style.display = 'none'
            }
        }
    }

    let filasAlumno = document.getElementsByClassName("filaAlumno");

    for (let i = 0; i < filasAlumno.length; i++) {
        filasAlumno[i].addEventListener('click', () => {

            //Recogemos de esa fila su td correspondiente para obtener los datos del alumno
            let alumno = {}
            let tdFila = filasAlumno[i].children
            console.log(tdFila)
            for (let j = 0; j < tdFila.length; j++) {
                //Accedemos al classname de la celda
                let nombreClase = tdFila[j].className
                //Contenido que hay en ese td
                let contenido = tdFila[j].textContent

                //Creamos el objeto alumno que le añadimos al array de objetos
                alumno[nombreClase] = contenido
            }
            //Nos devuelve el index si un alumno está contenido en el array de objetos
            let index = alumnosOferta.findIndex(item => {

                //Buscamos por todos los objetos si está el objeto alumno..
                return Object.keys(item).every(key => {
                    return item[key] === alumno[key];
                })
            });

            if (index !== -1) {
                alumnosOferta.splice(index, 1)
                //Al estar deseleccionado le quitamos el color
                filasAlumno[i].style.backgroundColor = ''

            } else {
                alumnosOferta.push(alumno)
                filasAlumno[i].style.backgroundColor = "#268da6";
            }
        })
    }

    let btnProcesarSoli = crearNodo("button", "Confirma las solicitudes", "btnOferta", "", divMostrado);
    btnProcesarSoli.addEventListener('click', async (event) => {
        event.stopPropagation();
        console.log(alumnosOferta)
        if (alumnosOferta.length === 0) {
            dialogoSimple("No has seleccionado ningún alumno..")
            return
        }
        let confirmacion = await dialogoInformacion("Enviar Oferta", "¿Quieres enviar esta oferta a estos alumno/s?")
        console.log(alumnosOferta)
        if (confirmacion) {
            promesaGeneral({ alumnos: alumnosOferta, empresa: empresa, criterios: criterios }, '../Controladores/enviarSolicitudes.php')
                .then((respuesta => {
                    mensajeDialogo(respuesta)
                }))
            //enviarSolicitudes(alumnosOferta, empresa, criterios)
        }

    })
}



//Contratos
export async function visualizarSolicitudes(contenedor, empresa) {

    let alumSeleccionado = {}

    //booleano para saber si está seleccionado
    let ultimoSelec = null

    let divSolicitudes = crearNodo("div", "", "divSolicitudes", "divSolicitudes", contenedor);

    crearNodo("h1", "Solicitudes de " + empresa.nombre, "", "", divSolicitudes)

    let contenedorTablas = crearNodo("div", "", "", "", divSolicitudes)

    let solicitud = { cif: empresa.cif, modo: 1 }

    let botonContratar;

    async function crearTablaSolicitudes() {
        await solicitudes(solicitud, divSolicitudes)

            .then((solicitudes => {
                
                solicitudes.forEach(solicitud => {
                    let tablaSolicitud = crearNodo("table", "", "tablaSolicitud", "", contenedorTablas);
                    let encabezado = crearNodo("thead", "", "theadTablaSoli", "", tablaSolicitud);
                    let cuerpoTabla = crearNodo("tbody", "", "tbodyTablaSoli", "", tablaSolicitud);

                    // Crea la fila de encabezado con las columnas
                    let encabezadoFila = crearNodo("tr", "", "trEncabezado", "", encabezado);
                    for (let clave in solicitud) {
                        let th = crearNodo("th", clave, "", "", encabezadoFila);
                    }

                    // Crea una fila de datos para cada solicitud
                    let datosFila = crearNodo("tr", "", "trDatos", "", cuerpoTabla);
                    for (let clave in solicitud) {
                        let td = crearNodo("td", solicitud[clave], "", "", datosFila);
                    }

                    // Crear una fila para la tabla anidada de alumnos
                    let filaAlumnos = crearNodo("tr", "", "filaAlumnos", "", cuerpoTabla);
                    let celdaAlumnos = crearNodo("td", "", "", "", filaAlumnos);
                    celdaAlumnos.colSpan = Object.keys(solicitud).length; // Hacer que la celda ocupe todas las columnas
                    let tablaAlumnos = crearNodo("table", "", "tablaAlumnos", "", celdaAlumnos);

                    let objeto = { cif: solicitud.cif_empresa, id: solicitud.id, modo: 2 }
                    // Obtener los alumnos de esta solicitud y construir la tabla anidada
                    devuelveAlumnosOferta(objeto)
                        .then(alumnos => {
                            for (let propiedad in alumnos[0]) {
                                if (propiedad !== 'dni') {
                                    crearNodo("th", cadenaFormateada(propiedad), "", "", tablaAlumnos)
                                }
                            }

                            alumnos.forEach(alumno => {

                                let filaAlumno = crearNodo("tr", "", "filaAlumno", "", tablaAlumnos);
                                for (let clave in alumno) {
                                    let td = crearNodo("td", alumno[clave], clave, "", filaAlumno);
                                    if (clave == 'dni') td.style.display = 'none'
                                }
                                filaAlumno.addEventListener('click', (event) => {

                                    // Cambiar de color y gestionar la selección
                                    if (ultimoSelec === filaAlumno) {
                                        // Deseleccionar el alumno si ya estaba seleccionado
                                        filaAlumno.style.backgroundColor = '';
                                        alumSeleccionado = {};
                                        ultimoSelec = null;
                                    } else {
                                        // Seleccionar el alumno y guardar sus datos
                                        if (ultimoSelec !== null) {
                                            // Si había otro alumno seleccionado, deseleccionarlo
                                            ultimoSelec.style.backgroundColor = '';
                                        }
                                        filaAlumno.style.backgroundColor = "#6f5ed0";
                                        //recogemos las celdas (td) que contiene cada tr(fila) que clico
                                        //recoge los datos sobre el que hemos pinchado
                                        let celdas = filaAlumno.querySelectorAll("td");
                                        //Cargamos en el objeto el ultimo seleccionado
                                        alumSeleccionado["id"] = solicitud.id
                                        for (let i = 0; i < celdas.length; i++) {
                                            let atributo = celdas[i].className;
                                            let contenido = celdas[i].textContent;

                                            alumSeleccionado[atributo] = contenido;
                                        }
                                        ultimoSelec = filaAlumno;
                                    }

                                })
                            });
                        });
                });

                botonContratar = crearNodo("button", "Contratar", "btnContrato", "", divSolicitudes)

            }));

    }
    await crearTablaSolicitudes()

    botonContratar.addEventListener("click", async (event) => {
        event.stopPropagation()
        if (Object.keys(alumSeleccionado).length !== 0) {

            const confirmado = await dialogoInformacion("Realizar Contrato", "¿Quieres contratar a " + alumSeleccionado.nombre + " ?");
            if (confirmado) {

                let alumno = { alumno: alumSeleccionado, cif: empresa.cif, modo: 3 }

                promesaGeneral(alumno, '../Controladores/contratacion.php')
                    .then(respuesta => {
                        mensajeDialogo(respuesta)

                        //Significa que solo queda el titulo y el boton y no hay ninguna solicitud por lo que procedemos a quitar
                        //el boton y a decirle al empresa que no tiene ninguna solicitud...
                        if (divSolicitudes.children.length == 2) {
                            botonContratar.remove()
                            crearNodo("h1", "Solicitudes de " + empresa.nombre, "", "", divSolicitudes)
                            crearNodo("p", "No hay ninguna solicitud aún..", "", "", divSolicitudes)
                        }

                        if (respuesta.hasOwnProperty('Exito')) {
                            limpiarContenido(divSolicitudes)
                            crearNodo("h1", "Solicitudes de " + empresa.nombre, "", "", divSolicitudes)
                            crearTablaSolicitudes()
                        }
                    })

            }
        } else {
            dialogoSimple("Tienes que seleccionar algún alumno...")

        }
    })

}

