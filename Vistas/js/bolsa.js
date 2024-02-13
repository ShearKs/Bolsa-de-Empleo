import { obtenerUsuario, editarUsuarioBolsa, generarCodigoTemporal, cambioContrasena, cambioContraseñaProcesa } from './funcionesFetch.js';
import { crearLabel, crearInput, crearNodo, crearNodoDebajo, limpiarContenido, crearBotonImg, crearCaja, crearSelect, eliminarExistente } from './utilsDom.js';
import { cadenaFormateada, eliminarDatosObjecto, dialogoInformacion, mensajeDialogo, dialogoSimple } from './funcionesGenerales.js';
import { anadirTitulacion } from './alumnos.js';
import { alumnFCTS, enviarOferta, visualizarSolicitudes } from './empresa.js';
//Añadimos nuestro lista para ir pudiendo añadir todos nuestros nodos
const listaMenu = document.getElementById('lista');

// Div sobre el que vamos a mostrar los contenidos según el botón que le indique el usuario
const contenedor = document.getElementById('principal');

//Obtenemos el rol el cual ha iniciado el usuario
let rolUser = parseInt(sessionStorage.getItem('rol'));
console.log("Rol del usuario: ", rolUser)


// Usuario de la aplicación que puede ser tanto alumno,empresa,tutor...
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
      anadirTitulacion(contenedor, usuario);
   })
}

function crearMenuEmpresa() {

   let practicasFCTS = crearNodo("li", "", "liEmpresa", "practicasFCTs", listaMenu)
   crearNodo("a", "Seleccionar Alumnos para FCTS", "", "", practicasFCTS)
   practicasFCTS.addEventListener('click', () => {
      limpiarContenido(contenedor)
      alumnFCTS(contenedor);
   })

   let mandarOferta = crearNodo("li", "", "liEmpresa", "solicitudOferta", listaMenu)
   crearNodo("a", "Mandar Oferta", "", "", mandarOferta)
   mandarOferta.addEventListener('click', () => {
      limpiarContenido(contenedor)
      enviarOferta(contenedor, usuario);
   })

   let contratos = crearNodo("li", "", "liEmpresa", "contratosAlumnos", listaMenu)
   crearNodo("a", "Formalizar Contratos", "", "", contratos)
   contratos.addEventListener('click', () => {
      limpiarContenido(contenedor);
      visualizarSolicitudes(contenedor, usuario)
   })

}



async function crearFormularioDatos() {
   let propEliminarAlum = ["idCurso", "disponibilidad", "posiViajar"]

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


