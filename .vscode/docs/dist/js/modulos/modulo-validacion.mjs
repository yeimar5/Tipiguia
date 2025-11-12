// ===========================================
// MÓDULO VALIDACIÓN Y RESALTADO DE CAMPOS
// ===========================================

// ===========================================
// IMPORTS
// ===========================================
import { copiarYAlertar, alerta } from "./modulo-utilidades.mjs";
import { compararDirecciones } from "./modulo-direccion-piloto.mjs";

// ===========================================
// CONSTANTES DE VALIDACIÓN
// ===========================================
const CAMPOS_VALIDABLES = [
  "NumTitular",
  "NomTitular",
  "Contacto",
  "Fecha",
  "Franja",
  "mQuiebre",
  "noSoporte",
  "direccionSistema",
  "aceptarRecibo",
  "resultado",
  "Musuario",
  "tipoJornada",
];

const SOPORTES_CON_MOTIVO_USUARIO = ["11", "6", "13", "14", "3", "9", "4", "16"];

// ===========================================
// FUNCIONES DE VALIDACIÓN PRINCIPAL
// ===========================================

/**
 * Valida todos los campos requeridos antes de copiar la nota
 * @returns {Array} Array de errores encontrados
 */
function validarAntesDeCopirarNota() {
  const valores = obtenerValoresFormulario();
  const errores = [];
  const motivoLlamada = valores.motivoLlamada;
  const contingencia = valores.contingencia;
  const contacto = valores.contacto;
  const clienteAgenda = valores.suspenderOrden;

  // Obtener campos requeridos según el motivo
  const camposRequeridos = obtenerCamposRequeridosPorMotivo(
    motivoLlamada,
    contingencia,
    contacto,
    clienteAgenda,
    valores
  );

  // Validar campos básicos
  Object.entries(camposRequeridos).forEach(([campo, descripcion]) => {
    if (esCampoVacio(campo)) {
      errores.push(`❌ Falta: ${descripcion}`);
    }
  });

  // Validaciones condicionales específicas
  errores.push(...validarCamposCondicionales(motivoLlamada, valores));

  return errores;
}

/**
 * Obtiene los valores actuales del formulario
 * @returns {Object} Objeto con valores del formulario
 */
function obtenerValoresFormulario() {
  return {
    motivoLlamada: obtenerValorElemento("Motivo"),
    trabajador: obtenerValorElemento("rol"),
    contingencia: obtenerEstadoCheckbox("Contingencia"),
    contacto: obtenerValorElemento("Contacto"),
    suspenderOrden: obtenerEstadoCheckbox("sus"),
    aceptaInstalar: obtenerEstadoCheckbox("Aceptains"),
    motivoCliente: obtenerValorElemento("Musuario"),
    motivoQuiebre: obtenerValorElemento("mQuiebre"),
    motivoNoAplica: obtenerValorElemento("noSoporte"),
    tipoJornada: obtenerValorElemento("tipoJornada"),
    aceptarRecibo: obtenerValorElemento("aceptarRecibo"),
  };
}

/**
 * Obtiene los campos requeridos según el motivo de llamada
 */
