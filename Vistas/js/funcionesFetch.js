import *  as nodos from './utilsDom.js';
import { cambioRuta } from './funcionesGenerales.js';

//Función Fetch que se encarga de realizar el autenticado
export function inicioSesion(usuario, parrafoError) {

    console.log('Usuario: ' + usuario)

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain; charset=ISO-8859-1' },
        body: JSON.stringify(usuario)
    }

    //Realizamos la solicitud al php
    fetch('Controladores/inicioSesion.php', requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('La solicitud no ha sido correcta');
            }

            return response.json()
        })
        .then(data => {
            //console.log('Devolución desde php',data)
            if (data.hasOwnProperty('Exito')) {


                window.location.href = './Vistas/main.html';
            }
            console.log("Error :", data)
            parrafoError.textContent = data.Error
        })
        .catch(error => {
            console.error("Error en la solicitud: " + error)
        })
}

//Función Fetch que se encarga de actualizar los datos de un alumno y de crear un nuevo usuario
export function crearUsuario(datosAlumno) {

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosAlumno)
    }

    //Conectamos con el php
    fetch('Controladores/insertarUsuario.php', requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('La solicitud no ha sido correcta')
            }
            return response.json()
        })
        .then(data => {
            console.log('Lo que devuelve el php:', data)
            if (data.hasOwnProperty('Exito')) {
                alert("Se ha creado el usuario satisfactoriamente")
            }
        })
        .catch(error => {
            console.error("Error en la solicitud" + error)
        })
}

export function obtenerAlumnoBolsa($dni) {
    return new Promise((resolve, reject) => {
        fetch('../Controladores/devuelveAlumnoB.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('La solicitud no ha sido correcta');
                }
                return response.json();
            })
            .then(alumno => {

                resolve(alumno);
            })
            .catch(error => {
                console.error("Error en la solicitud" + error);
                reject(error);
            });
    });
}

export function editarAlumnoBolsa(alumnoBolsa) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain; charset=ISO-8859-1' },
        body: JSON.stringify(alumnoBolsa)
    }

    return new Promise((resolve, reject) => {
        fetch('../Controladores/editaAlumnoB.php', requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('La solicitud no ha sido correcta')
                }
                return response.json()
            })
            .then(respuesta => {
                console.log(respuesta);
                resolve();  
            })
            .catch(error => {
                console.error("Error en la solicitud: " + error)
                reject(error); 
            })
    });
}

//Función que se encarga de ver todos los cursos que hay en la base de datos y mostrarlo con Dom
export async function crearCursos(curso, div, esIndex) {
    try {

        let ruta = cambioRuta(esIndex)

        const response = await fetch(ruta + 'Controladores/devuelveCursos.php');
        if (!response.ok) {
            throw new Error('La solicitud no ha sido correcta');
        }

        const data = await response.json();
        console.log('Cursos: ', data);

        // Crear el elemento select
        let selectOption = nodos.crearNodoDebajo("select", "", "selectoption", "selectCursos", div);

        // Iterar sobre los cursos y agregar opciones al select
        for (let cur in data) {
            let nombreCurso = data[cur].nombre;
            let option = nodos.crearNodo("option", nombreCurso, "", "", selectOption);
            option.value = data[cur].id;
            if (nombreCurso == curso) {
                option.selected = true;
            }
        }
    } catch (error) {
        console.error("Error en la solicitud:" + error);
    }
}


//Función Fetch que nos devuelve el alumno titulado en la base de datos
export function alumnoDevuelto(cif, crearFormularioAlta, divInicio) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cif: cif })  // Enviar como objeto JSON
    }

    fetch('Controladores/devuelveTitulado.php', requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('La solicitud no ha sido correcta')
            }

            return response.json()
        })
        .then(data => {
            console.log(data)
            if (document.getElementById('mensajeError')) document.getElementById('mensajeError').remove()

            if (data.hasOwnProperty('Error')) {
                nodos.crearNodo("p", "Error: " + data.Error, "mensajeError", "mensajeError", divInicio)
                return
            }
            crearFormularioAlta(data)

        })
        .catch(error => {
            console.error("Error en la solicitud: " + error)
        })
}