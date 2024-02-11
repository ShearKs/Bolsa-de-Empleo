import {
   obtenerUsuario, editarUsuarioBolsa, crearCursos, generarCodigoTemporal,
   alumnosOferta, cambioContrasena, cambioContraseñaProcesa, insertarTitulo,
   enviarSolicitudes, solicitudes, devuelveAlumnosOferta, promesaGeneral
} from './funcionesFetch.js';
import { crearLabel, crearInput, crearNodo, crearNodoDebajo, limpiarContenido, crearBotonImg, crearCaja, crearSelect } from './utilsDom.js';
import { cadenaFormateada, eliminarDatosObjecto, dialogoInformacion, mensajeDialogo, dialogoSimple } from './funcionesGenerales.js';

//Añadimos nuestro lista para ir pudiendo añadir todos nuestros nodos
const listaMenu = document.getElementById('lista');

// Div sobre el que vamos a mostrar los contenidos según el botón que le indique el usuario
const contenedor = document.getElementById('principal');

//Obtenemos el rol el cual ha iniciado el usuario
let rolUser = parseInt(sessionStorage.getItem('rol'));
console.log("Rol del usuario: ", rolUser)


// Alumno en bolsa
let usuario = {};

//Alumno pinchado para la solicitud(tramitar su contrato)
let alumnoSolicitado = {}

window.onload = async (event) => {
   await obtenerUsuarioBolsa();
   crearFormularioDatos(usuario);
   menuGeneral();

   switch (rolUser) {

      case 1:
         crearMenuAlumnos();
         break;
      case 2:
         crearMenuEmpresa();
         break;

      default:
         console.log("Ha habido un error con el rol del Usuario");
   }

   let botonSalir = crearNodo("li", "", "liAlumno", "salir", listaMenu);
   crearNodo("a", "Salir", "", "", botonSalir)

   botonSalir.addEventListener('click', () => {

      //Eliminar la sesión antes
      location.href = "../index.html";
   })
};

async function obtenerUsuarioBolsa() {
   try {
      usuario = await obtenerUsuario(rolUser);
      console.log(usuario)
   } catch (error) {
      console.error("Error al obtener alumno: " + error);
   }
}

function menuGeneral() {
   let cadena = ""
   switch (rolUser) {
      case 1:
         cadena = "Ver datos del alumno";
         break;
      case 2:
         cadena = "Área de usuario";
         break;
   }


   let datosAlumnos = crearNodo("li", "", "liAlumno", "datosAlumno", listaMenu);
   crearNodo("a", cadena, "", "", datosAlumnos)

   datosAlumnos.addEventListener('click', () => {
      limpiarContenido(contenedor);
      crearFormularioDatos(usuario);
   })

   let btnCambioContrasena = crearNodo("li", "", "liAlumno", "cambioContrasena", listaMenu);
   crearNodo("a", "Cambiar Contraseña", "", "", btnCambioContrasena)

   btnCambioContrasena.addEventListener('click', async (event) => {
      event.stopPropagation();
      limpiarContenido(contenedor)
      let preguntaCambio = await dialogoInformacion("Cambio de Contraseña", "¿Estás seguro de que quieres cambiar la contraseña?\nSe te enviará un correo para proceder con el cambio de contraseña.")
      //let preguntaCambio = window.confirm("¿Estás seguro de que quieres cambiar la contraseña?");

      if (preguntaCambio) {
         cambioContrasenaCli()
      }
   })
}

function crearMenuAlumnos() {

   let botonTitulacion = crearNodo("li", "", "liAlumno", "anadirTitulacion", listaMenu);
   crearNodo("a", "Añadir Titulación", "", "", botonTitulacion)

   botonTitulacion.addEventListener('click', () => {
      limpiarContenido(contenedor);
      anadirTitulacion();
   })
}

function crearMenuEmpresa() {


   let mandarOferta = crearNodo("li", "", "liEmpresa", "solicitudOferta", listaMenu)
   crearNodo("a", "Mandar Oferta", "", "", mandarOferta)
   mandarOferta.addEventListener('click', () => {
      limpiarContenido(contenedor)
      enviarOferta();
   })

   let contratos = crearNodo("li", "", "liEmpresa", "contratosAlumnos", listaMenu)
   crearNodo("a", "Formalizar Contratos", "", "", contratos)
   contratos.addEventListener('click', () => {
      limpiarContenido(contenedor);
      visualizarSolicitudes()
   })

}