function obtenerCamposRequeridosPorMotivo(
  motivoLlamada,
  contingencia,
  contacto,
  clienteAgenda,
  valores
) {
  const camposPorMotivo = {
    0: {
      // ✅ INCUMPLIMIENTO
      NumTitular: "Número de teléfono del titular",
      NomTitular: "Nombre del titular",
      // Solo validar contacto si NO hay contingencia activa
      ...(contingencia ? {} : { Contacto: "Tipo de contacto" }),
      // Fecha y Franja solo si NO hay contingencia Y contacto exitoso Y cliente agenda
      ...(!contingencia && contacto === "2" && clienteAgenda
        ? {
            Fecha: "Fecha de agenda",
            Franja: "Franja horaria",
          }
        : {}),
      // Motivo usuario solo si hay contacto exitoso y no hay contingencia
      ...(!contingencia && contacto === "2"
        ? {
            Musuario: "Motivo del cliente",
          }
        : {}),
    },

    1: {
      // ✅ AGENDA
      NumTitular: "Número de teléfono del titular",
      NomTitular: "Nombre del titular",

      // Contacto: Para gestor siempre, para técnico solo si no hay contingencia
      ...(valores.trabajador === "gestor"
        ? { Contacto: "Tipo de contacto" }
        : contingencia
        ? {}
        : { Contacto: "Tipo de contacto" }),

      // Fecha y Franja: Lógica diferente según el tipo de trabajador
      ...(valores.trabajador === "gestor"
        ? // GESTOR: Solo pedir fecha si hay contacto exitoso
          contacto === "2"
          ? {
              Fecha: "Fecha de agenda",
              Franja: "Franja horaria",
            }
          : {}
        : // TÉCNICO: Fecha siempre EXCEPTO si Aceptains O sus están marcados
        !valores.aceptaInstalar && !valores.suspenderOrden
        ? {
            Fecha: "Fecha de agenda",
            Franja: "Franja horaria",
          }
        : {}),

      // Motivo usuario si hay contacto exitoso y no hay contingencia
      ...(!contingencia && contacto === "2"
        ? {
            Musuario: "Motivo del cliente",
          }
        : {}),
    },

    2: {
      // QUIEBRE
      NumTitular: "Número de teléfono del titular",
      NomTitular: "Nombre del titular",
      ...(contingencia ? {} : { Contacto: "Tipo de contacto" }),
      mQuiebre: "Motivo de quiebre",
      ...(!contingencia && contacto === "2"
        ? {
            Musuario: "Motivo del cliente",
          }
        : {}),
    },

    3: {
      // ✅ SOPORTE NO APLICA
      noSoporte: "Tipo de soporte",
    },

    4: {
      // GESTIÓN DECOS
      NumTitular: "Número de teléfono del titular",
      NomTitular: "Nombre del titular",
      ...(contingencia ? {} : { Contacto: "Tipo de contacto" }),
      ...(!contingencia && contacto === "2"
        ? {
            Musuario: "Motivo del cliente",
          }
        : {}),
    },

    5: {
      // DIRECCIÓN PILOTO
      aceptarRecibo: "Selecciona una opcion (Aceptar/No Aceptar)",
      ...(valores.aceptarRecibo === "SI"
        ? {
            resultado: "Dirección de recibo",
            direccionSistema: "Dirección del sistema",
          }
        : {}),
    },

    6: {}, // LLAMADA CAÍDA - no requiere campos adicionales
  };

  return camposPorMotivo[motivoLlamada] || {};
}

/**
 * Validaciones condicionales específicas por motivo
 */
function validarCamposCondicionales(motivoLlamada, valores) {
  const errores = [];

  switch (motivoLlamada) {
    case "2": // Quiebre
      if (valores.contacto === "2" && !valores.contingencia) {
        if (!valores.motivoQuiebre || valores.motivoQuiebre === "...") {
          errores.push("❌ Falta: Motivo específico de quiebre");
        }
      }
      break;

    case "3": // Soporte no aplica
      const tipoSoporte = valores.motivoNoAplica;

      // Validar jornada si es tipo 7
      if (tipoSoporte === "7") {
        if (!valores.tipoJornada || valores.tipoJornada === "") {
          errores.push("❌ Falta: Tipo de jornada (AM/PM)");
        }
      }

      // Validar motivo usuario para ciertos tipos de soporte
      if (SOPORTES_CON_MOTIVO_USUARIO.includes(tipoSoporte)) {
        if (!valores.motivoCliente || valores.motivoCliente.trim() === "") {
          errores.push("❌ Falta: Motivo del usuario (para este tipo de soporte)");
        }
      }
      break;

    case "5": // Dirección piloto
      if (valores.aceptarRecibo === "SI" && esCampoVacio("resultado")) {
        errores.push("❌ Falta: La dirección que aparece en el recibo público");
      }
      if (valores.aceptarRecibo === "NO") {
        if (!valores.motivoCliente || valores.motivoCliente.trim() === "") {
          errores.push("❌ Falta: Motivo por el cual no acepta el recibo");
        }
      }
      break;
  }

  return errores;
}

