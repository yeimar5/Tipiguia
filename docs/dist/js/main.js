/*===========================================
              IMPORTAR MODULOS
===========================================*/

import * as DireccionPiloto from "./modulos/modulo-direccion-piloto.js";
import * as Agendar from "./modulos/modulo-agendar.js";
import * as Incumplimiento from "./modulos/modulo-incumplimiento.js";
import * as Quiebre from "./modulos/modulo-quiebre.js";
import * as noSoporte from "./modulos/modulo-soporteNA.js";
import * as Decos from "./modulos/modulo-gestionDecos.js";

// ===========================================
// CONSTANTES Y CONFIGURACIONES
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

const UPPERCASE_INPUTS = ["via", "cruce", "placa", "complemento", "NombreTec"];
const ADDRESS_INPUTS = ["via", "cruce", "placa", "complemento"];
const INVALID_STRINGS = ["Invalid Date", "NaN", "undefined", "null"];

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
  // "2" es contacto exitoso, "..." es valor por defecto
  // Todo lo demás son tipos de sin contacto
  return (
    valorContacto !== "2" &&
    valorContacto !== "..." &&
    TEXTO_SIN_CONTACTO.hasOwnProperty(valorContacto)
  );
}

// Devuelve el texto correspondiente al valor de sin contacto
function obtenerTextoSinContacto(valorContacto) {
  return TEXTO_SIN_CONTACTO[valorContacto] || "Sin contacto";
}

