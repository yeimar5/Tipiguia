// ===========================================
// MÓDULO CREACIÓN DE NOTA
// ===========================================

// ===========================================
// IMPORTS
// ===========================================
import { limpiarTexto, FormatearFecha } from "./modulo-utilidades.js";
import * as DireccionPiloto from "./modulo-direccion-piloto.js";
import * as Agendar from "./modulo-agendar.js";
import * as Incumplimiento from "./modulo-incumplimiento.js";
import * as Quiebre from "./modulo-quiebre.js";
import * as noSoporte from "./modulo-soporteNA.js";
import * as Decos from "./modulo-gestionDecos.js";

// ===========================================
// CONSTANTES PARA CAMPOS DEL FORMULARIO
// ===========================================
const CAMPOS_FORMULARIO = [
  "Motivo", "Mtecnico", "NumTitular", "NomTitular", "Contingencia",
  "Aceptains", "aceptarRecibo", "rol", "Contacto", "mQuiebre",
  "Musuario", "Fecha", "Franja", "gps", "SF", "FC", "sus",
  "noSoporte", "NomAgent", "Agent", "direccionSistema", "resultado",
  "tipoJornada", "DRP"
];

// ===========================================
// FUNCIONES DE OBTENCIÓN DE DATOS
// ===========================================

/**
 * Inicializa y cachea los elementos del formulario
 * @returns {Object} Objeto con referencias a elementos DOM
 */
function inicializarCampos() {
  const campos = {};
  CAMPOS_FORMULARIO.forEach((id) => {
    campos[id] = document.getElementById(id);
  });
  return campos;
}

// Cache de elementos para evitar búsquedas repetidas
let camposCache = null;

/**
 * Obtiene los campos del formulario (usa cache)
 * @returns {Object} Objeto con referencias a elementos DOM
 */
function obtenerCampos() {
  if (!camposCache) {
    camposCache = inicializarCampos();
  }
  return camposCache;
}

/**
 * Obtiene todos los valores del formulario
 * @returns {Object} Objeto con todos los valores del formulario
 */
function obtenerValoresFormulario() {
  const campos = obtenerCampos();
  
  return {
    motivoLlamada: campos.Motivo?.value || "",
    motivoTecnico: campos.Mtecnico?.value || "",
    numeroTitular: campos.NumTitular?.value || "",
    nombreTitular: campos.NomTitular?.value || "",
    contingencia: campos.Contingencia?.checked || false,
    aceptaInstalar: campos.Aceptains?.checked || false,
    aceptarRecibo: campos.aceptarRecibo?.value || "",
    suspenderOrden: campos.sus?.checked || false,
    trabajador: campos.rol?.value || "",
    contacto: campos.Contacto?.value || "",
    motivoQuiebre: campos.mQuiebre?.value || "",
    motivoCliente: campos.Musuario?.value || "",
    fecha: campos.Fecha?.value || "",
    tipoJornada: campos.tipoJornada?.value || "",
    franjaAgenda: campos.Franja?.value || "",
    gpsActivo: campos.gps?.value || "",
    motivoNoAplica: campos.noSoporte?.value || "",
    soporteFotografico: campos.SF?.value || "",
    fallaChatbot: campos.FC?.checked || false,
    nombreAsesor: campos.NomAgent?.value || "",
    agentAsesor: `agent_${campos.Agent?.value || ""}`,
    direccionAgendador: campos.direccionSistema?.value || "",
    direcionenRecibo: campos.resultado?.value || "",
  };
}

// ===========================================
// FUNCIONES DE GENERACIÓN DE TEXTO
// ===========================================

/**
 * Genera los textos base comunes para todas las notas
 * @param {Object} valores - Valores del formulario
 * @returns {Object} Objeto con textos base formateados
 */
function generarTextosBase(valores) {
  return {
    titularContacto: `Titular ${valores.nombreTitular} se marca al número ${valores.numeroTitular}`,
    gestion: `. Gestionado por ${valores.nombreAsesor} ${valores.agentAsesor}.`,
    fechaFormateada: valores.fecha ? FormatearFecha(valores.fecha) : "",
    texto: `LINEA RESCATE Se comunica ${valores.trabajador} informando que ${valores.motivoTecnico} `,
  };
}

