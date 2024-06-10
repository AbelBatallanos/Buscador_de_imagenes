const resultado = document.getElementById("resultado");
const formulario = document.querySelector(".formulario")
const paginacion = document.getElementById("paginacion");

const registrosPorPagina = 40;
let Totalpaginas;
let iterador;
let pagiActual = 1;
window.onload = ()=>{
    formulario.addEventListener('submit', validaFormulario);
}

function validaFormulario(e){
    e.preventDefault();
    const terminoBusqueda = document.querySelector("#termino").value;

    if(terminoBusqueda === ""){
        mostrarAlerta("Agrega un termino de busqueda");
        return;
    }

    pasarDatos();

}

function pasarDatos(){
    const terminos = document.querySelector("#termino").value;
    Key = "44212812-d53726a5f9c71b87a12654372";
    Url = `https://pixabay.com/api/?key=${Key}&q=${terminos}&per_page=${registrosPorPagina}&page=${pagiActual}`;  /*El simbolo "&" es un amperSon y seguido per_page=100 esto es propia configuracion del api del que estamos usanddo, esta config nos permite determinar cuantos resultados queremos que nos muestre*/

    fetch(Url)
        .then(respuest => respuest.json())
        .then(resultado => {
           Totalpaginas = calcularPaginas(resultado.totalHits)
           console.log(resultado.totalHits)
           console.log(Totalpaginas)
           MostrarImagenes(resultado.hits)})
}

function calcularPaginas(totalhits){
    return parseInt(Math.ceil(totalhits / registrosPorPagina));
}

/* Generador que va a registrar la cantidad de elementos de acuerdo a las paginas*/

function *crearPaginador(total){  /*Esto es un Generador si o si para crear uno se debe de colocar el "*" aterisco y luego cualquier nombre para el generador*/
    for(let i = 1; i <= total; i++){
        yield i;  /* El yield sirve para registrar los valores internamente en el generador*/
    }
}
//fin del generador

function MostrarImagenes(Imagenes = []){
    LimpiarDatos(resultado)
    Imagenes.forEach( imagen => {
        const {id, views, likes, largeImageURL, previewURL} = imagen;

        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}" >

                    <div class="p-4">
                        <p class="font-bold"> ${likes} <span class="font-light">Me Gusta</span></p>
                        <p class="font-bold"> ${views} <span class="font-light">Vistas</span></p>

                        <a href="${largeImageURL}" target="_blank" rel="noopener noreferrer"
                        class="block w-full bg-blue-800 hover:bg-blue-500 text-black uppercase font-bold text-center rounded mt-5 p-1 text-white">Ver Imageen</a>
                    </div>
                </div>
            </div>
        `;
    });

    LimpiarDatos(paginacion);
    ImprimirPaginador()

}

function ImprimirPaginador(){
    iterador = crearPaginador(Totalpaginas);
    console.log(iterador)
    while(true){
        const {value, done} = iterador.next();  /*con next es la forma en la que despierta el generador*/  //Aca hacemos un destructurin porque nos devuelve un estaado de info dentro de un objeto
        if(done) return; //Esto se pone true cuando ya aya pasado por todos

        //Caso contrario genera un boton por cada elemento en el generador
        const boton = document.createElement("A");
        boton.href = "#";
        boton.textContent = value;
        boton.dataset.pagina = value;
        boton.className = "siguiente bg-yellow-400 px-4 py-1 mr-2 font-bold mb-4 uppercse rounded mb-1";
        console.log(" paginador" + value )
        boton.onclick = () =>{
            pagiActual = value;
            pasarDatos();   /*Antes resivia un parametro pero para no complicanor se lo quitamos y ahora ya no resive ningun parametro*/
        }

        paginacion.append(boton)
    }
}



//Funcion de limpiar Contenedores

function LimpiarDatos(contenedor){
    while(contenedor.firstChild){
        contenedor.removeChild(contenedor.firstChild);
    }
    return;
}

//Funcion de Imprimir Datos en el HTML
function mostrarAlerta(mensaje){
    const existente = document.querySelector(".border-red-400")
    if(!existente){
        const alerta = document.createElement("P");
        alerta.className = "bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded max-w-lg mx-auto mt-6 text-center";
        alerta.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline">${mensaje}</span>
        `;
        
        formulario.append(alerta);
        setTimeout(()=>{
            alerta.remove()
        },3000)
    }
}
