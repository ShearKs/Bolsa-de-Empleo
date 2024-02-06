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

                //Iniciamos una sesión en javascript con el rol del usuario
                sessionStorage.setItem('rol', data.Exito)

                return;
            } else {
                console.log("Error :", data)
                parrafoError.textContent = data.Error
                return
            }


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
                alert(data.Exito)
            } else {
                alert(data.Error)
            }
        })
        .catch(error => {
            console.error("Error en la solicitud" + error)
        })
}

export function obtenerUsuario(rol) {
    return new Promise((resolve, reject) => {
        fetch(`../Controladores/devuelveUsuarioB.php?rol=${rol}`)
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

export function generarCodigoTemporal(correo) {
    return new Promise((resolve, reject) => {
        fetch(`../Controladores/generaCodigoSesion.php?correo=${correo}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('La solicitud no ha sido correcta');
                }
                return response.json();
            })
            .then(data => {
                if (data.hasOwnProperty('Exito')) {
                    resolve("Se ha enviado un código a tu correo. Introduce el código para cambiar la contraseña");
                } else {
                    reject(new Error("La solicitud fue exitosa, pero no se recibió un resultado esperado."));
                }
            })
            .catch(error => {
                reject(new Error("Error en la solicitud: " + error));
            });
    });
}

export function cambioContrasena(solicitud) {
    return new Promise((resolve, reject) => {


        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(solicitud)
        }

        fetch('../Controladores/cambioContrasena.php', requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('La solicitud no fue exitosa');
                }
                return response.json();
            })
            .then(respuesta => {
                console.log(respuesta);
                if (respuesta.hasOwnProperty('Exito')) {
                    resolve(); // Resolvemos la promesa
                } else {
                    reject(respuesta.Error); // Rechazamos la promesa con el mensaje de error
                }
            })
            .catch(error => {
                reject("Error en la solicitud: " + error); // Rechazamos la promesa con el mensaje de error
            });
    });
}

export function cambioContraseñaProcesa(solicitud) {

    // Creamos un objeto con la solictud del usuario

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(solicitud)
    }

    fetch('../Controladores/cambioContrasena.php', requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('La solicitud no fue exitosa');
            }
            return response.json()
        })
        .then(response => {
            if (response.hasOwnProperty('Exito')) {
                alert(response.Exito);
            } else {
                alert("Ha surgido algún problema al cambiar la contraseña, Error: ", response.Error)
            }
        })
        .catch(error => {
            console.error("Error en al solicitud: " + error)
        })

}

export function editarUsuarioBolsa(usuario, rol) {
    const data = {
        usuario: usuario,
        rol: rol
    };

    console.log(data)

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return new Promise((resolve, reject) => {
        fetch('../Controladores/editaUsuarioB.php', requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('La solicitud no ha sido correcta')
                }
                return response.json()
            })
            .then(respuesta => {
                console.log(respuesta)
                if (respuesta.hasOwnProperty('Exito')) {
                    resolve(respuesta.Exito);
                } else {
                    reject('La respuesta del servidor no tiene la estructura esperada');
                }
            })
            .catch(error => {
                console.error("Error en la solicitud: " + error)
                reject(error);
            })
    });
}

//Función que se encarga de ver todos los cursos que hay en la base de datos y mostrarlo con Dom
export async function crearCursos(curso, div, esIndex, modo) {
    try {

        let ruta = cambioRuta(esIndex)

        const response = await fetch(ruta + `Controladores/devuelveCursos.php?modo=${modo}`);
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

export function insertarTitulo(solicitudCurso) {

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(solicitudCurso)
    }

    fetch('../Controladores/addTitulo.php', requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('La solicitud no ha sido correcta')
            }
            return response.json()
        })
        .then(data => {
            console.log(data)
            if (data.hasOwnProperty('Exito')) {
                alert(data.Exito)
            }
        })
        .catch(error => {
            console.error("Error en la solicitud: " + error)
        })
}

//Función Fetch que nos devuelve el alumno titulado en la base de datos
export function alumnoDevuelto(cif, crearFormularioAlta, parrafoError) {
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
            //if (document.getElementById('mensajeError')) document.getElementById('mensajeError').remove()

            if (data.hasOwnProperty('Error')) {
                parrafoError.textContent = "Error: " + data.Error

                return
            }
            crearFormularioAlta(data)

        })
        .catch(error => {
            console.error("Error en la solicitud: " + error)
        })
}

export function devuelveCamposEmpresa(creaFormularioEmpresa, cif) {
    fetch('Controladores/devuelveCamposEmpresa.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('La solicitud no ha sido correcta')
            }
            return response.json()
        })
        .then(data => {


            if (data.hasOwnProperty('Error')) {
                parrafoError.textContent = "Error: " + data.Error
                return
            }
            creaFormularioEmpresa(data, cif)

        })
        .catch(error => {
            console.error("Error en la solicitud: " + error)
        })
}

export function insertaEmpresa(empresa) {

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empresa)
    }
    fetch('./Controladores/insertaEmpresa.php', requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('La solicitud no se ha enviado correctamente')
            }
            return response.json()
        })
        .then(mensaje => {
            console.log(mensaje)
            if (mensaje.hasOwnProperty('Exito')) {
                alert(mensaje.Exito)
            } else {
                console.log(mensaje.Error);
            }

        })
        .catch(error => {
            console.error("Error en la solicitud: ", error)
        })
}