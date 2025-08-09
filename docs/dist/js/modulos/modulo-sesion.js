// ===========================================
// MÓDULO GESTIÓN DE SESIÓN DE USUARIO
// ===========================================

import { alerta, obtenerDatosLocalStorage } from "./modulo-utilidades.js";

// ===========================================
// FUNCIONES DE INICIALIZACIÓN Y CARGA DE DATOS
// ===========================================

/**
 * Inicializa y carga todos los datos guardados en localStorage
 * Se ejecuta al cargar la página
 */
function inicializarDatosLocales() {
  cargarDatosAsesor();
  cargarImagenFondoGuardada();
}

/**
 * Carga los datos del asesor (nombre y agent) desde localStorage
 */
function cargarDatosAsesor() {
  const { nombreAsesor, agentAsesor } = obtenerDatosLocalStorage();
  
  if (nombreAsesor && agentAsesor) {
    const nomAgentElement = document.getElementById("NomAgent");
    const agentElement = document.getElementById("Agent");
    
    if (nomAgentElement) nomAgentElement.value = nombreAsesor;
    if (agentElement) agentElement.value = agentAsesor.replace("agent_", "");
    
    console.log("Datos del asesor cargados correctamente");
  } else {
    console.log("No se encontraron datos del asesor guardados");
  }
}

/**
 * Carga la imagen de fondo guardada desde localStorage
 */
function cargarImagenFondoGuardada() {
  const imagenFondo = localStorage.getItem("imagenFondo");
  if (imagenFondo) {
    aplicarImagenFondo(imagenFondo);
    console.log("Imagen de fondo cargada correctamente");
  } else {
    console.log("No se encontró imagen de fondo guardada");
  }
}

/**
 * Verifica si todos los datos necesarios están disponibles
 * @returns {boolean} - true si todos los datos están disponibles
 */
function verificarDatosCompletos() {
  const { nombreAsesor, agentAsesor } = obtenerDatosLocalStorage();
  return !!(nombreAsesor && agentAsesor);
}

// ===========================================
// FUNCIONES DE GESTIÓN DE IMAGEN DE FONDO
// ===========================================

/**
 * Maneja la subida y procesamiento de imágenes de fondo
 */
async function subirImagen() {
  try {
    const { value: file } = await Swal.fire({
      title: `Cambiar Fondo`,
      input: `file`,
      inputAttributes: {
        accept: `image/*`,
        "aria-label": "Subir Fondo",
      },
    });

    if (file) {
      procesarArchivoImagen(file);
    }
  } catch (error) {
    console.error(`Error al subir la imagen:`, error);
  }
}

/**
 * Procesa el archivo de imagen y lo convierte a base64
 * @param {File} file - Archivo de imagen seleccionado
 */
function procesarArchivoImagen(file) {
  const reader = new FileReader();

  reader.onload = (e) => {
    const base64Image = e.target.result;
    aplicarImagenFondo(base64Image);
    guardarImagenEnStorage(base64Image);
    mostrarConfirmacionCambio();
  };

  reader.onerror = (e) => {
    console.error(`Error al leer el archivo:`, e);
    mostrarErrorCambio();
  };

  reader.readAsDataURL(file);
}

/**
 * Aplica la imagen de fondo al documento
 * @param {string} base64Image - Imagen en formato base64
 */
function aplicarImagenFondo(base64Image) {
  document.body.style.backgroundImage = `url(${base64Image})`;
}

/**
 * Guarda la imagen en localStorage
 * @param {string} base64Image - Imagen en formato base64
 */
function guardarImagenEnStorage(base64Image) {
  localStorage.setItem(`imagenFondo`, base64Image);
}

/**
 * Elimina la imagen de fondo guardada
 */
function eliminarImagenFondo() {
  localStorage.removeItem("imagenFondo");
  document.body.style.backgroundImage = "";
  console.log("Imagen de fondo eliminada");
}

// ===========================================
// FUNCIONES DE INTERFAZ DE USUARIO
// ===========================================

/**
 * Muestra confirmación de cambio exitoso
 */
function mostrarConfirmacionCambio() {
  Swal.fire({ 
    title: `Su fondo Ha Sido Cambiado`,
    icon: 'success',
    timer: 2000,
    showConfirmButton: false
  });
}

/**
 * Muestra error al cambiar fondo
 */
function mostrarErrorCambio() {
  Swal.fire({
    title: `Error`,
    text: `No se pudo cambiar el fondo. Inténtelo de nuevo.`,
    icon: `error`,
  });
}

/**
 * Muestra alerta cuando faltan datos del asesor
 */
function mostrarAlertaDatosFaltantes() {
  Swal.fire({
    title: "DATOS FALTANTES",
    text: "Por Favor, Ingresa tu Nombre y tu Numero de Agent.",
    iconColor: "#f8f32b",
    icon: "warning",
    confirmButtonColor: "#70b578",
    confirmButtonText: "Ingresar datos",
  }).then((result) => {
    if (result.isConfirmed) {
      const modal = new bootstrap.Modal(document.getElementById("login-modal"));
      modal.show();
    }
  });
}

// ===========================================
// EXPORTS
// ===========================================
export {
  // Funciones principales de inicialización
  inicializarDatosLocales,
  cargarDatosAsesor,
  cargarImagenFondoGuardada,
  verificarDatosCompletos,
  
  // Funciones de gestión de imagen
  subirImagen,
  procesarArchivoImagen,
  aplicarImagenFondo,
  guardarImagenEnStorage,
  eliminarImagenFondo,
  
  // Funciones de interfaz
  mostrarAlertaDatosFaltantes
};