/**
 * Procesa el texto para notas de aplicativos (elimina "POR CONTINGENCIA")
 * @param {string} texto - Texto original
 * @returns {string} Texto procesado
 */
function procesarTextoNotaAplicativos(texto) {
  const checkbox = document.getElementById("notaApp");
  if (checkbox && checkbox.checked) {
    let cleanedText = texto.replace(/POR CONTINGENCIA/gi, "").trim();
    return cleanedText.replace(/\s+/g, " ").trim();
  }
  return texto;
}

// ===========================================
// FUNCIÓN PRINCIPAL DE CREACIÓN DE NOTA
// ===========================================

/**
 * Función principal para crear la nota basada en el motivo seleccionado
 */
function crearNota() {
  const valores = obtenerValoresFormulario();
  const textos = generarTextosBase(valores);
  const textoNota = document.getElementById("textoNota");
  
  if (!textoNota) {
    console.error("Elemento textoNota no encontrado");
    return;
  }

  let textoFinal = "";

  // Switch principal para determinar el tipo de nota a generar
  switch (valores.motivoLlamada) {
    case "0": // incumplimiento
      textoFinal = Incumplimiento.procesarCasoIncumplimiento(valores, textos);
      break;
      
    case "1": // agendar
      textoFinal = Agendar.procesarCasoAgenda(valores, textos);
      break;
      
    case "2": // quiebre
      textoFinal = Quiebre.procesarCasoQuiebre(valores, textos);
      break;
      
    case "3": // soporte no aplica
      textoFinal = noSoporte.procesarCasoSoporteNoAplica(valores, textos);
      break;
      
    case "4": // Gestión de decos
      textoFinal = Decos.procesarCasoGestionDecos(valores, textos);
      break;
      
    case "5": // Dirección piloto
      textoFinal = DireccionPiloto.procesarCasoDireccionPiloto(valores, textos);
      break;
      
    case "6": // Llamada caída
      textoFinal = textos.texto + " y se cae la llamada sin poder validar la información";
      break;
      
    default:
      textoFinal = textos.texto;
  }

  // Agregar gestión al final y limpiar texto
  textoFinal += textos.gestion;
  textoFinal = limpiarTexto(textoFinal);

  // Procesar contingencia si está activa
  if (valores.contingencia) {
    textoFinal = textoFinal.replace(/se marca al /gi, "").trim();
    textoFinal = procesarTextoNotaAplicativos(textoFinal);
  }

  // Actualizar el textarea
  textoNota.value = textoFinal;
}

// ===========================================
// FUNCIONES DE TEXTAREA
// ===========================================

/**
 * Ajusta automáticamente la altura del textarea
 * @param {HTMLTextAreaElement} textarea - Elemento textarea
 */
function autoResize(textarea) {
  if (!textarea) return;
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}

/**
 * Actualiza la nota completa y ajusta el tamaño del textarea
 */
function actualizarNotaCompleta() {
  crearNota();
  const textoNota = document.getElementById("textoNota");
  if (textoNota) {
    autoResize(textoNota);
  }
}

/**
 * Inicializa los event listeners para actualización automática
 */
function inicializarActualizacionAutomatica() {
  const formulario = document.querySelector("#Formulario");
  if (formulario) {
    formulario.addEventListener("input", actualizarNotaCompleta);
    formulario.addEventListener("change", actualizarNotaCompleta);
  }
}

// ===========================================
// FUNCIONES DE INICIALIZACIÓN
// ===========================================

/**
 * Invalida el cache de campos (útil para reinicializaciones)
 */
function invalidarCacheCampos() {
  camposCache = null;
}

// ===========================================
// EXPORTS
// ===========================================
export {
  crearNota,
  obtenerValoresFormulario,
  generarTextosBase,
  actualizarNotaCompleta,
  autoResize,
  inicializarActualizacionAutomatica,
  invalidarCacheCampos,
  procesarTextoNotaAplicativos
};