async function visualizarSolicitudes() {

   let alumSeleccionado = {}

   //booleano para saber si está seleccionado
   let ultimoSelec = null
   //Solicitud en la que está el usuario estará representada en una tabla
   let tablaSeleccionada;

   let divSolicitudes = crearNodo("div", "", "divSolicitudes", "divSolicitudes", contenedor);

   crearNodo("h1", "Solicitudes de " + usuario.nombre, "", "", divSolicitudes)

   let solicitud = { cif: usuario.cif, modo: 1 }

   await solicitudes(solicitud, divSolicitudes)

      .then((solicitudes => {
         solicitudes.forEach(solicitud => {
            let tablaSolicitud = crearNodo("table", "", "tablaSolicitud", "", divSolicitudes);
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
                  alumnos.forEach(alumno => {
                     let filaAlumno = crearNodo("tr", "", "filaAlumno", "", tablaAlumnos);
                     for (let clave in alumno) {
                        let td = crearNodo("td", alumno[clave], clave, "", filaAlumno);
                        if (clave == 'dni') td.style.display = 'none'
                     }
                     filaAlumno.addEventListener('click', (event) => {
                        // Guardar la tabla seleccionada
                        tablaSeleccionada = tablaAlumnos.parentNode.parentNode.parentNode.parentNode;

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

      }));


   let botonContrato = crearNodo("button", "Contratar", "btnContrato", "", divSolicitudes)
   botonContrato.addEventListener("click", async (event) => {
      event.stopPropagation()
      if (Object.keys(alumSeleccionado).length !== 0) {

         const confirmado = await dialogoInformacion("Realizar Contrato", "¿Quieres contratar a " + alumSeleccionado.nombre + " ?");
         if (confirmado) {
            console.log(alumSeleccionado)
            console.log(tablaSeleccionada)

            let alumno = { alumno: alumSeleccionado, cif: usuario.cif, modo: 3 }

            promesaGeneral(alumno, '../Controladores/contratacion.php')
               .then(respuesta => {
                  mensajeDialogo(respuesta)
                  tablaSeleccionada.remove()
                  console.log(divSolicitudes.children.length)
                  //Significa que solo queda el titulo y el boton y no hay ninguna solicitud por lo que procedemos a quitar
                  //el boton y a decirle al usuario que no tiene ninguna solicitud...
                  if (divSolicitudes.children.length == 2){
                     botonContrato.remove()
                     crearNodo("p", "No hay ninguna solicitud aún..", "", "", divSolicitudes)
                  }
               })

         }
      } else {
         dialogoSimple("Tienes que seleccionar algún alumno...")

      }
   })

}


async function enviarOferta() {

   let formularioOfertas = crearNodo("form", "", "", "", contenedor)
   formularioOfertas.method = "POST"

   let divMostrado = crearNodo("div", "", "", "mostrarAlumnos", contenedor)

   let divOferta = crearNodo("div", "", "divOferta", "", formularioOfertas)
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
   crearSelect("selectOferta", "posViajar", ["Si", "No"], divOferta);

   crearCaja("experienciaSector", "Experiencia en el sector", divOferta);
   crearSelect("selectOferta", "experienciaLaboral", ["Si", "No"], divOferta);

   crearCaja("residencia", "Otra residencia", divOferta);
   crearSelect("selectOferta", "residencia", ["Sí", "No"], divOferta);

   let botonSoliOferta = crearNodo("button", "Enviar solicitud", "btnOferta", "", divOferta)
   botonSoliOferta.addEventListener("click", (event) => {
      event.preventDefault();

      let solicitud = {}
      let formData = new FormData(formularioOfertas);

      // Iterar sobre los valores de formData
      for (let [clave, valor] of formData.entries()) {
         // Si la clave es "cursos[]", significa que es el elemento select múltiple
         // y debes manejar sus valores seleccionados de manera especial
         if (clave === "cursos[]") {
            // Los valores de "cursos[]" se pueden recoger directamente de formData
            // ya que FormData automáticamente maneja elementos select múltiples
            solicitud[clave] = Array.from(formData.getAll(clave));
         } else {
            solicitud[clave] = valor;
         }
      }

      alumnosOferta(solicitud, usuario, visualizarAlumnosOferta, divMostrado);
   })

}

function visualizarAlumnosOferta(alumnosOfertados, divMostrado, criterios) {

   let tabla = crearNodo("table", "", "", "", divMostrado)
   for (let alumno of alumnosOfertados) {
      let tr = crearNodo("tr", "", "", "", tabla)
      for (let propiedad in alumno) {
         crearNodo("td", alumno[propiedad], "", "", tr)
      }
   }

   let btnProcesarSoli = crearNodo("button", "Confirma las solicitudes", "", "", divMostrado);
   btnProcesarSoli.addEventListener('click', () => {

      enviarSolicitudes(alumnosOfertados, usuario, criterios)
   })
}


function anadirTitulacion() {
   //Sobre este div vamos a escribir todos nuestros nodos
   let divTitulacion = crearNodo("div", "", "divTitulacion", "", contenedor)

   let selectOption = crearNodo("select", "", "", "", divTitulacion)
   let option1 = crearNodo("option", "Cursos del centro", "", "", selectOption)
   option1.value = "centro"
   let option2 = crearNodo("option", "Cursos fuera del centro", "", "", selectOption)
   option2.value = "fuera"

   let divTitulacionesCentro = crearNodo("div", "", "", "", divTitulacion)

   titulacion(divTitulacionesCentro, "centro")

   selectOption.addEventListener('change', () => {
      if (selectOption.value === "centro") {
         titulacion(divTitulacionesCentro, "centro")
      } else {
         titulacion(divTitulacionesCentro, "fuera")
      }
   })
}

function titulacion(divPadre, centro) {
   limpiarContenido(divPadre)
   let divTitulacionesCentro = crearNodo("div", "", "", "", divPadre)

   if (centro == 'centro') {
      //Si el centro cargaremos el combo con unos datos
      let parrafo = crearNodo("p", "Titulos del centro", "", "", divTitulacionesCentro)
      crearCursos(usuario.curso, parrafo, true, 1);
   } else {
      //Si es de fuera el combo será con cursos cursados fuera
      let parrafo = crearNodo("p", "Titulos fuera del centro", "", "", divTitulacionesCentro)
      crearCursos(usuario.curso, parrafo, true, 2);
   }


   let btnAnadirTitulacion = crearNodo("button", "Añade la titulación", "", "", divPadre)
   btnAnadirTitulacion.addEventListener('click', () => {

      let selectCurso = document.getElementById('selectCursos');

      let solicitudCurso = {
         idCurso: selectCurso.value,
         dni: usuario.dni
      }
      insertarTitulo(solicitudCurso)

   })
}

function cambioContrasenaCli() {

   generarCodigoTemporal(usuario.email)
      .then(data => {
         // Después de la generación del código, creamos el DOM
         let containerCon = crearNodo("div", "", "contenedorContra", "", contenedor);
         crearLabel("cambioPass", "Introduce la clave que te hemos mandado al correo(" + usuario.email + ") para cambiar la contraseña", "lbCamPass", containerCon);
         let inputPass = crearInput("cambioPass", "inputPass", "text", containerCon);
         let botonVerifica = crearNodo("button", "Verifica el código", "btnChange", "", containerCon);

         botonVerifica.addEventListener('click', () => {
            let codigoIntro = inputPass.value;
            let correo = usuario.email;
            let solicitud = {
               valor: codigoIntro,
               correo: correo,
               modo: 1
            }

            cambioContrasena(solicitud)
               .then(() => {

                  //Creamos el div para que el usuario pueda cambiar la contraseña
                  crearCambioContrasena(containerCon)
               })
               .catch(error => {
                  // Manejo de errores
                  console.error("Error al cambiar la contraseña: " + error);
                  alert(error);
               });
         });

         alert("Se ha enviado un código a tu correo asociado. Introduce el código para cambiar la contraseña");
      })
      .catch(error => {
         // Manejo de errores, si la promesa se rechaza
         console.error("Error al generar código temporal: " + error.message);
      });

}

function crearCambioContrasena(divContenedor) {

   limpiarContenido(divContenedor)

   crearNodo("h2", "Cambia la contraseña", "", "", divContenedor)

   //Creamos dos label y dos inputs
   crearLabel("clave", "Introduce tu contraseña", "", divContenedor)
   let nuevaClave = crearInput("clave", "inputPass", "text", divContenedor)

   let btnProcesaCambio = crearNodo("button", "Cambia la contraseña", "boton", "", divContenedor)
   btnProcesaCambio.addEventListener('click', () => {
      let user = usuario.usuario;
      let contrasena = nuevaClave.value
      let solicitud = {
         contrasena: contrasena,
         usuario: user,
         modo: 2
      }
      cambioContraseñaProcesa(solicitud)
   })
}

let propEliminarAlum = ["idCurso", "disponibilidad", "posiViajar"]

async function crearFormularioDatos() {

   let usuarioChanged = usuario
   if (rolUser == 1) {
      usuarioChanged = eliminarDatosObjecto(usuario, propEliminarAlum)
   }


   let divContenedor = crearNodo("div", "", "contenedor", "", contenedor)

   let contenido = crearNodo("div", "", "formEditarAlu", "", divContenedor)
   let formulario = crearNodo("form", "", "formularioAlumnoBolsa", "", contenido);

   let modoEditar = false;

   for (let propiedad in usuarioChanged) {

      if (propiedad != 'idUsuario' && propiedad != 'usuario') {
         let label = crearLabel(propiedad, cadenaFormateada(propiedad), "lbAlumno", formulario)
         label.id = "lb" + propiedad

         let input = crearInput(propiedad, "inpFormAlum", "text", formulario)
         input.value = usuarioChanged[propiedad]
         input.id = "input" + propiedad
         input.disabled = true
      }
   }

   //Cargamos a mano si es para alumnos
   if (rolUser == 1) {
      let divViaje = crearNodo("div", "", "divCheck", "", formulario)
      crearLabel("posViaje", "Posibilidad de Viajar", "lbAlumno", divViaje)
      let inputViaje = crearInput("posViaje", "inpFormAlum", "checkBox", divViaje)
      if (usuario.posiViajar == 1) {
         inputViaje.checked = true;
         inputViaje.disabled = true
      }

      let divDis = crearNodo("div", "", "divCheck", "", formulario)
      crearLabel("posDis", "Disponibilidad", "lbAlumno", divDis)
      console.log(usuario.disponibilidad)
      let inputDipo = crearInput("posDis", "inpFormAlum", "checkBox", divDis)
      if (usuario.disponibilidad == 1) {
         inputDipo.checked = true;
         inputDipo.disabled = true
      }
   }


   let botonOcultar = crearNodo("button", "Oculta el Contenido", "botonProcesa", "", divContenedor)
   botonOcultar.addEventListener('click', () => {
      divContenedor.remove()
   })

   // Creamos el botón de editar
   let botonEditarP = crearBotonImg(contenido, "divBoton", "img", "../Vistas/img/editar.png", "#b3e6ff");

   botonEditarP.addEventListener('click', () => {


      if (!modoEditar) {

         modoEditar = true;
         // Inputs del formulario
         let inputs = formulario.getElementsByTagName("input");
         console.log(inputs.length)
         for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].id != "inputdni" && inputs[i].id != "inputcif") {
               inputs[i].disabled = false
            }
         }

         // Creamos un botón para actualizar los datos del alumno
         //let btnProcesar = crearNodo("button", "Edita tu información", "botonProcesa", "", divContenedor);
         let btnProcesar = crearNodoDebajo("button", "Edita tu información", "botonProcesa", "", botonOcultar);
         btnProcesar.addEventListener("click", async () => {
            // Creamos un nuevo objeto FormData
            let formData = new FormData();

            // Recogemos todos los campos del formulario
            let inputs = formulario.querySelectorAll('input');
            inputs.forEach(input => {
               // Si es un checkbox, añadimos su valor al FormData utilizando el nombre del campo
               if (input.type === 'checkbox') {
                  formData.append(input.name, input.checked ? 1 : 0); // true si está marcado, false si no
               } else {
                  formData.append(input.name, input.value);
               }
            });

            // Convertimos el FormData a un objeto plano
            let usuarioBolsa = {};
            formData.forEach((valor, clave) => {
               usuarioBolsa[clave] = valor;
            });

            console.log(usuarioBolsa);

            await editarUsuarioBolsa(usuarioBolsa, rolUser);
            await obtenerUsuarioBolsa();
         });
      }
   })

}


