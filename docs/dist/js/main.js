/*===========================================
              IMPORTAR MODULOS
===========================================*/

import * as DireccionPiloto from "./modulos/modulo-direccion-piloto.js";
import * as Agendar from "./modulos/modulo-agendar.js";
import * as Incumplimiento from "./modulos/modulo-incumplimiento.js";
import * as Quiebre from "./modulos/modulo-quiebre.js";
import * as noSoporte from "./modulos/modulo-soporteNA.js";
import * as Decos from "./modulos/modulo-gestionDecos.js";
import * as Sesion from "./modulos/modulo-sesion.js";
import * as Utilidades from "./modulos/modulo-utilidades.js";
import * as CreacionNota from "./modulos/modulo-creacion-nota.js";
import * as Validacion from "./modulos/modulo-validacion.js";

// ===========================================
// CONSTANTES ESPECÍFICAS DEL MAIN
// ===========================================
const UPPERCASE_INPUTS = ["via", "cruce", "placa", "complemento", "NombreTec"];
const ADDRESS_INPUTS = ["via", "cruce", "placa", "complemento"];

// ===========================================
// CONSTANTES PARA MAPEO DE SIN CONTACTO
// ===========================================
const TEXTO_SIN_CONTACTO = {
  1: " pero no contesta el teléfono",
  ocupado: " indica que la línea está ocupada",
  fuera_servicio: "indica  que este no se encuentra en servicio",
  equivocado: "pero indican que esta equivocado",
  buzon: " y la llamada se dirige directamente al buzón de voz",
  cuelga: " contesta pero cliente cuelga la llamada",
  tercero: "Atiende la llamada una persona que no es el titular",
  rechaza_llamada: "rechaza la llamada",
};

// ===========================================
// FUNCIONES AUXILIARES PARA SIN CONTACTO
// ===========================================
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

// ===========================================
// INICIALIZACIÓN Y EVENT LISTENERS
// ===========================================
const formulario = document.getElementById("Formulario");
if (formulario) {
  formulario.addEventListener("change", manejarCambio);
}
document.addEventListener("click", manejarClick);

// ===========================================
// MANEJADORES DE EVENTOS PRINCIPALES
// ===========================================
function manejarClick(evento) {
  const targetId = evento.target.id;
  const actions = {
    copiar: () => Utilidades.copiarYAlertar(
      document.getElementById(`NombreTec`).value, 
      Utilidades.alerta
    ),
    copiar1: () => Utilidades.copiarYAlertar(
      document.getElementById(`cedula`).value, 
      Utilidades.alerta
    ),
    copiar2: () => {
      let texto = document.getElementById(`telefono`).value.replace(`57`, ``);
      Utilidades.copiarYAlertar(texto, Utilidades.alerta);
    },
    copiar3: () => Utilidades.copiarYAlertar(
      document.getElementById(`atis`).value, 
      Utilidades.alerta
    ),
    btnCopiarNota: copiarNotaConValidacion,
    pedirCuota: pedirCuota,
    limpiar: resetearFormularios,
    Tipificar: lanzarModal,
    imagen: Sesion.subirImagen, // ✅ Función específica para subir imagen
    guardarCambios: guardarEnLocalStorage,
    btnLimpiar: limpiarFormularios,
  };

  if (actions[targetId]) {
    actions[targetId]();
  }
}

// ===========================================
// FUNCIONES DE PEDIDO DE CUOTA
// ===========================================
function pedirCuota() {
  try {
    const atis = document.getElementById(`atis`).value;
    const fechaAgenda = document.getElementById(`Fecha`).value;
    const franja = document.getElementById(`Franja`).value;
    const texto = `¡Hola! Solicito un cupo para el día ${fechaAgenda} en la franja ${franja} para la orden ${atis}`;

    Utilidades.copiarAlPortapapeles(texto);
    Utilidades.alerta(texto, 1);
  } catch (error) {
    console.error(`Error al copiar al portapapeles:`, error);
  }
}

// ===========================================
// FUNCIONES DE RESETEO
// ===========================================
function resetearFormularios() {
  const datosTecnicoElement = document.getElementById("datosTecnico") || window.datosTecnico;
  const formularioElement = document.getElementById("Formulario") || window.Formulario;

  if (datosTecnicoElement && typeof datosTecnicoElement.reset === "function") {
    datosTecnicoElement.reset();
  }
  if (formularioElement && typeof formularioElement.reset === "function") {
    formularioElement.reset();
  }
  
  toggleElementStat("Contacto", false);
  resetearTextareas();
  limpiarResaltados();
  
  // ✅ Invalidar cache al resetear
  CreacionNota.invalidarCacheCampos();
}

function limpiarFormularios() {
  Swal.fire({
    title: "¿Está seguro de limpiar el formulario?",
    text: "Esta acción borrará todos los datos ingresados, incluidos los datos del tecnico.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, limpiar",
    cancelButtonText: "No, cancelar",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
  }).then((result) => {
    if (result.isConfirmed) {
      document.querySelector("#tipificarNota .close").click();
      resetearFormularios();
    }
  });
}

