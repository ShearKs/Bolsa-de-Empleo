import { obtenerAlumnoBolsa, editarAlumnoBolsa, crearCursos, generarCodigoTemporal, cambioContrasena, cambioContraseñaProcesa } from './funcionesFetch.js';
import { crearLabel, crearInput, crearNodo, crearNodoDebajo, limpiarContenido, crearBotonImg } from './utilsDom.js';
import { cadenaFormateada } from './funcionesGenerales.js';

const datosAlumnos = document.getElementById('datosAlumno');
const btnCambioContrasena = document.getElementById('cambioContrasena');
const botonTitulacion = document.getElementById('anadirTitulacion');
const botonSalir = document.getElementById('salir');

// Div sobre el que vamos a mostrar los contenidos según el botón que le indique el usuario
const contenedor = document.getElementById('principal');

// Alumno en bolsa
let alumno;

window.onload = async (event) => {
   await obtenerAlumno();
   crearFormularioAlumno(alumno)
};

datosAlumnos.addEventListener('click', () => {
   limpiarContenido(contenedor);
   console.log("Dni del alumno en Bolsa: " + alumno.dni)
   crearFormularioAlumno(alumno)
})

btnCambioContrasena.addEventListener('click', () => {
   let preguntaCambio = window.confirm("¿Estás seguro de que quieres cambiar la contraseña?");

   if (preguntaCambio) {
      limpiarContenido(contenedor)
      cambioContrasenaCli()
   }

})

botonTitulacion.addEventListener('click',()=>{
   limpiarContenido(contenedor);

})

botonSalir.addEventListener('click', () => {

   //Eliminar la sesión antes

   location.href="../index.html";


})

botonTitulacion.addEventListener('click', () => {
   limpiarContenido(contenedor);
   anadirTitulacion();
})

async function obtenerAlumno() {
   try {
      alumno = await obtenerAlumnoBolsa();
      console.log(alumno)
   } catch (error) {
      console.error("Error al obtener alumno: " + error);
   }
}

function anadirTitulacion(){
   console.log("Titulación")
}

function cambioContrasenaCli() {


   generarCodigoTemporal(alumno.email)
      .then(data => {
         // Después de la generación del código, creamos el DOM
         let containerCon = crearNodo("div", "", "contenedorContra", "", contenedor);
         crearLabel("cambioPass", "Introduce la clave que te hemos mandado al correo para cambiar la contraseña", "lbCamPass", containerCon);
         let inputPass = crearInput("cambioPass", "inputPass", "text", containerCon);
         let botonVerifica = crearNodo("button", "Verifica el código", "btnChange", "", containerCon);
         botonVerifica.addEventListener('click', () => {
            let codigoIntro = inputPass.value;
            let correo = alumno.email;
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
      let usuario = alumno.usuario;
      let contrasena = nuevaClave.value
      let solicitud = {
         contrasena: contrasena,
         usuario: usuario,
         modo: 2
      }
      cambioContraseñaProcesa(solicitud)

   })

}





async function crearFormularioAlumno(alumno) {

   let divContenedor = crearNodo("div", "", "contenedor", "", contenedor)

   let contenido = crearNodo("div", "", "formEditarAlu", "", divContenedor)
   let formulario = crearNodo("form", "", "formularioAlumnoBolsa", "", contenido);

   let modoEditar = false;

   for (let propiedad in alumno) {
      if (propiedad != "dni" && propiedad != "idCurso" && propiedad != "usuario") {

         let label = crearLabel(propiedad, cadenaFormateada(propiedad), "lbAlumno", formulario)
         label.id = "lb" + propiedad
         if (propiedad != "curso") {
            let input = crearInput(propiedad, "inpFormAlum", "text", formulario)
            input.value = alumno[propiedad]
            input.disabled = true
         }

      }
   }

   let lbCurso = document.getElementById('lbcurso');
   console.log("idCurso", alumno.idCurso)
   await crearCursos(alumno.curso, lbCurso, true);

   let select = document.getElementById("selectCursos");
   select.disabled = true

   let botonOcultar = crearNodo("button", "Oculta el Contenido", "botonProcesa", "", divContenedor)
   botonOcultar.addEventListener('click', () => {
      divContenedor.remove()
   })

   // Creamos el botón de editar
   let botonEditarP = crearBotonImg(contenido, "divBoton", "img", "../Vistas/img/editar.png", "#b3e6ff");

   botonEditarP.addEventListener('click', () => {
      //botonOcultar.remove();

      if (!modoEditar) {

         modoEditar = true;
         // Inputs del formulario
         let inputs = formulario.getElementsByTagName("input");
         console.log(inputs.length)
         for (let i = 0; i < inputs.length; i++) {
            inputs[i].disabled = false
         }
         select.disabled = false

         // Alumno que vamos a recoger
         let alumnoBolsa = {}

         // Creamos un botón para actualizar los datos del alumno
         //let btnProcesar = crearNodo("button", "Edita tu información", "botonProcesa", "", divContenedor);
         let btnProcesar = crearNodoDebajo("button", "Edita tu información", "botonProcesa", "", botonOcultar);
         btnProcesar.addEventListener("click", async () => {


            // Recogemos todos los campos del formulario
            let inputs = formulario.querySelectorAll('input');
            inputs.forEach(input => {
               alumnoBolsa[input.name] = input.value;
            });
            alumnoBolsa['idCurso'] = select.value

            console.log(alumnoBolsa)
            await editarAlumnoBolsa(alumnoBolsa);
            await obtenerAlumno();
         })
      }
   })

}


