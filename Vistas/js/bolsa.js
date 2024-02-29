import { obtenerUsuario, editarUsuarioBolsa, generarCodigoTemporal, cambioContrasena, promesaGeneral } from './funcionesFetch.js';
import { crearLabel, crearInput, crearNodo, crearNodoDebajo, limpiarContenido, crearBotonImg, crearCaja, crearSelect, eliminarExistente } from './utilsDom.js';
import { cadenaFormateada, eliminarDatosObjecto, dialogoInformacion, mensajeDialogo, dialogoSimple } from './funcionesGenerales.js';

//Usuarios de la aplicación
import { anadirTitulacion } from './alumnos.js';
import { alumnFCTS, enviarOferta, visualizarSolicitudes } from './empresa.js';
import { alumnosPeticiones, peticionesFCTS } from './tutor.js';
import { consulta, listado } from './administrador.js';


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
      case 3:
         crearMenuTutor();
         break;
      case 4:
         crearMenuAdministrador();
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

   await promesaGeneral({idUsuario:usuario.iduser , nombreUser:usuario.usuario},'../Controladores/comprobacionAcceso.php')
      .then((respuesta =>{
         console.log(respuesta)
      }))

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
      case 3:
         cadena = "Tu información"
         break;
      case 4:
         cadena = "Datos Administrador";
         break;
   }

   let datosUsuarioApp = crearNodo("li", "", "liAlumno", "datosAlumno", listaMenu);
   crearNodo("a", cadena, "", "", datosUsuarioApp)

   datosUsuarioApp.addEventListener('click', async () => {
      //Para que cuando veamos nuestro datos esten actualizados y lo veamos sin tener que recargar
      await obtenerUsuarioBolsa()
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


function crearMenuAdministrador() {


   let btnConsulta = crearNodo("li", "", "liConsulta", "conultasAdmin", listaMenu)
   crearNodo("a", "Consulta alumno o empresa", "", "", btnConsulta)

   btnConsulta.addEventListener('click', () => {
      limpiarContenido(contenedor)
      consulta(contenedor)
   })


   let btnListados = crearNodo("li", "", "liListado", "listados", listaMenu);
   crearNodo("a", "Listado de Alumnos y Empresas", "", "", btnListados)

   btnListados.addEventListener('click', () => {
      limpiarContenido(contenedor)
      listado(contenedor)
   })




}
function crearMenuAlumnos() {

   let botonTitulacion = crearNodo("li", "", "liTutor", "anadirTitulacion", listaMenu);
   crearNodo("a", "Añadir Titulación", "", "", botonTitulacion)

   botonTitulacion.addEventListener('click', () => {
      limpiarContenido(contenedor);
      anadirTitulacion(contenedor, usuario);
   })

}
function crearMenuTutor() {
   let botonPeticiones = crearNodo("li", "", "liTutor", "peticionesEmpresas", listaMenu)
   crearNodo("a", "Alumnos de " + usuario.curso, "", "", botonPeticiones)

   botonPeticiones.addEventListener('click', () => {
      limpiarContenido(contenedor);
      alumnosPeticiones(contenedor, usuario)
   })

   let btnPeticion = crearNodo("li", "", "liTutor", "peticionesFCTS", listaMenu);
   crearNodo("a", "Peticiones FCTs", "", "", btnPeticion)

   btnPeticion.addEventListener('click', () => {
      limpiarContenido(contenedor);
      peticionesFCTS(contenedor, usuario)
   })

}

function crearMenuEmpresa() {

   let practicasFCTS = crearNodo("li", "", "liEmpresa", "practicasFCTs", listaMenu)
   crearNodo("a", "Seleccionar Alumnos para FCTS", "", "", practicasFCTS)
   practicasFCTS.addEventListener('click', () => {
      limpiarContenido(contenedor)
      alumnFCTS(contenedor, usuario);
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

      if (propiedad != 'idUsuario' && propiedad != 'usuario' && propiedad != 'cursos' && propiedad != 'iduser') {
         let label = crearLabel(propiedad, cadenaFormateada(propiedad), "lbAlumno", formulario)
         label.id = "lb" + propiedad

         let input = crearInput(propiedad, "inpFormAlum", "text", formulario)
         input.value = usuarioChanged[propiedad]
         input.id = "input" + propiedad
         input.disabled = true
      }
   }

   //Cargamos a mano si es para alumnos lo que se mostrará si es solo para ellos
   if (rolUser == 1) {
      crearNodo("label", "Cursos", "lbAlumno", "", formulario)
      let lista = crearNodo("ul", "", "listaCursos", "", formulario);
      //de cada curso que tiene el alumno se lo añadimos a la lista para eso lo partimos con split y lo transformamos en un array
      let arrayCursos = usuario.cursos.split(",")
      //Recorremos el array que acabamos de crear y le añadimos cada elemento a la lista
      for (let curso of arrayCursos) {
         crearNodo("li", curso, "", "", lista)
      }

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
         btnProcesar.addEventListener("click", async (event) => {

            //Para que pueda salir el dialogo de confirmación necesitamos hacer un stop propagation para que no se solape con el click del boton y eso haga que se cierre el dialogo
            event.stopPropagation();

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

            let confirmacion = await dialogoInformacion("Editar Usuario", "¿Estas seguro de que quieres cambiar tus datos?");
            if (confirmacion) {
               await editarUsuarioBolsa(usuarioBolsa, rolUser);
            }
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
         dialogoSimple("Se ha enviado un código a tu correo asociado. Introduce el código para cambiar la contraseña")
         //alert();
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

      promesaGeneral({ contrasena: contrasena, usuario: user, modo: 2 }, '../Controladores/cambioContrasena.php')
         .then((respuesta => {
            console.log(respuesta);
            mensajeDialogo(respuesta)
         }))
   })
}