// ===========================================
// FUNCIONES DE ALMACENAMIENTO
// ===========================================
function guardarEnLocalStorage() {
  const nombreAsesor = document.getElementById("NomAgent").value;
  const agentAsesor = document.getElementById("Agent").value;

  // ✅ Usar función del módulo de utilidades
  Utilidades.guardarDatosAsesor(nombreAsesor, agentAsesor);

  const closeButton = document.getElementById("close-login");
  if (closeButton) closeButton.click();

  Utilidades.alerta(`DATOS GUARDADOS\n Exitosamente`);
}

// ===========================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// ===========================================
window.onload = function () {
  // ✅ Inicializar todos los datos de sesión (nombre, agent, imagen)
  Sesion.inicializarDatosLocales();
};

// ===========================================
// FUNCIONES DE MODAL
// ===========================================
function lanzarModal() {
  // ✅ Verificar si los datos de sesión están completos
  if (Sesion.verificarDatosCompletos()) {
    const { nombreAsesor, agentAsesor } = Utilidades.obtenerDatosLocalStorage();
    
    document.getElementById("NomAgent").value = nombreAsesor;
    document.getElementById("Agent").value = agentAsesor.replace("agent_", "");

    const modal = new bootstrap.Modal(document.getElementById("tipificarNota"));
    modal.show();
    manejarCambio();
  } else {
    // ✅ Usar función del módulo de sesión para mostrar alerta
    Sesion.mostrarAlertaDatosFaltantes();
  }
}

// ===========================================
// FUNCIONES DE DIRECCIÓN
// ===========================================
function concatenateInputs() {
  const via = document.getElementById("via").value || "";
  const cruce = document.getElementById("cruce").value || "";
  const placa = document.getElementById("placa").value || "";
  const complemento = document.getElementById("complemento").value || "";

  const parts = [via, cruce, placa, complemento].filter(
    (part) => part.trim() !== ""
  );
  const result = parts.join(" ");

  actualizarResultadoDireccion(result);
}

function actualizarResultadoDireccion(result) {
  const resultDiv = document.getElementById("resultado");
  if (!resultDiv) return;

  if (result.trim() === "") {
    resultDiv.value = "";
    resultDiv.style.color = "#6c757d";
  } else {
    resultDiv.value = result;
    resultDiv.style.color = "#495057";
  }
}

// ===========================================
// FUNCIONES DE DOM Y UI
// ===========================================
function cambiarColorFondo(color) {
  const colorElement = document.getElementById(`color`);
  if (colorElement) {
    colorElement.style.background = color;
  } else {
    console.warn(`Elemento con id 'color' no encontrado`);
  }
}

function setInnerHTML(selector, html) {
  const element = document.querySelector(selector);
  if (element) {
    element.innerHTML = html;
  } else {
    console.warn(`Elemento no encontrado para el selector: ${selector}`);
  }
}

function ValueMostrar(selector, valorValue) {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = valorValue;
  } else {
    console.warn(`Elemento no encontrado para el selector: ${selector}`);
  }
}

// ===========================================
// FUNCIONES DE VISIBILIDAD DE ELEMENTOS
// ===========================================
const todosLosElementos = [
  "#MotivoTec", "#MoQuiebre", "#Musuariod", "#fecha", "#GPS", "#Soporte",
  "#contingencia", "#Acepta", "#fallaChatbot", "#Titular", "#contacto",
  "#contacto1", "#suspender", "#notaAplicativos", "#DRP", 
  "#seccionDireccionSistema", "#jornadaSelect",
];

function aplicarDisplay(selectores, displayValue) {
  (selectores || []).forEach((selector) => {
    const elemento = document.querySelector(selector);
    if (elemento) {
      elemento.style.display = displayValue;
    }
  });
}

function mostrarSoloElementos(configuracion, elementosBase = {}) {
  aplicarDisplay(todosLosElementos, "none");
  aplicarDisplay(elementosBase.block, "block");
  aplicarDisplay(elementosBase.flex, "flex");
  aplicarDisplay(configuracion.block, "block");
  aplicarDisplay(configuracion.flex, "flex");
}

function toggleElementStat(elementId, isDisabled) {
  const element = document.getElementById(elementId);
  if (element) {
    element.disabled = isDisabled;
  }
}

function ordenarElementos(elem1, elem2) {
  if (elem1 && elem2 && elem2.parentNode) {
    elem2.parentNode.insertBefore(elem1, elem2);
  }
}