// ===========================================
// FUNCIONES AUXILIARES DE VALIDACIÓN
// ===========================================

/**
 * Obtiene el valor de un elemento del DOM
 */
function obtenerValorElemento(id) {
  const elemento = document.getElementById(id);
  return elemento ? elemento.value : "";
}

/**
 * Obtiene el estado de un checkbox
 */
function obtenerEstadoCheckbox(id) {
  const elemento = document.getElementById(id);
  return elemento ? elemento.checked : false;
}

/**
 * Verifica si un campo está vacío o tiene valor por defecto
 */
function esCampoVacio(campo) {
  const elemento = document.getElementById(campo);
  if (!elemento) return false;

  const valor = elemento.value;
  return !valor || valor.trim() === "" || valor === "...";
}

/**
 * Verifica si un campo es requerido y está vacío
 */
function esRequeridoYVacio(campo, motivoLlamada, contacto) {
  const elemento = document.getElementById(campo);
  if (!elemento) return false;

  const valor = elemento.value;
  const estaVacio = !valor || valor.trim() === "" || valor === "...";

  if (!estaVacio) return false;

  const contingencia = obtenerEstadoCheckbox("Contingencia");
  const clienteAgenda = obtenerEstadoCheckbox("sus");
  const valores = obtenerValoresFormulario();

  const configuracion = obtenerCamposRequeridosPorMotivo(
    motivoLlamada,
    contingencia,
    contacto,
    clienteAgenda,
    valores
  );

  return configuracion.hasOwnProperty(campo);
}

// ===========================================
// FUNCIONES DE RESALTADO VISUAL
// ===========================================

/**
 * Resalta los campos que faltan por completar
 */
