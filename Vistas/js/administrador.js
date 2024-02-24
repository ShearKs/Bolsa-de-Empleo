import { crearCursos, promesaGeneral, solicitudes } from './funcionesFetch.js';
import { cadenaFormateada, eliminarDatosObjecto, dialogoInformacion, mensajeDialogo, dialogoSimple, eliminarSiExiste } from './funcionesGenerales.js';
import { crearBotonImg, crearInput, crearNodo, crearSelect, limpiarContenido } from './utilsDom.js';

//import { jsPDF } from "jspdf";



export function consulta(contenedor) {

    let divConsulta = crearNodo("div", "", "divConsulta", "", contenedor)

    let titulo = crearNodo("h1", "Consulta de Alumnos", "tituloConsulta", "", divConsulta)

    let divCriteria = crearNodo("div", "", "divCriteria", "", divConsulta)
    crearNodo("p", "¿Que quieres consultar?", "parrafoCriteria", "", divCriteria)
    let selectOption = crearSelect("selectUser", "usuario", ["Alumno", "Empresa"], divCriteria)
    let parrafo = crearNodo("p", "Introduce el dni del Alumno:", "parrafoCriteria", "", divCriteria)
    let inputDni = crearInput("dni", "inputCDni", "text", divCriteria)

    let botonConsulta = crearNodo("button", "Consulta el alumno", "btnConsulta", "", divCriteria)

    selectOption.addEventListener('change', () => {
        if (selectOption.value === 'Empresa') {
            titulo.textContent = "Consulta de Empresas"
            botonConsulta.textContent = "Consulta la empresa"
            parrafo.textContent = "Introduce el cif de la Empresa:"
        } else {
            titulo.textContent = "Consulta de Alumnos"
            botonConsulta.textContent = "Consulta el alumno"
            parrafo.textContent = "Introduce el dni del Alumno:"
        }
    })


    //Donde imprimos la empresa o la consulta deveulta
    let divContenedor = crearNodo("div", "", "divContenedor", "", divConsulta)

    botonConsulta.addEventListener('click', (event) => {
        limpiarContenido(divContenedor)
        event.stopPropagation();

        if (inputDni.value === "") {
            dialogoSimple("Tienes que introducir un dni..");
            return;
        }

        let tipoUsuario = selectOption.value
        console.log(tipoUsuario)
        console.log(inputDni.value)
        let tituloString = selectOption.value == "Alumno" ? "Alumno Consultado" : "Empresa Consultada"
        promesaGeneral({ dni: inputDni.value.trim() , tipo: tipoUsuario }, '../Controladores/consultaAdministrador.php')

            .then((user => {
                if (user.hasOwnProperty('Error')) {
                    //console.log("No existe ese usuario");
                    dialogoSimple("No existe ese " + selectOption.value)
                    return;
                }

                crearNodo("h2", tituloString, "", "", divContenedor)

                let divAlumno = crearNodo("div", "", "divAlumGrid", "", divContenedor)

                for (let propiedad in user) {
                    crearNodo("div", cadenaFormateada(propiedad) + "  :", "propiedadAlum", "", divAlumno)
                    crearNodo("div", user[propiedad], "contenidoAlum", "", divAlumno)
                }

                //Ademas si es una empresa nos tenemos que encargar de sacar sus contratos y sus solicitudes...
                if (selectOption.value == 'Empresa') {

                    promesaGeneral({dni:inputDni.value.trim() ,tipo: "solicitudesEmpresa"} ,'../Controladores/consultaAdministrador.php')
                        .then((solicitudes =>{
                              //Si la empresa no tiene solicitudes
                              if(solicitudes.hasOwnProperty('Error')){
                                crearNodo("p","La empresa no ha realizado ninguna solicitud...","","",divContenedor);
                                exit;
                            }

                            crearNodo("h3", "Consultas de la Empresa", "", "", divContenedor)
                            let divConsultas = crearNodo("div","","divConsultasAd","divConsultasAd",divContenedor)
                            //Visualizamos todas las solicitudes...
                            let tablaSolicitud = crearNodo("table", "", "tablaConsulta", "tablaConsulta", divConsultas);

                            //Instancio el primer contrato porque va a ser de donde voy a sacar las cabeceras...
                            let primeraSoli = solicitudes[0];
                            let propSolicitud = Object.keys(primeraSoli)


                            let trh = crearNodo("tr", "", "", "", tablaSolicitud)
                            for (let cabecera of propSolicitud) {
                                crearNodo("td", cadenaFormateada(cabecera), "", "", trh);
                            }


                            for (let solicitud of solicitudes) {
                                let tr = crearNodo("tr", "", "", "", tablaSolicitud)
                                for (let propiedad in solicitud) {
                                    crearNodo("td", solicitud[propiedad], "", "", tr);
                                }
                            }
                        }))

                    promesaGeneral({ dni: inputDni.value.trim(), tipo: "contratosEmpresa" }, '../Controladores/consultaAdministrador.php')
                        .then((contratos => {
                            //console.log(contratos)

                            //Si no tiene contratos la empresa...
                            if(contratos.hasOwnProperty('Error')){
                                crearNodo("p","La empresa no ha realizado aún ningún contrato...","","",divContenedor);
                                return;
                            }

                            crearNodo("h3", "Contratos de la Empresa", "", "", divContenedor)

                            let divContratos = crearNodo("div","","divContratosAd","divContratosAd",divContenedor)
                            //Visualizamos todos los contratos de la empresa en formato tabla
                            let tablaContratos = crearNodo("table", "", "tablaContratos", "tablaContratos", divContratos);

                            //Instancio el primer contrato porque va a ser de donde voy a sacar las cabeceras...
                            let primerContrato = contratos[0];
                            let propiedadesContrato = Object.keys(primerContrato)


                            let trh = crearNodo("tr", "", "", "", tablaContratos)
                            for (let cabecera of propiedadesContrato) {
                                crearNodo("td", cadenaFormateada(cabecera), "", "", trh);
                            }



                            //Otra forma de hacerlo que ya no me acordaba como lo hacia
                            // for (let contrato in contratos) {

                            //     let tr = crearNodo("tr", "", "", "", tablaContratos)
                            //     for (let propiedad in contratos[contrato]) {

                            //         crearNodo("td", contratos[contrato][propiedad], "", "", tr);
                            //     }
                            // }
                            for (let contrato of contratos) {
                                let tr = crearNodo("tr", "", "", "", tablaContratos)
                                for (let propiedad in contrato) {
                                    crearNodo("td", contrato[propiedad], "", "", tr);
                                }
                            }


                        }))

                    


                }

            }))
    })
}