function esFechaAnteriorAHoy(fechaStr) {
  const fecha = new Date(fechaStr);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  fecha.setHours(0, 0, 0, 0);
  return fecha < hoy;
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
// MANEJADORES DE EVENTOS
// ===========================================

function manejarClick(evento) {
  const targetId = evento.target.id;
  const actions = {
    copiar: () =>
      copiarYAlertar(document.getElementById(`NombreTec`).value, alerta),
    copiar1: () =>
      copiarYAlertar(document.getElementById(`cedula`).value, alerta),
    copiar2: () => {
      let texto = document.getElementById(`telefono`).value.replace(`57`, ``);
      copiarYAlertar(texto, alerta);
    },
    copiar3: () =>
      copiarYAlertar(document.getElementById(`atis`).value, alerta),
    btnCopiarNota: copiarNotaConValidacion,
    pedirCuota: pedirCuota,
    limpiar: resetearFormularios,
    Tipificar: lanzarModal,
    imagen: subirImagen,
    guardarCambios: guardarEnLocalStorage,
    btnLimpiar: limpiarFormularios,
  };

  if (actions[targetId]) {
    actions[targetId]();
  }
}

// ===========================================
// FUNCIONES DE COPIA Y ALERTA
// ===========================================

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

function alerta(text) {
  const Toast = Swal.mixin(ALERT_CONFIG);
  Toast.fire({
    icon: `success`,
    text: text,
  });
}

async function copiarAlPortapapeles(txt) {
  try {
    await navigator.clipboard.writeText(txt);
  } catch (error) {
    console.error(`Error al copiar al portapapeles:`, error);
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

    copiarAlPortapapeles(texto);
    alerta(texto, 1);
  } catch (error) {
    console.error(`Error al copiar al portapapeles:`, error);
  }
}

// ===========================================
// FUNCIONES DE RESETEO
// ===========================================

function resetearFormularios() {
  const datosTecnicoElement =
    document.getElementById("datosTecnico") || window.datosTecnico;
  const formularioElement =
    document.getElementById("Formulario") || window.Formulario;

  if (datosTecnicoElement && typeof datosTecnicoElement.reset === "function") {
    datosTecnicoElement.reset();
  }
  if (formularioElement && typeof formularioElement.reset === "function") {
    formularioElement.reset();
  }
  toggleElementStat("Contacto", false);
  resetearTextareas();
  limpiarResaltados();
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
// FUNCIONES DE IMAGEN
// ===========================================

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

// ===========================================
// FUNCIONES DE ALMACENAMIENTO
// ===========================================

function guardarEnLocalStorage() {
  const nombreAsesor = document.getElementById("NomAgent").value;
  const agentAsesor = document.getElementById("Agent").value;

  localStorage.setItem("nombreAsesor", nombreAsesor);
  localStorage.setItem("agentAsesor", agentAsesor);

  const closeButton = document.getElementById("close-login");
  if (closeButton) closeButton.click();

  alerta(`DATOS GUARDADOS\n Exitosamente`);
}

window.onload = function () {
  cargarImagenFondoGuardada();
  const nombreAsesor = localStorage.getItem("nombreAsesor");
  const agentAsesor = localStorage.getItem("agentAsesor");
};

// ===========================================
// FUNCIONES DE MODAL
// ===========================================

function lanzarModal() {
  const { nombreAsesor, agentAsesor } = obtenerDatosLocalStorage();

  if (nombreAsesor && agentAsesor) {
    document.getElementById("NomAgent").value = nombreAsesor;
    document.getElementById("Agent").value = agentAsesor.replace("agent_", "");

    const modal = new bootstrap.Modal(document.getElementById("tipificarNota"));
    modal.show();
    manejarCambio();
  } else {
    Swal.fire({
      title: "DATOS FALTANTES",
      text: "Por Favor, Ingresa tu Nombre y tu Numero de Agent.",
      iconColor: "#f8f32b",
      icon: "warning",
      confirmButtonColor: "#70b578",
      confirmButtonText: "Ingresar datos",
    }).then((result) => {
      if (result.isConfirmed) {
        const modal = new bootstrap.Modal(
          document.getElementById("login-modal")
        );
        modal.show();
      }
    });
  }
}

// ===========================================
// FUNCIONES DE FORMATO
// ===========================================

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

function convertToUppercase(input) {
  const cursorPosition = input.selectionStart;
  input.value = input.value.toUpperCase();
  input.setSelectionRange(cursorPosition, cursorPosition);
}

function limpiarTexto(texto) {
  return texto
    .replace(/\([^)]*\)/g, "") // Eliminar paréntesis y su contenido
    .replace(/\|/g, "") // Eliminar barras verticales
    .replace(/\¿/g, "Ñ") // Corregir codificación ¿ → Ñ
    .replace(/\s+/g, " ") // Normalizar espacios
    .trim(); // Limpiar espacios al inicio/final
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

// ===========================================
// FUNCIONES DE TEXTAREA
// ===========================================

function autoResize(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}

function actualizarNotaCompleta() {
  crearNota();
  autoResize(document.getElementById("textoNota"));
}

function Actualizartodo() {
  const formulario = document.querySelector("#Formulario");
  formulario.addEventListener("input", (event) => {
    actualizarNotaCompleta();
  });
}

// ===========================================
// FUNCIONES DE DOM
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
// INICIALIZACIÓN DE INPUTS
// ===========================================
function inicializarInputsEnMayusculas() {
  UPPERCASE_INPUTS.forEach(function (inputId) {
    const input = document.getElementById(inputId);
    if (input) {
      input.addEventListener("input", function () {
        convertToUppercase(this);

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

      // Regenerar la nota cuando cambie el estado del checkbox
      if (typeof crearNota === "function") {
        crearNota();
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  inicializarInputsEnMayusculas();
  inicializarCheckboxNotaAplicativos();
});

// ===========================================
//           FUNCIONES AUXILIARES
// ===========================================

function esTextoInvalido(texto) {
  return INVALID_STRINGS.some((invalid) => texto.includes(invalid));
}

function obtenerDatosLocalStorage() {
  return {
    nombreAsesor: localStorage.getItem("nombreAsesor"),
    agentAsesor: localStorage.getItem("agentAsesor"),
    imagenFondo: localStorage.getItem("imagenFondo"),
  };
}

function cargarImagenFondoGuardada() {
  const { imagenFondo } = obtenerDatosLocalStorage();
  if (imagenFondo) {
    document.body.style.backgroundImage = `url(${imagenFondo})`;
  }
}

function procesarArchivoImagen(file) {
  const reader = new FileReader();

  reader.onload = (e) => {
    const base64Image = e.target.result;
    document.body.style.backgroundImage = `url(${base64Image})`;
    localStorage.setItem(`imagenFondo`, base64Image);
    Swal.fire({ title: `Su fondo Ha Sido Cambiado` });
  };

  reader.onerror = (e) => {
    console.error(`Error al leer el archivo:`, e);
    Swal.fire({
      title: `Error`,
      text: `No se pudo cambiar el fondo. Inténtelo de nuevo.`,
      icon: `error`,
    });
  };

  reader.readAsDataURL(file);
}

function resetearTextareas() {
  const textareas = document.querySelectorAll("textarea");
  textareas.forEach((textarea) => {
    textarea.style.height = "auto";
    textarea.rows = 2;
  });
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

function ordenarElementos(elem1, elem2) {
  if (elem1 && elem2 && elem2.parentNode) {
    elem2.parentNode.insertBefore(elem1, elem2);
  }
}

// ===========================================
// FUNCIONES DE CREACIÓN DE NOTA
// ===========================================
const ids = [
  "Motivo",
  "Mtecnico",
  "NumTitular",
  "NomTitular",
  "Contingencia",
  "Aceptains",
  "aceptarRecibo",
  "rol",
  "Contacto",
  "mQuiebre",
  "Musuario",
  "Fecha",
  "Franja",
  "gps",
  "SF",
  "FC",
  "sus",
  "noSoporte",
  "NomAgent",
  "Agent",
  "direccionSistema",
  "resultado",
  "tipoJornada",
  "DRP",
];

const campos = {};
ids.forEach((id) => {
  campos[id] = document.getElementById(id);
});

function obtenerValoresFormulario() {
  return {
    motivoLlamada: campos.Motivo.value,
    motivoTecnico: campos.Mtecnico.value,
    numeroTitular: campos.NumTitular.value,
    nombreTitular: campos.NomTitular.value,
    contingencia: campos.Contingencia.checked,
    aceptaInstalar: campos.Aceptains.checked,
    aceptarRecibo: campos.aceptarRecibo.value,
    suspenderOrden: campos.sus.checked,
    trabajador: campos.rol.value,
    contacto: campos.Contacto.value,
    motivoQuiebre: campos.mQuiebre.value,
    motivoCliente: campos.Musuario.value,
    fecha: campos.Fecha.value,
    tipoJornada: campos.tipoJornada.value,
    franjaAgenda: campos.Franja.value,
    gpsActivo: campos.gps.value,
    motivoNoAplica: campos.noSoporte.value,
    soporteFotografico: campos.SF.value,
    fallaChatbot: campos.FC.checked,
    nombreAsesor: campos.NomAgent.value,
    agentAsesor: `agent_${campos.Agent.value}`,
    direccionAgendador: campos.direccionSistema.value,
    direcionenRecibo: campos.resultado.value,
  };
}

// Función para generar textos base
function generarTextosBase(valores) {
  return {
    titularContacto: `Titular ${valores.nombreTitular} se marca al número ${valores.numeroTitular}`,
    gestion: `. Gestionado por ${valores.nombreAsesor} ${valores.agentAsesor}.`,
    fechaFormateada: FormatearFecha(valores.fecha),
    texto: `LINEA RESCATE Se comunica ${valores.trabajador} informando que ${valores.motivoTecnico} `,
  };
}

// Función principal
function crearNota() {
  const valores = obtenerValoresFormulario();
  const textos = generarTextosBase(valores);
  const textoNota = document.getElementById("textoNota");
  let textoFinal = "";

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
      textoFinal =
        textos.texto + " y se cae la llamada sin poder validar la información";
      break;
    default:
      textoFinal = textos.texto;
  }

  textoFinal += textos.gestion;
  textoFinal = limpiarTexto(textoFinal);
  if (valores.contingencia) {
    textoFinal = textoFinal.replace(/se marca al /gi, "").trim();
    // Procesar el texto con la función de Nota Aplicativos
    if (typeof procesarTextoNotaAplicativos === "function") {
      textoFinal = procesarTextoNotaAplicativos(textoFinal);
    }
  }

  textoNota.value = textoFinal;
}

// ===========================================
// MANEJADORES DE CAMBIO EN OPCIONES DE FORMULARIO
// ===========================================

// Lista de todas las secciones o elementos visuales que se pueden mostrar/ocultar en la aplicacion
const todosLosElementos = [
  "#MotivoTec",
  "#MoQuiebre",
  "#Musuariod",
  "#fecha",
  "#GPS",
  "#Soporte",
  "#contingencia",
  "#Acepta",
  "#fallaChatbot",
  "#Titular",
  "#contacto",
  "#contacto1",
  "#suspender",
  "#notaAplicativos",
  "#DRP",
  "#seccionDireccionSistema",
  "#jornadaSelect",
];

function aplicarDisplay(selectores, displayValue) {
  (selectores || []).forEach((selector) => {
    const elemento = document.querySelector(selector);
    if (elemento) {
      elemento.style.display = displayValue;
    }
  });
}

// Función que acepta elementos base que siempre se muestran
function mostrarSoloElementos(configuracion, elementosBase = {}) {
  // Ocultar todos primero
  aplicarDisplay(todosLosElementos, "none");

  // Mostrar elementos base
  aplicarDisplay(elementosBase.block, "block");
  aplicarDisplay(elementosBase.flex, "flex");

  // Mostrar elementos de la configuración específica
  aplicarDisplay(configuracion.block, "block");
  aplicarDisplay(configuracion.flex, "flex");
}

function toggleElementStat(elementId, isDisabled) {
  const element = document.getElementById(elementId);
  if (element) {
    element.disabled = isDisabled;
  }
}

// Función principal para manejarCambio
function manejarCambio(e) {
  Actualizartodo();
  setInnerHTML("#TMusuario", "MOTIVO USUARIO");
  setInnerHTML("#labelAcepta", "CLIENTE ACEPTA INSTALAR");
  setInnerHTML("#labelSuspender", "SUSPENDER ORDEN");

  const valores = obtenerValoresFormulario();

  if (Actualizartodo) {
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
  }

  crearNota();
}

// Función para procesar el texto y eliminar "POR CONTINGENCIA"
function procesarTextoNotaAplicativos(texto) {
  const checkbox = document.getElementById("notaApp");
  if (checkbox && checkbox.checked) {
    let cleanedText = texto.replace(/POR CONTINGENCIA/gi, "").trim();
    return cleanedText.replace(/\s+/g, " ").trim();
  }
  return texto;
}

// ===========================================
// VALIDACIÓN PARA COPIAR NOTA
// ===========================================

function validarAntesDeCopirarNota() {
  const valores = obtenerValoresFormulario();
  const errores = [];
  const motivoLlamada = valores.motivoLlamada;
  const contingencia = valores.contingencia;
  const contacto = valores.contacto;
  const clienteAgenda = valores.suspenderOrden;

  // Campos específicos según el motivo
  const camposPorMotivo = {
    0: {
      // ✅ INCUMPLIMIENTO
      NumTitular: "Número de teléfono del titular",
      NomTitular: "Nombre del titular",
      // Solo validar contacto si NO hay contingencia activa
      ...(contingencia ? {} : { Contacto: "Tipo de contacto" }),
      // ✅Fecha y Franja solo si NO hay contingencia Y contacto exitoso Y cliente agenda
      ...(!contingencia && contacto === "2" && clienteAgenda
        ? {
            Fecha: "Fecha de agenda",
            Franja: "Franja horaria",
          }
        : {}),
      // Motivo usuario solo si hay contacto exitoso y no hay contingencia
      ...(!contingencia && contacto === "2"
        ? { Musuario: "Motivo del cliente" }
        : {}),
    },
    1: {
      // ✅ AGENDA
      NumTitular: "Número de teléfono del titular",
      NomTitular: "Nombre del titular",

      // Contacto: Para gestor siempre, para técnico solo si no hay contingencia
      ...(valores.trabajador === "gestor"
        ? { Contacto: "Tipo de contacto" } // GESTOR: Siempre pide contacto
        : contingencia
        ? {}
        : { Contacto: "Tipo de contacto" }), // TÉCNICO: Solo si no hay contingencia

      // Fecha y Franja: Lógica diferente según el tipo de trabajador
      ...(valores.trabajador === "gestor"
        ? // GESTOR: Solo pedir fecha si hay contacto exitoso (contacto === "2")
          contacto === "2"
          ? { Fecha: "Fecha de agenda", Franja: "Franja horaria" }
          : {}
        : // TÉCNICO: Lógica original (fecha siempre EXCEPTO si Aceptains O sus están marcados)
        !valores.aceptaInstalar && !valores.suspenderOrden
        ? { Fecha: "Fecha de agenda", Franja: "Franja horaria" }
        : {}),
    },
    2: {
      // Quiebre
      NumTitular: "Número de teléfono del titular",
      NomTitular: "Nombre del titular",
      ...(contingencia ? {} : { Contacto: "Tipo de contacto" }),
      mQuiebre: "Motivo de quiebre",
    },
    3: {
      // ✅ SOPORTE NO APLICA
      noSoporte: "Tipo de soporte",
    },
    4: {
      // Gestión decos
      NumTitular: "Número de teléfono del titular",
      NomTitular: "Nombre del titular",
      ...(contingencia ? {} : { Contacto: "Tipo de contacto" }),
    },
    5: {
      // Dirección piloto
      resultado: "Dirección de recibo",
      direccionSistema: "Dirección del sistema",
    },
    6: {
      // Llamada caída
    },
  };

  // Validar campos del motivo actual
  const camposRequeridos = camposPorMotivo[motivoLlamada] || {};
  Object.entries(camposRequeridos).forEach(([campo, descripcion]) => {
    const elemento = document.getElementById(campo);
    if (
      !elemento ||
      !elemento.value ||
      elemento.value.trim() === "" ||
      elemento.value === "..."
    ) {
      errores.push(`❌ Falta: ${descripcion}`);
    }
  });

  // Validaciones condicionales específicas
  errores.push(
    ...validarCamposCondicionales(motivoLlamada, contingencia, valores)
  );

  return errores;
}

// ===========================================
// FUNCIÓN AUXILIAR PARA VALIDACIONES CONDICIONALES
// ===========================================

function validarCamposCondicionales(motivoLlamada, valores) {
  const errores = [];
  // Solo validar motivo del cliente si hay contacto exitoso y no hay contingencia
  if (valores.contacto === "2" && !valores.contingencia) {
    if (!valores.motivoCliente || valores.motivoCliente.trim() === "") {
      errores.push(
        "❌ Falta: Motivo del cliente (cuando hay contacto exitoso)"
      );
    }
  }

  // Validaciones específicas por motivo
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
        const jornada = valores.tipoJornada;
        if (!jornada || jornada === "") {
          errores.push("❌ Falta: Tipo de jornada (AM/PM)");
        }
      }
      // Validar motivo usuario para ciertos tipos de soporte
      const soportesConMotivo = ["11", "6", "13", "14", "3", "9", "4"];
      if (soportesConMotivo.includes(tipoSoporte)) {
        if (!valores.motivoCliente || valores.motivoCliente.trim() === "") {
          errores.push(
            "❌ Falta: Motivo del usuario (para este tipo de soporte)"
          );
        }
      }
      break;

    case "5": // Dirección piloto
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
// FUNCIÓN FALTANTE PARA VALIDAR CAMPOS REQUERIDOS
// ===========================================
function esRequeridoYVacio(campo, motivoLlamada, contacto) {
  const elemento = document.getElementById(campo);
  if (!elemento) return false;

  const valor = elemento.value;
  const estaVacio = !valor || valor.trim() === "" || valor === "...";

  if (!estaVacio) return false; // Si no está vacío, no necesita resaltado

  const contingencia = document.getElementById("Contingencia")?.checked;
  const clienteAgenda = document.getElementById("sus")?.checked;

  // Definir qué campos son requeridos según el motivo
  const camposPorMotivo = {
    0: {
      // ✅ INCUMPLIMIENTO
      NumTitular: true,
      NomTitular: true,
      // Solo requerir contacto si NO hay contingencia activa
      Contacto: !contingencia,
      // ✅ Fecha y Franja solo si NO hay contingencia Y hay contacto exitoso Y cliente agenda
      Fecha: !contingencia && contacto === "2" && clienteAgenda,
      Franja: !contingencia && contacto === "2" && clienteAgenda,
      // Musuario solo si hay contacto exitoso y no hay contingencia
      Musuario: contacto === "2" && !contingencia,
    },
    1: {
      // ✅ AGENDA
      NumTitular: true,
      NomTitular: true,
      Contacto: !contingencia,
      // ✅Fecha y Franja SIEMPRE se piden EXCEPTO si Aceptains O sus están marcados
      Fecha:
        !document.getElementById("Aceptains")?.checked &&
        !document.getElementById("sus")?.checked,
      Franja:
        !document.getElementById("Aceptains")?.checked &&
        !document.getElementById("sus")?.checked,
      Musuario: contacto === "2" && !contingencia,
    },
    2: {
      // Quiebre
      NumTitular: true,
      NomTitular: true,
      Contacto: !contingencia,
      mQuiebre: true,
      Musuario: contacto === "2" && !contingencia,
    },
    3: {
      // ✅ SOPORTE NO APLICA
      noSoporte: true,
      tipoJornada: document.getElementById("noSoporte")?.value === "7",
      Musuario: ["11", "6", "13", "14", "3", "9", "4"].includes(
        document.getElementById("noSoporte")?.value
      ),
    },
    4: {
      // Gestión decos
      NumTitular: true,
      NomTitular: true,
      Contacto: !contingencia,
      Musuario: contacto === "2" && !contingencia,
    },
    5: {
      // Dirección piloto
      direccionSistema: true,
      resultado: true,
    },
    6: {
      // Llamada caída
    },
  };

  // Obtener la configuración para el motivo actual
  const configuracion = camposPorMotivo[motivoLlamada] || {};

  // Verificar si este campo es requerido según la configuración
  return configuracion[campo] === true;
}
// ===========================================
// RESALTADO VISUAL DE CAMPOS FALTANTES
// ===========================================

function agregarEventListenersParaResaltado() {
  // Lista de todos los campos que pueden ser resaltados
  const camposParaMonitorear = [
    "NumTitular",
    "NomTitular",
    "Contacto",
    "Fecha",
    "Franja",
    "mQuiebre",
    "noSoporte",
    "direccionSistema",
    "resultado",
    "Musuario",
    "tipoJornada",
  ];

  camposParaMonitorear.forEach((campoId) => {
    const campo = document.getElementById(campoId);
    if (campo) {
      // Para inputs de texto, textarea, y selects
      campo.addEventListener("input", () => quitarResaltadoCampo(campo));
      campo.addEventListener("change", () => quitarResaltadoCampo(campo));
      campo.addEventListener("keydown", () => quitarResaltadoCampo(campo));

      // Para selects específicamente (cuando cambia la selección)
      if (campo.tagName === "SELECT") {
        campo.addEventListener("focus", () => {
          // Quitar resaltado inmediatamente al hacer focus en un select
          if (campo.classList.contains("campo-faltante")) {
            quitarResaltadoCampo(campo);
          }
        });
      }
    }
  });
}

function quitarResaltadoCampo(campo) {
  if (campo.classList.contains("campo-faltante")) {
    campo.classList.remove("campo-faltante", "primer-faltante");

    // Agregar efecto visual de "completado" brevemente
    campo.classList.add("campo-completado");
    setTimeout(() => {
      campo.classList.remove("campo-completado");
    }, 1500);
  }
}

function resaltarCamposFaltantes() {
  // Primero limpiar todos los resaltados anteriores
  document.querySelectorAll(".campo-faltante").forEach((el) => {
    el.classList.remove("campo-faltante", "primer-faltante");
  });

  // Obtener los errores actuales
  const errores = validarAntesDeCopirarNota();

  if (errores.length === 0) return; // Si no hay errores, no resaltar nada

  const motivoLlamada = document.getElementById("Motivo").value;
  const contacto = document.getElementById("Contacto")?.value;

  // Lista de todos los campos que podrían necesitar resaltado
  const camposParaRevisar = [
    "NumTitular",
    "NomTitular",
    "Contacto",
    "Fecha",
    "Franja",
    "mQuiebre",
    "noSoporte",
    "direccionSistema",
    "resultado",
    "Musuario",
    "tipoJornada",
  ];

  let primerCampoEncontrado = false;

  // Resaltar campos que están vacíos y son requeridos
  camposParaRevisar.forEach((campo) => {
    const elemento = document.getElementById(campo);
    if (elemento && esRequeridoYVacio(campo, motivoLlamada, contacto)) {
      elemento.classList.add("campo-faltante");

      // Hacer scroll suave al primer campo faltante
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

function copiarNotaConValidacion() {
  const errores = validarAntesDeCopirarNota();

  if (errores.length > 0) {
    // Resaltar campos faltantes
    resaltarCamposFaltantes();

    // Mostrar errores con mejor formato
    const mensajeHTML = `
      <div style="text-align: left; max-height: 300px; overflow-y: auto;">
        <p><strong>🚫 No se puede copiar la nota.</strong></p>
        <p>Por favor complete los siguientes campos:</p>
        <ul style="list-style: none; padding-left: 0;">
          ${errores
            .map(
              (error) =>
                `<li style="margin: 5px 0; color: #d63031;">${error}</li>`
            )
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

    return false;
  }

  // Si no hay errores, limpiar resaltados y copiar
  limpiarResaltados();

  const textoNota = document.getElementById("textoNota").value;
  copiarYAlertar(textoNota, alerta);
  return true;
}

// ===========================================
// FUNCIÓN PARA LIMPIAR RESALTADOS MEJORADA
// ===========================================

function limpiarResaltados() {
  // Quitar todas las clases de resaltado con transición suave
  document
    .querySelectorAll(".campo-faltante, .campo-completado, .primer-faltante")
    .forEach((el) => {
      el.classList.remove(
        "campo-faltante",
        "campo-completado",
        "primer-faltante"
      );
    });
}

// ===========================================
// INICIALIZACIÓN AUTOMÁTICA MEJORADA
// ===========================================

// Función para inicializar todo el sistema de resaltado
function inicializarSistemaResaltado() {
  agregarEventListenersParaResaltado();
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    inicializarSistemaResaltado();
  }, 100);
});

// También en window.onload por si acaso
window.addEventListener("load", function () {
  inicializarSistemaResaltado();
});

// Aplicar limpieza automática al input direccionSistema
document.addEventListener("DOMContentLoaded", function () {
  const direccionSistema = document.getElementById("direccionSistema");

  function aplicarLimpieza() {
    const textoOriginal = direccionSistema.value;
    const textoLimpio = limpiarTexto(textoOriginal);

    // Solo actualizar si el texto cambió para evitar bucles infinitos
    if (textoOriginal !== textoLimpio) {
      // Guardar la posición del cursor
      const cursorPos = direccionSistema.selectionStart;
      direccionSistema.value = textoLimpio;

      // Restaurar posición del cursor (aproximada)
      const nuevaPos = Math.min(cursorPos, textoLimpio.length);
      direccionSistema.setSelectionRange(nuevaPos, nuevaPos);
    }
  }

  // Aplicar limpieza al pegar
  direccionSistema.addEventListener("paste", function (e) {
    setTimeout(aplicarLimpieza, 0);
  });

  // Aplicar limpieza al escribir
  direccionSistema.addEventListener("input", aplicarLimpieza);
});

window.autoResize = autoResize;
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