// ===========================================
// INICIALIZACIÓN DE INPUTS
// ===========================================
function inicializarInputsEnMayusculas() {
  UPPERCASE_INPUTS.forEach(function (inputId) {
    const input = document.getElementById(inputId);
    if (input) {
      input.addEventListener("input", function () {
        Utilidades.convertToUppercase(this);
        if (ADDRESS_INPUTS.includes(inputId)) {
          concatenateInputs();
        }
      });
    }
  });
}

function inicializarCheckboxNotaAplicativos() {
  const checkbox = document.getElementById("notaApp");
  if (checkbox) {
    checkbox.addEventListener("change", function () {
      const textoLabel = this.checked ? "NOTA APLICATIVOS" : "NOTA NORMAL";
      setInnerHTML("#labelText", textoLabel);
      
      // ✅ Usar función del módulo de creación de nota
      CreacionNota.crearNota();
    });
  }
}

function resetearTextareas() {
  const textareas = document.querySelectorAll("textarea");
  textareas.forEach((textarea) => {
    textarea.style.height = "auto";
    textarea.rows = 2;
  });
}

// ===========================================
// INICIALIZACIÓN AL CARGAR DOM
// ===========================================
document.addEventListener("DOMContentLoaded", function () {
  inicializarInputsEnMayusculas();
  inicializarCheckboxNotaAplicativos();
  
  // ✅ Inicializar módulo de creación de nota
  CreacionNota.inicializarActualizacionAutomatica();
  
  // ✅ Inicializar sistema de validación
  Validacion.inicializarSistemaValidacion();
  
  // Aplicar limpieza automática al input direccionSistema
  const direccionSistema = document.getElementById("direccionSistema");
  if (direccionSistema) {
    function aplicarLimpieza() {
      const textoOriginal = direccionSistema.value;
      const textoLimpio = Utilidades.limpiarTexto(textoOriginal);

      if (textoOriginal !== textoLimpio) {
        const cursorPos = direccionSistema.selectionStart;
        direccionSistema.value = textoLimpio;
        const nuevaPos = Math.min(cursorPos, textoLimpio.length);
        direccionSistema.setSelectionRange(nuevaPos, nuevaPos);
      }
    }

    direccionSistema.addEventListener("paste", () => setTimeout(aplicarLimpieza, 0));
    direccionSistema.addEventListener("input", aplicarLimpieza);
  }
});

// ===========================================
// MANEJADOR PRINCIPAL DE CAMBIOS
// ===========================================
function manejarCambio(e) {
  // ✅ Usar función del módulo de creación de nota
  CreacionNota.inicializarActualizacionAutomatica();
  
  setInnerHTML("#TMusuario", "MOTIVO USUARIO");
  setInnerHTML("#labelAcepta", "CLIENTE ACEPTA INSTALAR");
  setInnerHTML("#labelSuspender", "SUSPENDER ORDEN");

  // ✅ Usar función del módulo de creación de nota
  const valores = CreacionNota.obtenerValoresFormulario();

  // Switch para manejar diferentes casos
  switch (valores.motivoLlamada) {
    case "0": // incumplimiento
      Incumplimiento.manejarCasoIncumplimiento(valores);
      setInnerHTML("#labelAcepta", "CLIENTE A LA ESPERA");
      setInnerHTML("#labelSuspender", "AGENDAR");
      break;
    case "1": // agendar
      Agendar.manejarCasoAgenda(valores);
      break;
    case "2": // quiebres
      Quiebre.manejarCasoQuiebre(valores);
      break;
    case "3": // soporte no aplica
      noSoporte.manejarCasoSoporteNoAplica(valores);
      break;
    case "4": // Gestión decos
      Decos.manejarCasoDecos(valores);
      break;
    case "5": // Gestión piloto
      DireccionPiloto.manejarCasoDireccionPiloto(valores);
      break;
    case "6": // llamada caída
      cambiarColorFondo("#9513f1");
      mostrarSoloElementos({ block: ["#MotivoTec"] });
      ValueMostrar("#Mtecnico", "");
      break;
    default:
      cambiarColorFondo("#1392F1");
      mostrarSoloElementos({ block: ["#MotivoTec"] });
      ValueMostrar("#Mtecnico", "");
      ValueMostrar("#Musuario", "");
  }

  // ✅ Usar función del módulo de creación de nota
  CreacionNota.crearNota();
}

// ===========================================
// FUNCIONES DE VALIDACIÓN DELEGADAS
// ===========================================
function copiarNotaConValidacion() {
  // ✅ Delegado completamente al módulo de validación
  return Validacion.copiarNotaConValidacion();
}

function limpiarResaltados() {
  // ✅ Delegado al módulo de validación
  Validacion.limpiarResaltados();
}

// ===========================================
// EXPORTS PARA COMPATIBILIDAD
// ===========================================
window.autoResize = CreacionNota.autoResize;

export {
  cambiarColorFondo,
  mostrarSoloElementos,
  setInnerHTML,
  ValueMostrar,
  obtenerTextoSinContacto,
  toggleElementStat,
  esSinContacto,
  ordenarElementos,
};