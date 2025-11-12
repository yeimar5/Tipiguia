// ===========================================
// MÓDULO UTILIDADES COMPARTIDAS
// ===========================================

// ===========================================
// CONSTANTES
// ===========================================
const ALERT_CONFIG = {
  toast: true,
  position: "top-start",
  showConfirmButton: false,
  timer: 1000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
};

const INVALID_STRINGS = ["Invalid Date", "NaN", "undefined", "null"];

// ===========================================
// FUNCIONES DE ALERTA Y NOTIFICACIÓN
// ===========================================

/**
 * Muestra una alerta de éxito con el texto proporcionado
 * @param {string} text - Texto a mostrar en la alerta
 */
function alerta(text) {
  const Toast = Swal.mixin(ALERT_CONFIG);
  Toast.fire({
    icon: `success`,
    text: text,
  });
}

/**
 * Copia texto al portapapeles
 * @param {string} txt - Texto a copiar
 */
async function copiarAlPortapapeles(txt) {
  try {
    await navigator.clipboard.writeText(txt);
  } catch (error) {
    console.error(`Error al copiar al portapapeles:`, error);
  }
}


/**
 * Copia texto y muestra alerta
 * @param {string} t - Texto a copiar
 * @param {Function} callback - Función de callback para la alerta
 */
function copiarYAlertar(t, callback) {
  try {
    if (esTextoInvalido(t)) {
      alert("Seleccione una fecha válida, no sea pendej@ 😂🤣😅");
      return;
    }

    copiarAlPortapapeles(t);
    callback(t);
  } catch (error) {
    console.error(`Error al copiar al portapapeles:`, error);
  }
}

// ===========================================
// FUNCIONES DE VALIDACIÓN
// ===========================================

/**
 * Verifica si un texto contiene strings inválidos
 * @param {string} texto - Texto a validar
 * @returns {boolean} True si el texto es inválido
 */
function esTextoInvalido(texto) {
  return INVALID_STRINGS.some((invalid) => texto.includes(invalid));
}

/**
 * Verifica si una fecha es anterior a hoy
 * @param {string} fechaStr - Fecha en formato string
 * @returns {boolean} True si la fecha es anterior a hoy
 */
function esFechaAnteriorAHoy(fechaStr) {
  const fecha = new Date(fechaStr);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  fecha.setHours(0, 0, 0, 0);
  return fecha < hoy;
}

// ===========================================
// FUNCIONES DE FORMATO DE TEXTO
// ===========================================

/**
 * Limpia y formatea texto removiendo caracteres no deseados
 * @param {string} texto - Texto a limpiar
 * @returns {string} Texto limpio
 */
function limpiarTexto(texto) {
  return texto
    .replace(/\([^)]*\)/g, "") // Eliminar paréntesis y su contenido
    .replace(/\|/g, "") // Eliminar barras verticales
    .replace(/\¿/g, "Ñ") // Corregir codificación ¿ → Ñ
    .replace(/\s+/g, " ") // Normalizar espacios
    .trim(); // Limpiar espacios al inicio/final
}

/**
 * Convierte texto a mayúsculas manteniendo la posición del cursor
 * @param {HTMLInputElement} input - Input element
 */
function convertToUppercase(input) {
  const cursorPosition = input.selectionStart;
  input.value = input.value.toUpperCase();
  input.setSelectionRange(cursorPosition, cursorPosition);
}

// ===========================================
// FUNCIONES DE ALMACENAMIENTO LOCAL
// ===========================================

/**
 * Obtiene datos guardados en localStorage
 * @returns {Object} Objeto con datos del localStorage
 */
function obtenerDatosLocalStorage() {
  return {
    nombreAsesor: localStorage.getItem("nombreAsesor"),
    agentAsesor: localStorage.getItem("agentAsesor"),
    imagenFondo: localStorage.getItem("imagenFondo"),
  };
}

/**
 * Guarda datos del asesor en localStorage
 * @param {string} nombreAsesor - Nombre del asesor
 * @param {string} agentAsesor - Agent del asesor
 */
function guardarDatosAsesor(nombreAsesor, agentAsesor) {
  localStorage.setItem("nombreAsesor", nombreAsesor);
  localStorage.setItem("agentAsesor", agentAsesor);
}

// ===========================================
// FUNCIONES DE FECHA
// ===========================================

/**
 * Formatea una fecha para mostrar en español
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {string} Fecha formateada o undefined si es inválida
 */
function FormatearFecha(fecha) {
  const [anio, mes, dia] = fecha.split("-");
  const fechaObj = new Date(anio, mes - 1, dia);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  fechaObj.setHours(0, 0, 0, 0);

  if (esFechaAnteriorAHoy(fechaObj)) {
    alert(
      "La fecha seleccionada no puede ser anterior a hoy. Seleccione una fecha válida 📅⚠️"
    );
    document.getElementById(`Fecha`).value = null;
    return;
  }

  const opciones = { weekday: "long", day: "numeric", month: "long" };
  const fecha_Agenda = fechaObj.toLocaleDateString("es-ES", opciones);
  return fecha_Agenda;
}

// ===========================================
// EXPORTS
// ===========================================
export {
  alerta,
  copiarAlPortapapeles,
  copiarYAlertar,
  esTextoInvalido,
  esFechaAnteriorAHoy,
  limpiarTexto,
  convertToUppercase,
  obtenerDatosLocalStorage,
  guardarDatosAsesor,
  FormatearFecha,
  ALERT_CONFIG,
  INVALID_STRINGS
};