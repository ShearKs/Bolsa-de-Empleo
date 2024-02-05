import { crearLabel, crearInput, crearNodo, crearNodoDebajo, limpiarContenido,eliminarExistente } from './utilsDom.js';
import { inicioSesion, crearUsuario, alumnoDevuelto, crearCursos } from './funcionesFetch.js';
import * as funciones from './funcionesGenerales.js';

//Div donde se encuentra todo
const inicio = document.getElementById('contenedorLogin');

//Botones de inicio de sesión que hace dinámico el login y el registrarse
const botonInicio = document.getElementById('btnInicio')
const botonRegistro = document.getElementById('btnRegistro');

const formulario = document.getElementById('formularioLogin');
const botonLogin = document.getElementById('btnInicioSesion');

const divInicio = document.getElementById('contenidoLogin');

const tituloLogin = document.getElementById('tituloLogin');


window.onload = (event) => {
    crearInicio();
    // Agrega un nuevo estado al historial
    history.pushState(null, null, location.href);

    // Escucha el evento popstate para evitar que el usuario retroceda
    window.addEventListener('popstate', function (event) {
        // Agrega otro estado al historial para que el botón "Atrás" no haga nada
        history.pushState(null, null, location.href);
    });
};

botonInicio.addEventListener('click', () => {
    tituloLogin.textContent = "Inicia Sesión";
    limpiarContenido(divInicio)
    crearInicio();
});

//Al clicar el botón de registro cambia por completo de ser un formulario para iniciar sesión a uno para registrarse en la bolsa de empleo
botonRegistro.addEventListener('click', (event) => {

    event.preventDefault()

    tituloLogin.textContent = "Darse de Alta en la Bolsa";
    limpiarContenido(divInicio)
    crearAlta()
})

function cambiarEstadoBotones(activadoInicio) {
    botonInicio.style.backgroundColor = activadoInicio ? "#056687" : "#b9edfe";
    botonInicio.style.color = activadoInicio ? "white" : "#056687";
    botonRegistro.style.backgroundColor = activadoInicio ? "#b9edfe" : "#056687";
    botonRegistro.style.color = activadoInicio ? "#056687" : "white";
}

function crearInicio() {

    cambiarEstadoBotones(true);

    eliminarExistente("selectRegistro")

    crearLabel("usuario", "Usuario", "lbUsuario", divInicio)
    let inputUsuario = crearInput("usuario", "inputUser", "text", divInicio)

    crearLabel("contrasena", "Contraseña", "", divInicio)
    let inputContra = crearInput("contrasena", "inputContra", "password", divInicio)

    //Insertamos el mensaje de Error por si hay error al logearnos
    let parrafoError = crearNodo("p", "", "mensajeError", "mensajeError", divInicio)

    let botonInicioSesion = crearNodo("button", "Inicia Sesión", "btnInicioSesion", "", divInicio)
    botonInicioSesion.addEventListener('click', (event) => {
        event.preventDefault();

        if(inputUsuario.value == "" || inputContra.value == ""){

            parrafoError.textContent = "Tienes que introducir tanto usuario como contraseña"
            return;
        }

        
        const formularioLogin = new FormData(formulario);

        let usuarioCampo = formularioLogin.get('usuario')
        let contrasenaCampo = formularioLogin.get('contrasena')


        let usuario = {
            usuario: usuarioCampo,
            contrasena: contrasenaCampo
        }

        inicioSesion(usuario, parrafoError)
    })
}

function crearAlta() {

    cambiarEstadoBotones(false);

    eliminarExistente("selectRegistro")

    let select = crearNodoDebajo("select", "", "selectRegistro", "selectRegistro", tituloLogin)
    let optionAlumn = crearNodo("option", "Alumnos", "optionRegistro", "", select)
    optionAlumn.value = "alumno"
    let optionEmpresa = crearNodo("option", "Empresas", "optionRegistro", "", select)
    optionEmpresa.value = "empresa"


    let labelAlta = crearLabel("cif", "Introduce tu dni para darte de alta en la bolsa", "lbUsuario", divInicio)
    let inputCif = crearInput("cif", "inputCif", "text", divInicio)
    inputCif.id = "inputCif"

    let parrafoError = crearNodo("p", "", "mensajeError", "mensajeError", divInicio)

    let botonAlta = crearNodo("button", "Date de Alta en la bolsa de Empleo", "btnInicioSesion", "", divInicio)
    // Agregar el evento click fuera del evento change
    botonAlta.addEventListener('click', (event) => {
        event.preventDefault();
        if(inputCif.value == ""){
            parrafoError.textContent = "Debes de introducir algún campo..";
            //crearNodo("p", "Debes de introducir algún campo..", "mensajeError", "mensajeError", divInicio)
            return;
        }
        labelAlta.textContent = "Introduce tu cif para poder iniciarte en la bolsa";
        console.log(select.value)
        // Verificar la opción seleccionada en ese momento
        if (select.value === 'alumno') {
            // Función Fetch que nos devuelve el alumno titulado en la base de datos
            alumnoDevuelto(inputCif.value, crearFormularioAlta,parrafoError);
        } else {
            console.log("pa ti mi cola jejeje");
        }
    });

}



