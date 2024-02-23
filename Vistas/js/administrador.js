import { crearCursos, promesaGeneral } from './funcionesFetch.js';
import { cadenaFormateada, eliminarDatosObjecto, dialogoInformacion, mensajeDialogo, dialogoSimple, eliminarSiExiste } from './funcionesGenerales.js';
import { crearBotonImg, crearNodo, crearSelect, limpiarContenido } from './utilsDom.js';


export async function listarAlumnos(contenedor) {

    let divListAlum = crearNodo("div", "", "divListadoAlum", "", contenedor);

    let select = crearSelect('selectLUsuarios', "usuario", ["Alumnos", "Empresas"], divListAlum)


    let titulo = crearNodo("h1", "Listado de Alumnos", "", "", divListAlum)

    let divCriterios = crearNodo("div", "", "divCriterios", "divCriterios", divListAlum)

    let botonGenerarListado = crearNodo("button", "Generar Listado Alumno", "", "", divCriterios);
    let perfilProfesional = await crearCursos("DAW", botonGenerarListado, true, 1)
    let optionTodo = crearNodo("option", "Todos", "", "", perfilProfesional)
    optionTodo.value = 0

    let listadoAlumnos = crearNodo("div", "", "", "", divListAlum)

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
        eliminarSiExiste('tablaListadoAlum')
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
        }else{
            solicitud = {
                perfilP: idCurso,
                modo: 2
            }
        }


        //Creamos una tabla para los alumnos
        let tablaAlum = crearNodo("table", "", "tablaListadoAlum", "tablaListadoAlum", listadoAlumnos)
        promesaGeneral(solicitud, '../Controladores/listadoAlumnos.php')
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
                   generarPdf(alumnos,usuario)
                })
            }))
    })
}






function generarPdf(usuario,tipoUsuario) {
    //Libreria que utilizamos 
    const pdf = new jsPDF();

    // Definir la fuente y el estilo
    pdf.setFont("helvetica");

    // Aumentar el tamaño del texto
    pdf.setFontSize(16);

    // Agregar un mensaje antes de la tabla
    pdf.text("Listado de :"+tipoUsuario, 10, 10);

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

    //Recoremos el objeto con los datos obtenidos
    usuario.forEach(item => {

        //Utilizamos un object values que devuelve un array con los valores de las propiedades de un objeto
        Object.values(item).forEach((value, index) => {

            console.log(typeof value);

            if (typeof value == 'number' && index != 0) {
                pdf.text(value.toString() + "€", 10 + index * 40, y);
            } else {
                pdf.text(value.toString(), 10 + index * 40, y);
            }

           
        });
        y += 10;
    });

    // Guardar el PDF
    pdf.save("listado.pdf");

    //No funciona ya hay que otorgar permisos desde el navegador
    //pdf.open()
}