function resaltarCamposFaltantes() {
  limpiarResaltados();

  const errores = validarAntesDeCopirarNota();
  if (errores.length === 0) return;

  const valores = obtenerValoresFormulario();
  const motivoLlamada = valores.motivoLlamada;
  const contacto = valores.contacto;

  let primerCampoEncontrado = false;

  CAMPOS_VALIDABLES.forEach((campo) => {
    const elemento = document.getElementById(campo);
    if (elemento && esRequeridoYVacio(campo, motivoLlamada, contacto)) {
      elemento.classList.add("campo-faltante");

      if (!primerCampoEncontrado) {
        elemento.classList.add("primer-faltante");
        primerCampoEncontrado = true;
        setTimeout(() => {
          elemento.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      }
    }
  });
}

/**
 * Limpia todos los resaltados de campos
 */
function limpiarResaltados() {
  document
    .querySelectorAll(".campo-faltante, .campo-completado, .primer-faltante")
    .forEach((el) => {
      el.classList.remove("campo-faltante", "campo-completado", "primer-faltante");
    });
}

/**
 * Quita el resaltado de un campo específico
 */
function quitarResaltadoCampo(campo) {
  if (campo.classList.contains("campo-faltante")) {
    campo.classList.remove("campo-faltante", "primer-faltante");

    // Efecto visual de "completado"
    campo.classList.add("campo-completado");
    setTimeout(() => {
      campo.classList.remove("campo-completado");
    }, 1500);
  }
}

// ===========================================
// FUNCIONES DE EVENT LISTENERS
// ===========================================

/**
 * Agrega event listeners para quitar resaltado automáticamente
 */
function agregarEventListenersParaResaltado() {
  CAMPOS_VALIDABLES.forEach((campoId) => {
    const campo = document.getElementById(campoId);
    if (campo) {
      // Para inputs de texto, textarea, y selects
      campo.addEventListener("input", () => quitarResaltadoCampo(campo));
      campo.addEventListener("change", () => quitarResaltadoCampo(campo));
      campo.addEventListener("keydown", () => quitarResaltadoCampo(campo));

      // Para selects específicamente
      if (campo.tagName === "SELECT") {
        campo.addEventListener("focus", () => {
          if (campo.classList.contains("campo-faltante")) {
            quitarResaltadoCampo(campo);
          }
        });
      }
    }
  });
}

// ===========================================
// FUNCIÓN PRINCIPAL DE COPIA CON VALIDACIÓN
// ===========================================

/**
 * Copia la nota después de validar todos los campos requeridos
 * @returns {boolean} True si se pudo copiar, false si hay errores
 */
async function copiarNotaConValidacion() {
  const errores = validarAntesDeCopirarNota();

  if (errores.length > 0) {
    resaltarCamposFaltantes();
    mostrarErroresValidacion(errores);
    return false;
  }

  // --- INICIO DE LA NUEVA VALIDACIÓN ---
  const valores = obtenerValoresFormulario();

  // Si es Dirección Piloto, se acepta el recibo y las direcciones no coinciden, pedir confirmación
  if (valores.motivoLlamada === "5" && valores.aceptarRecibo === "SI" && !compararDirecciones()) {
    const confirmacion = await Swal.fire({
      title: "¿Estás segur@?",
      text: "Las direcciones del recibo y del sistema no coinciden. ¿Deseas continuar y copiar la nota de todas formas?",
      icon: "question",
      showDenyButton: true,
      confirmButtonText: "Sí, copiar",
      denyButtonText: "No, corregir",
      confirmButtonColor: "#28a745",
      denyButtonColor: "#dc3545",
    });

    if (confirmacion.isDenied) {
      // Si el usuario elige "No, corregir", no hacemos nada y volvemos al formulario.
      return false;
    }
    // Si el usuario elige "Sí, copiar", la función continúa.
  }

  limpiarResaltados();
  const textoNota = document.getElementById("textoNota").value;
  copiarYAlertar(textoNota, alerta);
  return true;
}

/**
 * Muestra los errores de validación en un modal
 */
function mostrarErroresValidacion(errores) {
  const mensajeHTML = `
    <div style="text-align: left; max-height: 300px; overflow-y: auto;">
      <p><strong>🚫 No se puede copiar la nota.</strong></p>
      <p>Por favor complete los siguientes campos:</p>
      <ul style="list-style: none; padding-left: 0;">
        ${errores
          .map((error) => `<li style="margin: 5px 0; color: #d63031;">${error}</li>`)
          .join("")}
      </ul>
      <hr style="margin: 15px 0;">
      <p style="font-size: 14px; color: #636e72;">
        💡 <em>Los campos faltantes están resaltados en rojo y desaparecerán al escribir</em>
      </p>
    </div>
  `;

  Swal.fire({
    title: "⚠️ Campos Incompletos",
    html: mensajeHTML,
    icon: "warning",
    confirmButtonColor: "#d63031",
    confirmButtonText: "📝 Completar campos",
    allowOutsideClick: false,
    width: "500px",
  });
}

// ===========================================
// FUNCIONES DE INICIALIZACIÓN
// ===========================================

/**
 * Inicializa el sistema de validación y resaltado
 */
function inicializarSistemaValidacion() {
  agregarEventListenersParaResaltado();
}

// ===========================================
// INICIALIZACIÓN AUTOMÁTICA
// ===========================================
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    inicializarSistemaValidacion();
  }, 100);
});

window.addEventListener("load", function () {
  inicializarSistemaValidacion();
});

// ===========================================
// EXPORTS
// ===========================================
export {
  validarAntesDeCopirarNota,
  copiarNotaConValidacion,
  resaltarCamposFaltantes,
  limpiarResaltados,
  quitarResaltadoCampo,
  inicializarSistemaValidacion,
  agregarEventListenersParaResaltado,
  obtenerValoresFormulario,
  esRequeridoYVacio,
};
