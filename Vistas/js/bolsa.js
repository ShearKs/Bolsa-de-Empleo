import { obtenerAlumnoBolsa, editarAlumnoBolsa, crearCursos } from './funcionesFetch.js';
import { crearLabel, crearInput, crearNodo, crearNodoDebajo, limpiarContenido,crearBotonImg } from './utilsDom.js';
import { cadenaFormateada } from './funcionesGenerales.js';

const datosAlumnos = document.getElementById('datosAlumno');
const botonDispon = document.getElementById('disponibilidad');

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

botonDispon.addEventListener('click', () => {
   limpiarContenido(contenedor);
})

async function obtenerAlumno() {
   try {
      alumno = await obtenerAlumnoBolsa();
      console.log(alumno)
   } catch (error) {
      console.error("Error al obtener alumno: " + error);
   }
}


async function crearFormularioAlumno(alumno) {

   let divContenedor = crearNodo("div", "", "contenedor", "", contenedor)
   let formulario = crearNodo("form", "", "formularioAlumnoBolsa", "", divContenedor);

   let modoEditar = false;

   for (let propiedad in alumno) {
      if (propiedad != "dni" && propiedad != "idCurso") {

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
   await crearCursos(alumno.curso, lbCurso,true);

   let select = document.getElementById("selectCursos");
   select.disabled = true

   // Creamos el botón de editar
   let botonEditarP = crearBotonImg(divContenedor,"divBoton","img","../Vistas/img/editar.png","antiquewhite");

   botonEditarP.addEventListener('click', () => {

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
         let btnProcesar = crearNodo("button", "Edita tu información", "botonProcesa", "", divContenedor);
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















