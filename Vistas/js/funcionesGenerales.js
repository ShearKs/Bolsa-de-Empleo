import { crearLabel, crearInput, crearNodo, crearNodoDebajo, limpiarContenido } from './utilsDom.js';

//Devuelve una cadena pasada de forma que la primera letra esté en mayuscula y las demás en minúsculas
export function cadenaFormateada(cadena) {


    let cadenaPasada = cadena.charAt(0).toUpperCase() +
        cadena.slice(1).toLowerCase();

    return cadenaPasada;

}

export function eliminarSiExiste(idElimnado) {

    let nodo = document.getElementById(idElimnado);
    if (nodo) {
        nodo.remove();
    }

}

//Le pasamos un objeto y una array con las propiedades a borrar y nos devuelve una copia del objeto con los elementos eliminados
export function eliminarDatosObjecto(objeto, arrayEliminados) {

    //Hacemos una copia del objeto pasado
    let copiaObjeto = { ...objeto }

    //Iteramos el objeto y nos encargamos de eliminar lo que no desemos
    arrayEliminados.forEach(propiedad => {
        delete copiaObjeto[propiedad]
    })

    //retornamos la copia del objeto
    return copiaObjeto;


}

export function cambioRuta(esIndex) {
    let ruta = '';
    if (esIndex) {
        ruta = '../'
    }
    return ruta;
}

//comprueba que todos los campos están rellenados
export function comprobarFormulario(inputs) {
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value.trim() === '') {
            alert("Por favor rellene todos los campos");
            return false; // Retorna false si algún campo está vacío
        }
    }
    return true;
}

export function eventoCheckBox(checkbox, elementoCreado, idNodo, nodo, nodoAnterior) {

    //Le añadimos un evento al checkbox que si lo pulsas te salga un text area con la información
    checkbox.addEventListener('click', () => {

        if (checkbox.checked) {

            nodo = crearNodoDebajo(elementoCreado, "", "", idNodo, nodoAnterior)
        } else {
            let exp = document.getElementById(idNodo);
            exp.remove();
        }

    })
}

export function devolverObjetaTabla(filasTabla,arrayObjetos){
    for (let i = 0; i < filasTabla.length; i++) {
        filasTabla[i].addEventListener('click', () => {
          
            //Recogemos de esa fila su td correspondiente para obtener los datos del alumno
            let objetoT = {}
            let tdFila = filasTabla[i].children

            for (let j = 0; j < tdFila.length; j++) {
                //Accedemos al classname de la celda
                let nombreClase = tdFila[j].className
                //Contenido que hay en ese td
                let contenido = tdFila[j].textContent
                //Creamos el objeto alumno que le añadimos al array de objetos
                objetoT[nombreClase] = contenido
            }
            //Nos devuelve el index si un alumno está contenido en el array de objetos
            let index = arrayObjetos.findIndex(item => {

                //Buscamos por todos los objetos si está el objeto alumno..
                return Object.keys(item).every(key => {
                    return item[key] === objetoT[key];
                })
            });

            if (index !== -1) {
                console.log("El objeto es igual al que contienes en el array")
                arrayObjetos.splice(index, 1)
                //Al estar deseleccionado le quitamos el color
                filasTabla[i].style.backgroundColor = ''

            } else {
                arrayObjetos.push(objetoT)
                filasTabla[i].style.backgroundColor = "#74bf87";
            }

            return arrayObjetos

        })
    }
}



/* ---------------   Dialogos para la aplicación    ----------------------   */


