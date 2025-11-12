import { actualizarNotaCompleta } from "./modulo-creacion-nota.mjs";

// ===========================================
// CONSTANTES PARA MAPEO DE SIN CONTACTO
// ===========================================
const TEXTO_SIN_CONTACTO = {
  1: " pero no contesta el teléfono",
  ocupado: "dirige a  línea ocupada",
  fuera_servicio: "dirige a número fuera de servicio",
  equivocado: "pero tercero indica que está equivocado el número",
  buzon: " y la llamada se dirige directamente al buzón de voz",
  cuelga: " contesta pero cliente cuelga la llamada",
  tercero: "Atiende la llamada una persona que no es el titular",
  rechaza_llamada: "rechaza la llamada",
};

// ===========================================
// FUNCIONES AUXILIARES PARA SIN CONTACTO
// ===========================================


// ===========================================
// MÓDULO PARA GESTIÓN DE CONTACTOS
// ===========================================

let contadorContactos = 1;

/**
 * Duplica los campos de contacto para agregar un número adicional.
 */
function duplicarContacto() {
  contadorContactos++;
  const seccionContacto = document.getElementById("seccion-contacto");
  const contactoOriginal = document.getElementById("contacto1");

  if (!seccionContacto || !contactoOriginal) {
    console.error("No se encontraron los elementos necesarios para duplicar el contacto.");
    return;
  }

  const nuevoContacto = contactoOriginal.cloneNode(true);

  // Limpiar el ID del clon para evitar duplicados
  nuevoContacto.id = `contacto${contadorContactos}`;
  nuevoContacto.classList.add("contacto-adicional");

  // Actualizar IDs y names de los nuevos elementos para que sean únicos
  const nuevoNumTitular = nuevoContacto.querySelector("#NumTitular");
  const nuevoContactoSelect = nuevoContacto.querySelector("#Contacto");
  const nuevoBotonAgregar = nuevoContacto.querySelector("#agregarNumero");

  if (nuevoNumTitular) {
    nuevoNumTitular.id = `NumTitular${contadorContactos}`;
    nuevoNumTitular.value = ""; // Limpiar valor
    nuevoNumTitular.placeholder = `Número adicional ${contadorContactos - 1}`;
  }

  if (nuevoContactoSelect) {
    nuevoContactoSelect.id = `Contacto${contadorContactos}`;
    nuevoContactoSelect.selectedIndex = 0; // Resetear selección
  }

  // Cambiar el botón de agregar por uno de eliminar
  if (nuevoBotonAgregar) {
    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.className = "btn btn-danger btn-block";
    botonEliminar.innerHTML = '<i class="fas fa-trash-alt"></i>';
    botonEliminar.title = "Eliminar este número";
    botonEliminar.onclick = () => {
      nuevoContacto.remove();
      moverMusuariodAlFinal();
      // ✅ Actualizar la nota después de eliminar
      actualizarNotaCompleta();
    };
    nuevoBotonAgregar.replaceWith(botonEliminar);
  }

  // Mover Musuariod al final antes de añadir el nuevo contacto
  moverMusuariodAlFinal();
  // Insertar el nuevo contacto ANTES de Musuariod
  const musuariod = document.getElementById("Musuariod");
  if (musuariod) {
    seccionContacto.insertBefore(nuevoContacto, musuariod);
  } else {
    seccionContacto.appendChild(nuevoContacto);
  }
  // ✅ Actualizar la nota después de agregar
  actualizarNotaCompleta();
}

/**
 * Inicializa los listeners para la gestión de contactos.
 */
function inicializarGestionContactos() {
  const botonAgregar = document.getElementById("agregarNumero");
  if (botonAgregar) {
    botonAgregar.addEventListener("click", duplicarContacto);
  }
}

/**
 * Elimina todos los campos de contacto adicionales que se hayan creado.
 */
function eliminarContactosAdicionales() {
  const contactosAdicionales = document.querySelectorAll(".contacto-adicional");
  contactosAdicionales.forEach(contacto => contacto.remove());
  contadorContactos = 1; // Reiniciar el contador
}

/**
 * Mueve el div Musuariod para que siempre esté al final de la sección de contactos.
 */
function moverMusuariodAlFinal() {
    const seccionContacto = document.getElementById("seccion-contacto");
    const musuariod = document.getElementById("Musuariod");
    if (seccionContacto && musuariod) {
        seccionContacto.appendChild(musuariod);
    }
}

function esSinContacto(valorContacto) {
  return (
    valorContacto !== "2" &&
    valorContacto !== "..." &&
    TEXTO_SIN_CONTACTO.hasOwnProperty(valorContacto)
  );
}

function obtenerTextoSinContacto(valorContacto) {
  return TEXTO_SIN_CONTACTO[valorContacto] || "Sin contacto";
}

/**
 * Genera una cadena de texto que describe los resultados de múltiples intentos de contacto.
 * @param {Array} contactos - Array de objetos de contacto, ej: [{numero: '123', estado: '1'}, {numero: '456', estado: '2'}]
 * @returns {string} - Una cadena de texto formateada.
 */
function generarTextoMultiContacto(contactos) {
  if (!contactos || contactos.length === 0) {
    return "";
  }

  if (contactos.length === 1) {
    const c = contactos[0];
    if (c.estado === "2") {
      return `se marca al número ${c.numero} y cliente contesta`;
    }
    return `se marca al número ${c.numero} ${obtenerTextoSinContacto(c.estado)}`;
  }

  const textos = contactos.map(c => {
    if (c.estado === "2") {
      return `al número ${c.numero} y cliente contesta`;
    }
    return `al número ${c.numero} ${obtenerTextoSinContacto(c.estado)}`;
  });

  // Une con comas, y usa "y" para el último elemento.
  const ultimo = textos.pop();
  return `se marca ${textos.join(", ")}, y ${ultimo}`;
}

/**
 * Verifica si en una lista de contactos, al menos uno fue exitoso ("Contacto" o "Tercero").
 * @param {Array} contactos - El array de objetos de contacto.
 * @returns {boolean} - True si hubo al menos un contacto exitoso.
 */
function huboContactoExitoso(contactos) {
  if (!contactos || contactos.length === 0) return false;
  return contactos.some(c => c.estado === '2' || c.estado === 'tercero');
}


export { inicializarGestionContactos, eliminarContactosAdicionales, esSinContacto, obtenerTextoSinContacto, generarTextoMultiContacto, huboContactoExitoso };
