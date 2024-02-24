import { crearCursos, promesaGeneral } from './funcionesFetch.js';
import { cadenaFormateada, eliminarDatosObjecto, dialogoInformacion, mensajeDialogo, dialogoSimple, eliminarSiExiste } from './funcionesGenerales.js';
import { crearBotonImg, crearNodo, crearSelect, limpiarContenido } from './utilsDom.js';

//import { jsPDF } from "jspdf";


export async function listado(contenedor) {

    let divListado = crearNodo("div", "", "divListado", "", contenedor);

    let select = crearSelect('selectLUsuarios', "usuario", ["Alumnos", "Empresas"], divListado)

    //Como siempre está cargado los alumnos de primeras en el select option le ponemos listado de alumnos
    let titulo = crearNodo("h1", "Listado de Alumnos", "", "", divListado)

    let divCriterios = crearNodo("div", "", "divCriterios", "divCriterios", divListado)

    let botonGenerarListado = crearNodo("button", "Generar Listado Alumno", "", "", divCriterios);
    let perfilProfesional = await crearCursos("DAW", botonGenerarListado, true, 1)
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
        promesaGeneral(solicitud, '../Controladores/listadoAlumnos.php')
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







