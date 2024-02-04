
//Funciones encargas de modificar el dom

export function crearLabel(name, contenido, clase, padre) {

    let label = document.createElement("label")
    label.textContent = contenido
    label.className = clase
    label.setAttribute("for", name)
    padre.appendChild(label)

    return label;
}

export function crearInput(name, clase, tipo, padre) {
    let input = document.createElement("input")
    input.setAttribute("type", tipo)
    input.setAttribute("name", name)
    input.className = clase
    padre.appendChild(input)

    return input

}

//Función general para crear los nodos
export function crearNodo(elemento, contenido, clase, id, padre) {
    let nodo = document.createElement(elemento)
    if (contenido != "") nodo.textContent = contenido
    if (clase != "") nodo.className = clase
    if (id != "") nodo.id = id
    padre.appendChild(nodo)

    return nodo
}

export function crearBotonImg(contenedor, claseBoton,claseImg,rutaImagen,colorFondo) {
    let divBoton = document.createElement("button");
    divBoton.className = claseBoton
    divBoton.style.backgroundColor = colorFondo
    contenedor.appendChild(divBoton)

    let img = crearNodo("img", "", claseImg, "", divBoton)
    img.src = rutaImagen
    divBoton.appendChild(img)
    return img

}

export function crearNodoDebajo(elemento, contenido, clase, id, superior) {
    let nodo = document.createElement(elemento)
    nodo.textContent = contenido
    if (clase != "") nodo.className = clase
    if (id != "") nodo.id = id
    superior.parentNode.insertBefore(nodo, superior.nextSibling);

    return nodo
}

//Si algo existe lo eliminamos
export function eliminarExistente(idNodo){
    let nodo = document.getElementById(idNodo);
    if(nodo){
        nodo.remove();
    }
}

//Se encarga de eliminar todo el contenido de un div pero no elimina el elemento html que le introduces
export function limpiarContenido(contenido) {
    let primero = contenido.firstChild

    while (primero) {
        primero.remove()
        primero = contenido.firstChild
    }
}