function crearFormularioAlta(datosAlumno) {

    inicio.style.display = 'none';

    //Creamos un div que será el que contendrá el formulario
    let divFormulario = document.getElementById("divFormulario");

    crearNodo("h2", "Formulario de Alumno", "formAlum", "", divFormulario)

    //Creamos un formulario de alta
    let formularioAlta = crearNodo("form", "", "formAltaAlum", "", divFormulario);

    let campoUser = crearNodo("div", "", "caja", "", formularioAlta)
    crearLabel("usuario", "Usuario ", "lbUsuario", campoUser)
    let inputUser = crearInput("usuario", "input", "text", campoUser)
    inputUser.className = "inputAlta"
    inputUser.setAttribute("required", "true")

    //INSERTAMOS TODO LO QUE TENEMOS EN EL OBJETO ALUMNOS
    for (let alumn in datosAlumno) {

        //No creamos el input de curso ya que vamos a introducir un desplegable
        if (alumn !== 'curso') {
            let divCampo = crearNodo("div", "", "caja", "", formularioAlta)
            let contenido = funciones.cadenaFormateada(alumn)
            crearLabel(alumn, contenido, "lbUsuario", divCampo)
            let input = crearInput(alumn, "input", "text", divCampo)
            if (alumn == 'dni') {
                input.disabled = true
            }
            input.value = datosAlumno[alumn]
            input.className = "inputAlta"
            input.setAttribute("required", "true")
        }
    }
    let divBolsa = crearNodo("div", "", "divBolsa", "", formularioAlta)

    //RESTO DE COSAS QUE NO ESTÁN EN AlumnoIES

    let divCampo = crearNodo("div", "", "caja", "", divBolsa)
    let labelCiclo = crearLabel("curso", "Ciclo", "lbUsuario", divCampo);

    //Creamos el select option y obtenemos todos los cursos que hay en la base de datos
    crearCursos(datosAlumno.curso, labelCiclo, false, 1);

    let campoExp = crearNodo("div", "", "cajaViaje", "", divBolsa);
    let checkExperiencia = crearLabel("experien", "Experiencia Laboral", "lbUsuario", campoExp);
    let checkBoxExp = crearInput("expLabo", "", "checkbox", campoExp);

    let divViaje = crearNodo("div", "", "cajaViaje", "", divBolsa);
    crearLabel("posV", "Posibilidad de Viajar: ", "lbUsuario", divViaje);
    crearInput("posV", "check", "checkbox", divViaje);

    let divRes = crearNodo("div", "", "cajaViaje", "", divBolsa);
    crearLabel("res", "Residencia en otra población: ", "lbUsuario", divRes);
    let checkBoxRes = crearInput("res", "check", "checkbox", divRes);

    let textExp = { value: "" };
    funciones.eventoCheckBox(checkBoxExp, "textarea", "txtExpLaboral", textExp, campoExp);
    let textRes = { value: "" };
    funciones.eventoCheckBox(checkBoxRes, "input", "id", textRes, divRes);

    let botonAlta = crearNodo("button", "Registrate en la bolsa de Empleo", "formAlta", "formAlta", formularioAlta);
    botonAlta.addEventListener('click', (event) => {
        event.preventDefault()
        let alumnos = alumnoFormularioAlta(formularioAlta, checkBoxExp, textExp)
        console.log(alumnos)
        let inputsComprueba = document.getElementsByClassName("inputAlta")
        console.log(inputsComprueba)
        if (funciones.comprobarFormulario(inputsComprueba)) {
            crearUsuario(alumnos);
        }


    })
    let botonVolver = crearNodo("button", "Volver", "formAlta", "formAlta", formularioAlta);
    botonVolver.addEventListener('click', () => {
        tituloLogin.textContent = "Inicia Sesión";
        limpiarContenido(divInicio)
        crearInicio();
        limpiarContenido(divFormulario)
        inicio.style.display = 'flex'

    })
}
//Devuelve un objeto alumno con los datos recogidos del formulario de 
function alumnoFormularioAlta(formularioAlta, cbxExperiencia) {
    let datosAlumno = {};
    let inputs = formularioAlta.querySelectorAll('input');

    inputs.forEach(input => {
        if (input.type != 'checkbox') {
            datosAlumno[input.name] = input.value;
        }
    });

    //Recogemos el valor del textarea
    let textArea = document.getElementById('txtExpLaboral');
    // Si el checkbox de experiencia laboral está marcado, añadir el campo correspondiente
    if (cbxExperiencia.checked) {
        // Acceder al valor del textarea a través de textExp.value
        datosAlumno['experienciaLaboral'] = textArea.value
    } else {
        datosAlumno['experienciaLaboral'] = "";
    }

    let cursoSeleccionado = formularioAlta.querySelector('select').value;
    //Le añadimos el curso seleccionado al objeto
    datosAlumno['curso'] = cursoSeleccionado;

    // Luego, llama a la función crearUsuario con los datosAlumno
    return datosAlumno;
}






