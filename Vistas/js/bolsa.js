import {
   obtenerUsuario, editarUsuarioBolsa, crearCursos, generarCodigoTemporal,
   alumnosOferta, cambioContrasena, cambioContraseñaProcesa, insertarTitulo, enviarSolicitudes
} from './funcionesFetch.js';
import { crearLabel, crearInput, crearNodo, crearNodoDebajo, limpiarContenido, crearBotonImg, crearCaja, crearSelect } from './utilsDom.js';
import { cadenaFormateada, eliminarDatosObjecto } from './funcionesGenerales.js';

//Añadimos nuestro lista para ir pudiendo añadir todos nuestros nodos
const listaMenu = document.getElementById('lista');

// const datosAlumnos = document.getElementById('datosAlumno');
// const btnCambioContrasena = document.getElementById('cambioContrasena');
// const botonTitulacion = document.getElementById('anadirTitulacion');
// const botonSalir = document.getElementById('salir');

// Div sobre el que vamos a mostrar los contenidos según el botón que le indique el usuario
const contenedor = document.getElementById('principal');

//Obtenemos el rol el cual ha iniciado el usuario
let rolUser = parseInt(sessionStorage.getItem('rol'));
console.log("Rol del usuario: ", rolUser)


// Alumno en bolsa
let usuario = {};

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
   let datosAlumnos = crearNodo("li", "", "liAlumno", "datosAlumno", listaMenu);
   crearNodo("a", "Ver datos del alumno", "", "", datosAlumnos)

   datosAlumnos.addEventListener('click', () => {
      limpiarContenido(contenedor);
      crearFormularioDatos(usuario);
   })

   let btnCambioContrasena = crearNodo("li", "", "liAlumno", "cambioContrasena", listaMenu);
   crearNodo("a", "Cambiar Contraseña", "", "", btnCambioContrasena)

   btnCambioContrasena.addEventListener('click', () => {
      let preguntaCambio = window.confirm("¿Estás seguro de que quieres cambiar la contraseña?");

      if (preguntaCambio) {
         limpiarContenido(contenedor)
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

            const respuesta = await editarUsuarioBolsa(usuarioBolsa, rolUser);
            // Si la respuesta fue exitosa, puedes mostrar un mensaje al usuario
            alert(respuesta);
            await obtenerUsuarioBolsa();
         });
      }
   })

}