export function mensajeDialogo(respuesta) {

    let exito = false

    //let dialog = crearNodo("dialog", "", "dialogMensaje", "dialog", document.body)
    let dialog = crearNodoDebajo("dialog","","dialogMensaje","dialog",document.body)

    let tituloDia = crearNodo("h1", "", "", "dialogoTitulo", dialog)

    if (respuesta.hasOwnProperty('Exito')) {
        tituloDia.textContent = "Acción Realizada"
        dialog.innerHTML += "<p>" + respuesta.Exito + "</p>"
        exito = true
    } else {

        tituloDia.textContent = "Error"
        dialog.innerHTML += "<p>" + respuesta.Error + "</p>"

        dialog.style.backgroundColor = "#ffe6e6";
        dialog.style.border = "5px solid #e60000";
        //Lo he tenido que hacer así porque con el tituloDia.style ...  no me funcionaba...
        document.getElementById("dialogoTitulo").style.color = "#e60000"
    }

    let btnAceptar = crearNodo("button", "Aceptar", "botonMenDialogo", "botonMenDialogo", dialog)
    if (!exito) { btnAceptar.style.backgroundColor = "#e60000"; }

    btnAceptar.addEventListener('click', () => {

        dialog.close()
        dialog.remove()

        document.querySelectorAll("body > *").forEach(element => {
            element.classList.remove("blur");
        });

    })
    dialog.show()
    quitarBlurClicar(dialog);
    quitarBlurEscape();
    activarBlur();

    return exito
}

//He tenido que hacer dialogo Información como promesa para que clique es en el boton me devuelva una cosa u otra
export function dialogoInformacion(titulo, mensaje) {
    return new Promise((resolve, reject) => {
        let dialogo = crearNodoDebajo("dialog", "", "dialogInfo", "dialog", document.body);

        let tituloDia = crearNodo("h1", titulo, "", "", dialogo);
        let p = crearNodo("p", mensaje, "", "", dialogo);
        let conteBotones = crearNodo("div", "", "botonesDia", "", dialogo);

        let botonOk = crearNodo("button", "Ok", "", "", conteBotones);
        botonOk.addEventListener('click', () => {
            dialogo.close();
            dialogo.remove();
            quitarBlur();
            resolve(true);
        });

        let botonCancelar = crearNodo("button", "Cancelar", "", "", conteBotones);
        botonCancelar.addEventListener('click', () => {
            dialogo.close();
            dialogo.remove();
            quitarBlur();
            resolve(false);
        });


        quitarBlurEscape();
        activarBlur();
        quitarBlurClicar(dialogo)
        dialogo.show();
    });
}
//Dialogo siemple que unicamente comunica un mensaje
export function dialogoSimple(mensaje) {

    let dialogo = crearNodoDebajo("dialog", "", "dialogoInformarcion", "", document.body)
    dialogo.innerHTML = "<h1>Información</h1>";
    dialogo.innerHTML += "<p>" + mensaje + "</p>"

    let botonOk = crearNodo("button", "OK", "btnOk", "", dialogo)
    botonOk.addEventListener('click', () => {
        dialogo.close();
        dialogo.remove();
        quitarBlur();
    })

    activarBlur();
    quitarBlurEscape();
    quitarBlurClicar(dialogo)
    dialogo.show();

}

/* -----------    Funciones para los dialogos  ------------------  */
function activarBlur() {
    //Activamos el blur a toda la página menos al diálogo 
    //buscamos todos los que no son diálogos y les añadimos el blur
    document.querySelectorAll("body > *:not(dialog)").forEach(element => {
        //El blur está establecido en nuestro CSS
        element.classList.add("blur");
    });
}

function quitarBlur() {

    document.querySelectorAll("body > *").forEach(element => {
        element.classList.remove("blur");
    });
}

function quitarBlurEscape() {
    // Cerrar el diálogo cuando se presiona una tecla de escape (con keydown nos referimos a clicamos en cualquier tecla)
    window.addEventListener('keydown', (event) => {
        //Si hacemos escape cerramos el diálogo y eliminamos el blur
        if (event.key === 'Escape') {
            dialog.close();
            dialog.remove();
            // Quitamos la clase de desenfoque a todos los elementos que no son el diálogo
            document.querySelectorAll("body > *:not(dialog)").forEach(element => {
                element.classList.remove("blur");
            });
        }
    });
}

//Quitamos el blur cuando pulsemos en algun otro sitio
function quitarBlurClicar(dialog) {

    //Evento click a todo el documento
    document.addEventListener('click', (event) => {
        //Hacemos que cuando 
        if (!dialog.contains(event.target)) {
            dialog.close();
            dialog.remove();
            // Quitamos la clase de desenfoque a todos los elementos que no son el diálogo
            document.querySelectorAll("body > *:not(dialog)").forEach(element => {
                element.classList.remove("blur");
            });
        }
    });
}




