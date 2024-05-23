"use strict";

// Variables
const carrito =  document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const listaCursos = document.querySelector('#lista-cursos');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
let articulosCarrito = [];

// Funciones 
cargarEventListeners();
function cargarEventListeners(){
    // Cuando se presiona click en "agregar al carrito"
    listaCursos.addEventListener('click', agregarCurso );

    // Elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso);

    // Muestra los cursos del localStorage
    document.addEventListener('DOMContentLoaded', () => {
        // Se toma del localStorage, se adquiere lo que este en el carrito, si no hay nada, se pasa un arreglo vacío, luego se parsea para convertir de Json a cadena o objeto.
        articulosCarrito = JSON.parse( localStorage.getItem('carrito')) || [];

        carritoHTML();
    });

    // Vaciar el carrito de compras
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = []; // Resetear el arreglo
        carritoHTML(); // Eliminar todo el html
    });
}

function agregarCurso(e){
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')){
        const cursoSeleccionado = e.target.parentNode.parentNode;
        leerDatosCurso(cursoSeleccionado);
    }
}

// Eliminar curso del carrito 
function eliminarCurso(e){
    if(e.target.classList.contains('borrar-curso')){
        const cursoId = e.target.getAttribute('data-id');
        
        //  Elimina del arreglo de artículosCarrito por el dato id
        articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId);
        carritoHTML(); // Iterar sobre el carrito y mostrar su HTML
    }
}

// Lee el contenido del HTML al que le dimos click y extrae la información
function leerDatosCurso(cursoSeleccionado){  
    // Se crea un objeto con el contenido del curso actual
    let infoCurso = {
        imagen: cursoSeleccionado.querySelector('.imagen-curso').getAttribute('src'),
        nombre: cursoSeleccionado.querySelector('.info-card h4').textContent,
        precio: cursoSeleccionado.querySelector('.info-card .precio .u-pull-right').textContent,
        id: cursoSeleccionado.querySelector('.info-card a').getAttribute('data-id'),
        cantidad: 1
    }

    // Revisa si el articulo ya existe en el carrito
    const existe = articulosCarrito.some( curso => curso.id === infoCurso.id);
    if (existe){
        // Actualizar la cantidad
        const cursos = articulosCarrito.map( curso => {
            if (curso.id === infoCurso.id){
                curso.cantidad += 1;
                return curso; // Retorna el objeto actualizado
            } else {
                return curso; // Retorna los objetos no duplicados
            }
        });
        articulosCarrito = [...cursos];
    } else {
        // Agrega elementos al arreglo del carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    } 

    // Llamar a la función
    carritoHTML();
}

// Muestra el carrito de compras en el HTML
function carritoHTML(){
    // Limpiar el HTML
    limpiarHTML();
    //  Recorre el carrito y genera el HTML
    articulosCarrito.forEach( articulo=> {
        // Utilizar la desestructuración de objetos
        const {imagen, nombre, precio, cantidad, id} = articulo;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td> 
                <img src="${imagen}" width="100">
            </td>
            <td> ${nombre} </td>
            <td> ${precio} </td>
            <td> ${cantidad} </td>
            <td> 
                <a href="#" class="borrar-curso" data-id="${id}" > X </a>
            </td>
        `;       
        // Agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row);
    })

    // Agregar el carrito de compras al storage
    sincronizarStorage();
}

function sincronizarStorage(){
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

//  Elimina los cursos del tbody
function limpiarHTML(){
    // Limpia el HTML forma lenta
    //contenedorCarrito.innerHTML = '';

    // La mejor forma de limpiar HTML
    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}