export async function listado(contenedor) {

    let divListado = crearNodo("div", "", "divListado", "", contenedor);

    //Como siempre está cargado los alumnos de primeras en el select option le ponemos listado de alumnos
    let titulo = crearNodo("h1", "Listado de Alumnos", "", "", divListado)

    let divCriterios = crearNodo("div", "", "divCriterios", "divCriterios", divListado)

    let select = crearSelect('selectLUsuarios', "usuario", ["Alumnos", "Empresas"], divCriterios)
    let perfilProfesional = await crearCursos("DAW", select, true, 1)
    let botonGenerarListado = crearNodo("button", "Generar Listado Alumno", "", "", divCriterios);
    let optionTodo = crearNodo("option", "TODOS", "", "", perfilProfesional)
    optionTodo.value = 0

    let listado = crearNodo("div", "", "contenedorListado", "", divListado)

    select.addEventListener('change', () => {
        if (select.value == "Empresas") {
            titulo.textContent = "Listado de Empresas"
            botonGenerarListado.textContent = "Generar Listado Empresas"
        } else {
            titulo.textContent = "Listado de Alumnos"
            botonGenerarListado.textContent = "Generar Listado Alumnos"
        }
    })


    botonGenerarListado.addEventListener('click', () => {
        console.log(select.value)
        eliminarSiExiste('tablaListado')
        eliminarSiExiste('btnGpdf')

        let idCurso = parseInt(perfilProfesional.value)

        //Necesitamos sabe si es alumno o empresa
        let usuario = select.value;
        let solicitud = {}

        if (usuario == 'Alumnos') {
            solicitud = {
                perfilP: idCurso,
                modo: 1
            }
        } else {
            solicitud = {
                perfilP: idCurso,
                modo: 2
            }
        }


        //Creamos una tabla para los alumnos
        let tablaAlum = crearNodo("table", "", "tablaListado", "tablaListado", listado)
        promesaGeneral(solicitud, '../Controladores/listadosAdministrador.php')
            //Alumnos obtenidos de la promesa...
            .then((usuarios => {

                console.log(usuarios)

                let filaCabecera = crearNodo("tr", "", "", "", tablaAlum)
                for (let propiedad in usuarios[0]) {
                    let th = crearNodo("th", cadenaFormateada(propiedad), "", "", filaCabecera)
                }

                usuarios.forEach(usuario => {
                    //Por cada alumno creamos una fila
                    let filaAlum = crearNodo("tr", "", "", "", tablaAlum)
                    //De cada alumno creamos un td
                    for (let clave in usuario) {
                        let td = crearNodo("td", usuario[clave], "", "", filaAlum)
                    }

                })

                let btnGeneraPdf = crearNodo("button", "Genera PDF", "btnGpdf", "btnGpdf", listado)
                btnGeneraPdf.addEventListener('click', () => {
                    generarPdf(usuarios, usuario)
                })
            }))
    })
}




function generarPdf(usuario, tipoUsuario) {
    //Libreria que utilizamos 
    const pdf = new jsPDF("landscape");

    // Definir la fuente y el estilo
    pdf.setFont("Verdada");

    // Aumentar el tamaño del texto
    pdf.setFontSize(16);

    // Agregar un mensaje antes de la tabla
    pdf.text("Listado de : " + tipoUsuario, 10, 10);

    // Restaurar el tamaño de fuente original
    pdf.setFontSize(12);

    // Configurar la posición inicial de la tabla
    let y = 20;

    // Agregar la fila de encabezado
    // propiedadProductos.forEach((column, index) => {
    //     pdf.text(column, 10 + index * 40, y);
    // });

    // Ajustar la posición para las filas de datos
    y += 10;

    ///// SIN TABLA
    //Recoremos el objeto con los datos obtenidos
    // usuario.forEach(item => {
    //     console.log(item)
    //     Object.values(item).forEach((value, index) => {

    //         pdf.text(value.toString(), 15 + index * 40, y);
    //     });
    //     y += 10;
    // });

    //CON TABLA
    const cabeceras = Object.keys(usuario[0]);
    //Para tener todas en maysuculas
    const cabecerasFormateadas = cabeceras.map(cadenaFormateada)

    const data = usuario.map(obj => cabeceras.map(key => obj[key]));

    pdf.autoTable({
        startY: 20,
        head: [cabecerasFormateadas],
        body: data,
        //Tema de la tabla hay los siguientes temas: grid,striped,plain
        theme: 'striped',
        // headStyles: { fillColor: [0, 0, 255] },
        // bodyStyles: { textColor: [255, 0, 0] },
    });

    // Guardar el PDF
    pdf.save("listado.pdf");

    //No funciona ya hay que otorgar permisos desde el navegador
    //pdf.open()
}







