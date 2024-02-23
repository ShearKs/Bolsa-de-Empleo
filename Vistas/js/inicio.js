import { crearLabel, crearInput, crearNodo, crearNodoDebajo, limpiarContenido, eliminarExistente } from './utilsDom.js';
import { inicioSesion, crearUsuario, alumnoDevuelto, crearCursos, devuelveCamposEmpresa,insertaEmpresa } from './funcionesFetch.js';
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
//Creamos un div que será el que contendrá el formulario
let divFormulario = document.getElementById("divFormulario");


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

        if (inputUsuario.value == "" || inputContra.value == "") {

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
        if (inputCif.value == "") {
            parrafoError.textContent = "Debes de introducir algún campo..";
            return;
        }
        
        console.log(select.value)
        // Verificar la opción seleccionada en ese momento
        if (select.value === 'alumno') {
            // Función Fetch que nos devuelve el alumno titulado en la base de datos
            alumnoDevuelto(inputCif.value, crearFormularioAlta, parrafoError);
        } else {

            devuelveCamposEmpresa(creaFormularioEmpresa, inputCif.value)
        }
    });

    select.addEventListener('change',(event)=>{
        event.preventDefault();

        if(select.value === 'empresa'){
            labelAlta.textContent = "Introduce tu cif para poder iniciarte en la bolsa";
        }else{
            labelAlta.textContent = "Introduce tu dni para darte de alta en la bolsa"; 
        }
    })

}

function creaFormularioEmpresa(camposEmpresa, cif) {

    inicio.style.display = 'none'

    crearNodo("h2", "Formulario de Empresas", "formAlum", "", divFormulario)

    //Creamos el formulario de registro para empresas
    let formAltaEmpresa = crearNodo("form", "", "formAltaAlum", "", divFormulario)

    //camposEmpresa es un array donde tendremos todos los nombre de las columnas de empresa
    //Introducimos todos los campos que serán todas las columnas en la base de datos
    camposEmpresa.forEach(campoEmpresa => {
        console.log(campoEmpresa)
        if (campoEmpresa != 'idUsuario') {
            let caja = crearNodo("div", "", "caja", "caja" + campoEmpresa, formAltaEmpresa);
            let campoFormat = funciones.cadenaFormateada(campoEmpresa);
            crearLabel(campoEmpresa, campoFormat, "lbUsuario", caja);
            let inputEmp = crearInput(campoEmpresa, "input", "text", caja);
            inputEmp.id = "inputEmp" + campoEmpresa;
            if (inputEmp.name == 'cif') {

                inputEmp.value = cif
                inputEmp.setAttribute("readonly", "true")
                inputEmp.style.backgroundColor = "#bfbfbf"
            }
        }
    });

    //Introducimos el label y el campo de usuario
    let cajaCif = document.getElementById("cajacif")
    let divUsuario = crearNodoDebajo("div", "", "caja", "", cajaCif)
    crearLabel("usuario", "Usuario", "lbUsuario", divUsuario)
    crearInput("usuario", "input", "text", divUsuario)

    let botonAlta = crearNodo("button", "Registrate en la bolsa de Empleo", "formAlta", "formAlta", formAltaEmpresa);
    botonAlta.addEventListener('click', (event) => {
        event.preventDefault()

        let inputsForm = document.getElementsByClassName("input")
        if (funciones.comprobarFormulario(inputsForm)) {
            let formData = new FormData(formAltaEmpresa);
            let empresa = recogeDatosEmpresa(formData)
            console.log(empresa)
            insertaEmpresa(empresa)
        }
    })

    let botonVolver = crearNodo("button", "Volver", "formAlta", "formAlta", formAltaEmpresa);
    botonVolver.addEventListener('click', () => {
        tituloLogin.textContent = "Inicia Sesión";
        limpiarContenido(divInicio)
        crearInicio();
        limpiarContenido(divFormulario)
        inicio.style.display = 'flex'

    })
}

//Función que recoge todo lo que la empresa ha escrito en el formulario
function recogeDatosEmpresa(formData) {

    let empresa = {}

    //Recoremos 
    formData.forEach((valor, clave) => {
        empresa[clave] = valor
    })

    return empresa;
}


function crearFormularioAlta(datosAlumno) {

    inicio.style.display = 'none';

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

        //No creamos el input de curso ya que vamos a introducir un desplegable y tampoco titulado ya que no nos interesa cambiar esa información ya que un alumno siempre va a estar titulado
        if (alumn !== 'curso' && alumn !== 'titulado') {
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
    let cbxViajar = crearInput("posV", "check", "checkbox", divViaje);

    let divRes = crearNodo("div", "", "cajaViaje", "", divBolsa);
    crearLabel("res", "Residencia en otra población: ", "lbUsuario", divRes);
    let checkBoxRes = crearInput("res", "check", "checkbox", divRes);

    let textExp = { value: "" };
    funciones.eventoCheckBox(checkBoxExp, "textarea", "txtExpLaboral", textExp, campoExp);
    let textRes = { value: "" };
    funciones.eventoCheckBox(checkBoxRes, "input", "txtResidencia", textRes, divRes);

    let botonAlta = crearNodo("button", "Registrate en la bolsa de Empleo", "btnResgistroAlumn", "formAlta", formularioAlta);
    botonAlta.addEventListener('click', (event) => {
        event.preventDefault()
        let alumnos = alumnoFormularioAlta(formularioAlta, checkBoxExp, checkBoxRes,cbxViajar)
        console.log(alumnos)
        let inputsComprueba = document.getElementsByClassName("inputAlta")
        //console.log(inputsComprueba)
        if (funciones.comprobarFormulario(inputsComprueba)) {
            crearUsuario(alumnos);
        }
    })
    let botonVolver = crearNodo("button", "Volver", "formAlta", "btnVolver", formularioAlta);
    botonVolver.addEventListener('click', () => {
        tituloLogin.textContent = "Inicia Sesión";
        limpiarContenido(divInicio)
        crearInicio();
        limpiarContenido(divFormulario)
        inicio.style.display = 'flex'

    })
}
//Devuelve un objeto alumno con los datos recogidos del formulario de 
function alumnoFormularioAlta(formularioAlta, cbxExperiencia, checkBoxRes,cbxViajar) {
    let datosAlumno = {};
    let inputs = formularioAlta.querySelectorAll('input');

    inputs.forEach(input => {
        if (input.type != 'checkbox') {
            datosAlumno[input.name] = input.value;
        }
    });

    //Recogemos el valor del textarea
    let textAreaExp= document.getElementById('txtExpLaboral');
    // Si el checkbox de experiencia laboral está marcado, añadir el campo correspondiente
    if (cbxExperiencia.checked) {
        // Acceder al valor del textarea a través de textExp.value
        datosAlumno['experienciaLaboral'] = textAreaExp.value
    } else {
        datosAlumno['experienciaLaboral'] = "";
    }

    let textAreaRes = document.getElementById('txtResidencia');

    if (checkBoxRes.checked){
        datosAlumno['residencia'] = textAreaRes.value
    }else{
        datosAlumno['residencia'] = ""
    }
    datosAlumno['posViajar'] = cbxViajar.checked

    let cursoSeleccionado = formularioAlta.querySelector('select').value;
    //Le añadimos el curso seleccionado al objeto
    datosAlumno['curso'] = cursoSeleccionado;

    return datosAlumno;
}






