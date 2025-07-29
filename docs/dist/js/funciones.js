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
    btnModificar: anularActualizartodo,
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

  // ✨ NUEVA LÍNEA - Limpiar resaltados
  limpiarResaltados();
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

function formatoOracion(texto) {
  return texto
    .toLowerCase()
    .replace(
      /(^|\.\s+)([a-záéíóúüñ])/g,
      (match, p1, p2) => p1 + p2.toUpperCase()
    );
}

// ===========================================
// FUNCIONES DE DIRECCIÓN
// ===========================================

function concatenateInputs() {
  // Si el checkbox está marcado, no hacer concatenación automática
  const checkbox = document.getElementById("direccionNoLegible");
  if (checkbox && checkbox.checked) {
    return;
  }
  
  const via = document.getElementById("via").value || "";
  const cruce = document.getElementById("cruce").value || "";
  const placa = document.getElementById("placa").value || "";
  const complemento = document.getElementById("complemento").value || "";

  const parts = [via, cruce, placa, complemento].filter(
    (part) => part.trim() !== ""
  );
  const result = "en recibo publico esta " + parts.join(" ");

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

function actualizarNota(event) {
  return true;
}

function Actualizartodo() {
  const formulario = document.querySelector("#Formulario");
  formulario.addEventListener("input", (event) => {
    actualizarNotaCompleta();
  });
}

function anularActualizartodo() {
  document
    .querySelector("#Formulario")
    .removeEventListener("input", actualizarNota);
  document.getElementById("textoNota").focus();
}

// ===========================================
// FUNCIONES DE DOM
// ===========================================

function visualizarPantalla(selectors, displayValue) {
  selectors.forEach((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      element.style.display = displayValue;
    } else {
      console.warn(`Elemento no encontrado para el selector: ${selector}`);
    }
  });
}

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
  inicializarCheckboxDireccionNoLegible(); 
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
    resultDiv.value = "direccion recibo";
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
  "NomAgent",
  "Agent",
  "direccionSistema",
  "resultado",
  "DRP"
];

const campos = {};
ids.forEach((id) => {
  campos[id] = document.getElementById(id);
});

function obtenerValoresFormulario() {
  return {
    motivoLlamada: campos.Motivo.value,
    motivoTecnico: campos.Mtecnico,
    numeroTitular: campos.NumTitular.value,
    nombreTitular: campos.NomTitular.value,
    contingenciaActiva: campos.Contingencia.checked,
    aLaEsperadeInstalacion: campos.Aceptains.checked,
    aceptarRecibo: campos.aceptarRecibo.checked,
    trabajador: campos.rol.value,
    contactoConTitular: campos.Contacto.value,
    motivoQuiebre: campos.mQuiebre.value,
    motivoCliente: campos.Musuario.value,
    fecha: campos.Fecha.value,
    franjaAgenda: campos.Franja.value,
    gpsActivo: campos.gps.value,
    soporteFotografico: campos.SF.value,
    fallaChatbot: campos.FC.checked,
    suspenderOrden: campos.sus.checked,
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
    texto: `LINEA RESCATE Se comunica ${valores.trabajador} informando que ${valores.motivoTecnico.value} `,
  };
}

function procesarCasoIncumplimiento(valores, textos) {
  let notaGenerada = "";
  let mensajeChatbot = "";
  const textoSinContacto = obtenerTextoSinContacto(valores.contactoConTitular);
  let texto = textos.texto + mensajeChatbot + ` ${textos.titularContacto} `;

  if (valores.trabajador === "técnico") {
    mensajeChatbot = valores.fallaChatbot
      ? "Se valida soporte por falla reportada en chatbot"
      : "Se valida chatbot ok.";

    if (valores.contingenciaActiva) {
      valores.contactoConTitular = "...";
      notaGenerada = "POR CONTINGENCIA se deja orden pendiente en aplicativos";
    } else {
      if (esSinContacto(valores.contactoConTitular)) {
        notaGenerada = `${textoSinContacto}, Se Valida GPS ${valores.gpsActivo} Se Valida SOPORTE FOTOGRÁFICO ${valores.soporteFotografico}`;
        if (valores.gpsActivo === "OK" && valores.soporteFotografico === "OK") {
          notaGenerada +=
            " Se deja orden pendiente en aplicativos por no contacto con cliente";
        } else {
          notaGenerada +=
            " Se le indica a técnico dirigirse al predio y Subir Soporte fotográfico";
        }
      } else if (valores.contactoConTitular === "2") {
        notaGenerada += ` contesta e indica que ${valores.motivoCliente}`;
        if (valores.aLaEsperadeInstalacion) {
          notaGenerada +=
            " indica que esta a la espera de instalación, valida datos correctos";
        } else if (!valores.suspenderOrden) {
          notaGenerada += "se deja orden pendiente por agendar";
        } else {
          notaGenerada += ` se reagenda para ${textos.fechaFormateada} En la franja ${valores.franjaAgenda}`;
        }
      }
    }
  }
  return texto + notaGenerada;
}

// Función para procesar caso de agenda
function procesarCasoAgenda(valores, textos) {
  let notaGenerada = "";
  let mensajeChatbot = "";
  const textoSinContacto = obtenerTextoSinContacto(valores.contactoConTitular);
  const agendaNota = ` se reagenda orden para el dia ${textos.fechaFormateada} en la franja ${valores.franjaAgenda} segun indicación de técnico.`;

  if (valores.trabajador === "técnico") {
    mensajeChatbot = valores.fallaChatbot
      ? "Se valida soporte por falla reportada en chatbot"
      : "Se valida chatbot ok.";

    if (valores.contingenciaActiva) {
      valores.contactoConTitular = "...";
      notaGenerada = valores.suspenderOrden
        ? "POR CONTINGENCIA se deja orden pendiente en aplicativos."
        : ` POR CONTINGENCIA ${agendaNota}`;
    }
  }

  let texto =
    textos.texto +
    mensajeChatbot +
    ` ${textos.titularContacto} ${valores.motivoCliente} `;

  if (esSinContacto(valores.contactoConTitular)) {
    if (valores.trabajador === "gestor") {
      notaGenerada = `${textoSinContacto} se le indica a gestor que intente mas tarde para proceder con la gestión.`;
    } else {
      notaGenerada = `${textoSinContacto}, Se Valida GPS ${valores.gpsActivo} Se Valida SOPORTE FOTOGRÁFICO ${valores.soporteFotografico}`;

      if (valores.gpsActivo === "OK" && valores.soporteFotografico === "OK") {
        notaGenerada += valores.suspenderOrden
          ? " Se deja orden pendiente por reagendar."
          : agendaNota;
      } else {
        notaGenerada +=
          " Se le indica a técnico dirigirse al predio y Subir Soporte fotográfico.";
      }
    }
  } else if (valores.contactoConTitular === "2") {
    if (valores.aLaEsperadeInstalacion) {
      notaGenerada =
        "indica que esta a la espera de instalación, valida datos correctos.";
    } else if (valores.suspenderOrden) {
      notaGenerada = "se deja orden pendiente por agendar.";
    } else {
      notaGenerada = ` se reagenda para ${textos.fechaFormateada} En la franja ${valores.franjaAgenda}`;
    }
  }

  return texto + notaGenerada;
}

// Función para procesar caso de quiebre
function procesarCasoQuiebre(valores, textos) {
  const textoSinContacto = obtenerTextoSinContacto(valores.contactoConTitular);
  let notaGenerada = "";
  let mensajeChatbot = "";
  let prefijoQC = ""; // Para manejar el prefijo QC al inicio

  if (valores.trabajador === "técnico") {
    mensajeChatbot = valores.fallaChatbot
      ? " Se valida soporte por falla reportada en chatbot."
      : " Se valida chatbot ok.";

    if (valores.contingenciaActiva) {
      valores.contactoConTitular = "...";
      notaGenerada =
        " POR CONTINGENCIA se deja orden suspendida en aplicativos";
    } else {
      if (
        esSinContacto(valores.contactoConTitular) ||
        valores.contactoConTitular === "..."
      ) {
        if (valores.trabajador === "gestor") {
          notaGenerada = ` ${textoSinContacto} se le indica a gestor que intente mas tarde para proceder con la gestión.`;
        } else {
          if (
            valores.gpsActivo === "OK" &&
            valores.soporteFotografico === "OK"
          ) {
            // QC y motivo van al inicio
            prefijoQC = `QC - ${valores.motivoQuiebre} - `;
            notaGenerada = `${textoSinContacto}. Se valida SOPORTE FOTOGRÁFICO ${valores.soporteFotografico}. Se valida GPS ${valores.gpsActivo}. Se deja orden suspendida en aplicativos.`;
          } else {
            notaGenerada = ` ${textoSinContacto}. Se valida GPS ${valores.gpsActivo}. Se valida SOPORTE FOTOGRÁFICO ${valores.soporteFotografico}. Se le indica al técnico dirigirse al predio y subir soporte fotográfico.`;
          }
        }
      } else if (valores.contactoConTitular === "2") {
        const motivosEspeciales = [
          "TELÉFONO DEL CLIENTE ERRADO",
          "GESTIÓN COMERCIAL/CLIENTE ACEPTA INSTALACIÓN",
          "GESTIÓN COMERCIAL/CLIENTE SOLICITA LLAMAR EN 10 MIN",
        ];

        if (
          valores.aLaEsperadeInstalacion ||
          motivosEspeciales.includes(valores.motivoQuiebre)
        ) {
          return procesarMotivoEspecial(valores, textos);
        } else {
          // QC y motivo van al inicio
          prefijoQC = `QC - ${valores.motivoQuiebre} - `;
          notaGenerada = valores.suspenderOrden
            ? `${valores.motivoCliente}. Se deja orden suspendida en aplicativos.`
            : `${valores.motivoCliente}. Se hace objeción pero desiste, valida datos, se procede a quebrar orden.`;
        }
      }
    }
  }

  let textoFinal;
  if (prefijoQC) {
    // Si hay prefijo QC, restructurar completamente la oración
    textoFinal = `${prefijoQC}${textos.texto}${mensajeChatbot} ${textos.titularContacto} ${notaGenerada}`;
  } else {
    // Si no hay prefijo QC, usar la estructura normal
    textoFinal = `${textos.texto}${mensajeChatbot} ${textos.titularContacto} ${notaGenerada}`;
  }

  return textoFinal;
}
// Función auxiliar para procesar motivos especiales en quiebre
function procesarMotivoEspecial(valores, textos) {
  const mensajeChatbot = valores.fallaChatbot
    ? " Se valida soporte por falla reportada en chatbot."
    : " Se valida chatbot ok.";

  const textoBase =
    textos.texto + mensajeChatbot + ` ${textos.titularContacto} `;

  if (
    valores.aLaEsperadeInstalacion ||
    valores.motivoQuiebre === "GESTIÓN COMERCIAL/CLIENTE ACEPTA INSTALACIÓN"
  ) {
    const motivoTexto =
      valores.motivoCliente && valores.motivoCliente.trim() !== ""
        ? valores.motivoCliente
        : "contesta";

    return (
      textoBase +
      `${motivoTexto}. Se hace objeción, acepta instalación y valida datos correctos.`
    );
  }

  if (
    valores.motivoQuiebre ===
    "GESTIÓN COMERCIAL/CLIENTE SOLICITA LLAMAR EN 10 MIN"
  ) {
    return (
      textoBase +
      `${valores.motivoCliente}. Solicita que lo llamen en 10 minutos.`
    );
  }

  if (valores.motivoQuiebre === "TELÉFONO DEL CLIENTE ERRADO") {
    if (valores.trabajador === "gestor") {
      return `QC -${textoBase} ${valores.motivoCliente}. ${valores.motivoQuiebre} - Se indica que debe enviar técnico a predio para poder suspender la orden.`;
    } else {
      return `QC -${textoBase}  ${valores.motivoCliente}.  ${valores.motivoQuiebre} - Se valida SOPORTE FOTOGRÁFICO OK, se valida GPS OK, se procede a suspender orden.`;
    }
  }

  return textoBase;
}

// Función para procesar caso de soporte no aplica
function procesarCasoSoporteNoAplica(valores, textos) {
  const soporteNoAplica = document.querySelector("#noSoporte").value;
  const tipoJornada = document.querySelector("#tipoJornada")?.value || null;
  const mensajesCaso7 = {
    AM: ", se valida orden se encuentra en franja AM se le indica que en linea rescate solo gestionamos ordenes en AM máximo hasta las 1 pm, se le indica a técnico validar con su gestor",
    PM: ", se valida y orden esta en PM se indica que ordenes pm solo se pueden atender despues de medio dia, se le indica a técnico validar con su gestor",
  };

  const mensajes = {
    1: "Se valida que el técnico no ha realizado el proceso en el chatbot. Se le indica que debe completarlo antes de comunicarse con la línea y, en caso de falla, reportarlo con su gestor para que sea escalado a Centro Comando. Se brinda ticket.",

    2: "Se valida que el técnico no ha esperado respuesta del chatbot. Se le recuerdan los parámetros del aplicativo que debe tener en cuenta antes de comunicarse con la línea. Si persiste el error, debe reportarlo a Centro Comando. Se brinda ticket.",

    3: "Se entrega ticket.",

    4: `${textos.titularContacto} contesta ${valores.motivoCliente}. Se le informa que en Línea de Rescate no se gestionan órdenes por falta de materiales. Debe realizar autogestión o comunicarse con su gestor.`,

    5: `${textos.titularContacto} contesta ${valores.motivoCliente}. Se le indica que esta gestión no se realiza a través de Línea de Rescate. Debe validar con su gestor o con cierre controlado.`,

    6: `${textos.titularContacto} contesta ${valores.motivoCliente}. Se le informa que en caso de lluvias, la gestión debe realizarla a través de su gestor o mediante autogestión, ya que no se gestiona por Línea de Rescate.`,

    7: mensajesCaso7[tipoJornada],

    8: "Se valida que la orden se encuentra en otro estado. Se le informa al técnico que no es posible gestionarla desde Línea de Rescate y debe validarlo con su gestor.",

    9: `${textos.titularContacto} contesta ${valores.motivoCliente}. Se le indica que si no puede llegar al predio, debe gestionar con su gestor o realizar autogestión, ya que no se atiende por Línea de Rescate.`,

    10: "Se le informa que debe comunicarse con su gestor o realizar autogestión, ya que este tipo de gestión no se realiza por Línea de Rescate.",

    11: `${textos.titularContacto} contesta ${valores.motivoCliente}. Se le indica que este proceso no se realiza por Línea de Rescate y debe gestionarlo con su gestor o con cierre controlado.`,

    12: "Se valida que la orden está programada en franja AM. Se informa que el cambio de franja solo puede realizarse hasta las 12:00 p.m. desde Línea de Rescate. Se le sugiere hacer autogestión o contactar a su gestor.",

    13: `${textos.titularContacto} contesta ${valores.motivoCliente}. Se le indica que debe hacer autogestión debido a dirección errada.`,

    14: `${textos.titularContacto} ${valores.motivoCliente}. Se solicita la baja de perfil en Speedy.`,

    15: "Se valida que la orden corresponde a una avería. Se informa que este tipo de gestiones no se realizan por Línea de Rescate y debe comunicarse con su gestor o cierre controlado.",

    16: "Se indica que en Línea de Rescate no se gestiona el caso cuando el cliente ya no desea el traslado porque permanece en el mismo predio y no lo necesita. Debe comunicarse con su gestor o realizar autogestión.",
  };

  return textos.texto + mensajes[soporteNoAplica];
}

// Función para procesar caso de gestión de decos
function procesarCasoGestionDecos(valores, textos) {
  const textoSinContacto = obtenerTextoSinContacto(valores.contactoConTitular);
  const mensajeChatbot = valores.fallaChatbot
    ? ", se valida soporte por falla reportada en chatbot"
    : ", se valida chatbot ok.";

  let texto =
    textos.texto +
    mensajeChatbot +
    ` ${textos.titularContacto} ${valores.motivoCliente}`;

  if (valores.contactoConTitular === "2") {
    texto += " se valida datos correctos y se actualiza TAG de equipos";
  } else if (esSinContacto(valores.contactoConTitular)) {
    texto += ` ${textoSinContacto} se indica a técnico que le diga al titular que este pendiente de la llamada e intente nuevamente`;
  }

  return texto;
}

// Función para procesar caso de dirección piloto
function procesarCasoDireccionPiloto(valores, textos) {
  /* // Verificar si la dirección no es legible
  const direccionNoLegible = document.getElementById("direccionNoLegible");
  
  if (direccionNoLegible && direccionNoLegible.checked) {
    // ✅ CASO: DIRECCIÓN NO LEGIBLE
    const textoNoLegible = valores.direcionenRecibo || "DIRECCION NO ES LEGIBLE";
    return textos.texto + ` ${textoNoLegible}, por lo cual NO se acepta el recibo público`;
  } */
  
  // ✅ CASO: DIRECCIÓN LEGIBLE
  // Determinar respuesta según si acepta o no el recibo
  
  let respuesta = "";
if (valores.aceptarRecibo) {
  respuesta = "SI se da aceptación al recibo publico";
} else if (valores.direccionNoLegible) {
  respuesta = "NO se acepta el recibo público porque la dirección no es legible";
} else {
  respuesta = "";
}
  
  let sistema = (valores.direccionAgendador && `y en sistema está ${valores.direccionAgendador}`) 
  || "";

return (
  textos.texto +
  ` ${valores.direcionenRecibo || ""} ${sistema} ${respuesta}`
);
}


// Función principal
function crearNota() {
  const valores = obtenerValoresFormulario();
  const textos = generarTextosBase(valores);
  const textoNota = document.getElementById("textoNota");
  let textoFinal = "";

  switch (valores.motivoLlamada) {
    case "0": // incumplimiento
      textoFinal = procesarCasoIncumplimiento(valores, textos);
      break;
    case "1": // agendar
      textoFinal = procesarCasoAgenda(valores, textos);
      break;
    case "2": // quiebre
      textoFinal = procesarCasoQuiebre(valores, textos);
      break;
    case "3": // soporte no aplica
      textoFinal = procesarCasoSoporteNoAplica(valores, textos);
      break;
    case "4": // Gestión de decos
      textoFinal = procesarCasoGestionDecos(valores, textos);
      break;
    case "5": // Dirección piloto
      textoFinal = procesarCasoDireccionPiloto(valores, textos);
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

  // Procesar el texto con la función de Nota Aplicativos
  if (typeof procesarTextoNotaAplicativos === "function") {
    textoFinal = procesarTextoNotaAplicativos(textoFinal);
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

// Función para obtener valores del formulario para manejarCambio
function obtenerValoresManejarCambio() {
  return {
    mLlamada: document.querySelector("#Motivo").value,
    soporteNA: document.querySelector("#noSoporte").value,
    contacto: document.querySelector("#Contacto").value,
    trabajador: document.querySelector("#rol").value,
    contingencia: document.getElementById("Contingencia").checked,
    aceptaInstalar: document.getElementById("Aceptains").checked,
    aceptarRecibo: document.getElementById("aceptarRecibo").checked,
    suspender: document.getElementById("sus").checked,
    direccionNoLegible : document.getElementById("direccionNoLegible").checked
  };
}
function manejarCasoIncumplimiento(valores) {
  cambiarColorFondo("#0314f8ff");

  // Elementos que SIEMPRE se muestran en incumplimiento
  const elementosBaseIncumplimiento = {
    block: ["#contingencia", "#contacto", "#contacto1", "#MotivoTec"],
    flex: ["#fallaChatbot", "#Titular"],
  };

  toggleElementStat("Contacto", false);

  if (valores.trabajador === "técnico") {
    if (valores.contingencia) {
      // SOLO cuando contingencia está ACTIVA, bloquear el select
      toggleElementStat("Contacto", true);
      mostrarSoloElementos(
        {
          flex: ["#notaAplicativos"],
        },
        elementosBaseIncumplimiento
      );
    } else {
      toggleElementStat("Contacto", false);

      if (valores.contacto === "...") {
        mostrarSoloElementos(elementosBaseIncumplimiento);
      } else if (esSinContacto(valores.contacto)) {
        mostrarSoloElementos(
          {
            flex: ["#GPS"],
          },
          elementosBaseIncumplimiento
        );
      } else {
        if (!valores.suspender && !valores.aceptaInstalar) {
          mostrarSoloElementos(
            {
              block: ["#Musuariod"],
              flex: ["#suspender", "#Acepta"],
            },
            elementosBaseIncumplimiento
          );
        } else if (valores.suspender && !valores.aceptaInstalar) {
          mostrarSoloElementos(
            {
              block: ["#Musuariod", "#fecha"],
              flex: ["#suspender"],
            },
            elementosBaseIncumplimiento
          );
        } else if (!valores.suspender && valores.aceptaInstalar) {
          mostrarSoloElementos(
            {
              block: ["#Musuariod"],
              flex: ["#Acepta"],
            },
            elementosBaseIncumplimiento
          );
        }
      }
    }
  } else {
    // Si no es técnico, bloquear pero con mensaje
    toggleElementStat("Contacto", true);
    alert(
      `No se puede gestionar incumplimiento desde el rol ${valores.trabajador}`,
      2
    );
    return;
  }

  ValueMostrar(
    "#Mtecnico",
    "se encuentra en predio y no logra contacto con cliente,  "
  );
}

// Función para manejar caso agendamiento en manejarCambio
function manejarCasoAgenda(valores) {
  cambiarColorFondo("#2d8215");

  // Elementos que SIEMPRE se muestran en agenda
  const elementosBaseAgenda = {
    block: ["#contingencia", "#contacto", "#contacto1"],
    flex: ["#fallaChatbot", "#Titular"],
  };

  toggleElementStat("Contacto", false);

  if (
    valores.trabajador === "gestor" &&
    (valores.contacto === "..." || esSinContacto(valores.contacto))
  ) {
    mostrarSoloElementos(
      {
        block: ["#MotivoTec"],
      },
      elementosBaseAgenda
    );
  } else if (
    esSinContacto(valores.contacto) &&
    valores.trabajador === "técnico" &&
    !valores.contingencia
  ) {
    mostrarSoloElementos(
      {
        block: ["#MotivoTec", "#fecha"],
        flex: ["#GPS", "#suspender"],
      },
      elementosBaseAgenda
    );

    // Reordenar elementos GPS y fecha
    const primerElemento = document.querySelector("GPS");
    const segundoElemento = document.querySelector("fecha");
    ordenarElementos(primerElemento, segundoElemento);

    if (valores.suspender) {
      mostrarSoloElementos(
        {
          block: ["#MotivoTec"],
          flex: ["#GPS", "#suspender"],
        },
        elementosBaseAgenda
      );
    }
  } else if (valores.contacto === "2" && !valores.contingencia) {
    if (valores.aceptaInstalar && !valores.suspender) {
      mostrarSoloElementos(
        {
          flex: ["#Acepta"],
          block: ["#MotivoTec", "#Musuariod"],
        },
        elementosBaseAgenda
      );
    } else if (!valores.aceptaInstalar && valores.suspender) {
      mostrarSoloElementos(
        {
          block: ["#MotivoTec", "#Musuariod"],
          flex: ["#suspender"],
        },
        elementosBaseAgenda
      );
    } else {
      mostrarSoloElementos(
        {
          flex: ["#suspender", "#Acepta"],
          block: ["#MotivoTec", "#Musuariod", "#fecha"],
        },
        elementosBaseAgenda
      );
    }
  } else if (valores.contingencia) {
    // SOLO cuando contingencia está ACTIVA, bloquear el select
    toggleElementStat("Contacto", true);

    if (valores.contacto !== "1") {
      mostrarSoloElementos(
        {
          block: ["#MotivoTec", "#fecha"],
          flex: ["#suspender", "#notaAplicativos"],
        },
        elementosBaseAgenda
      );

      if (valores.suspender) {
        mostrarSoloElementos(
          {
            block: ["#MotivoTec"],
            flex: ["#suspender", "#notaAplicativos"],
          },
          elementosBaseAgenda
        );
      }
    } else {
      mostrarSoloElementos(
        {
          block: ["#MotivoTec"],
        },
        elementosBaseAgenda
      );
    }
  } else {
    mostrarSoloElementos(
      {
        block: ["#MotivoTec"],
      },
      elementosBaseAgenda
    );
    toggleElementStat("Contacto", false);
  }

  ValueMostrar("#Mtecnico", "titular solicita agendar la orden para el día ");
}

// Función para manejar caso quiebre en manejarCambio
function manejarCasoQuiebre(valores) {
  cambiarColorFondo("#dc4c4c");

  // Elementos que SIEMPRE se muestran en quiebre
  const elementosBaseQuiebre = {
    block: ["#contingencia", "#contacto", "#contacto1"],
    flex: ["#Titular", "#fallaChatbot"],
  };

  toggleElementStat("Contacto", false);

  if (
    valores.trabajador === "gestor" &&
    (valores.contacto === "..." || esSinContacto(valores.contacto))
  ) {
    mostrarSoloElementos(
      {
        block: ["#MotivoTec"],
      },
      elementosBaseQuiebre
    );
  } else if (
    valores.trabajador === "técnico" &&
    esSinContacto(valores.contacto) &&
    !valores.contingencia
  ) {
    mostrarSoloElementos(
      {
        block: ["#MoQuiebre", "#MotivoTec"],
        flex: ["#GPS"],
      },
      elementosBaseQuiebre
    );
  } else if (valores.contacto === "2" && !valores.contingencia) {
    mostrarSoloElementos(
      {
        block: ["#MotivoTec", "#Musuariod", "#MoQuiebre"],
        flex: ["#suspender", "#Acepta"],
      },
      elementosBaseQuiebre
    );
    ordenarElementos(
      document.querySelector("#contacto", "#contacto1"),
      document.querySelector("#Musuariod")
    );
  } else if (valores.contingencia) {
    // SOLO cuando contingencia está ACTIVA, bloquear el select
    toggleElementStat("Contacto", true);
    mostrarSoloElementos(
      {
        block: ["#MotivoTec", "#MoQuiebre",],
        flex: ["#notaAplicativos"],
      },
      elementosBaseQuiebre
    );
  } else {
    mostrarSoloElementos(
      {
        block: ["#MotivoTec",],
      },
      elementosBaseQuiebre
    );
    toggleElementStat("Contacto", false);
  }

  ValueMostrar("#Mtecnico", "titular desea cancelar el servicio por ");
}

// Función para manejar caso soporte no aplica en manejarCambio
function manejarCasoSoporteNoAplica(valores) {
  cambiarColorFondo("#F18F13");

  const soportesConTitular = ["11", "6", "13", "14", "3", "9", "4", "16"];

  if (soportesConTitular.includes(valores.soporteNA)) {
    mostrarSoloElementos({
      block: ["#MotivoTec", "#Musuariod", "#Soporte"],
      flex: ["#Titular"],
    });
  } else {
    mostrarSoloElementos({
      block: ["#MotivoTec", "#Soporte"],
    });
    if (valores.soporteNA === "7") {
      mostrarSoloElementos({
        block: ["#MotivoTec", "#Soporte"],
        flex: ["#jornadaSelect"],
      });
    }
  }

  ValueMostrar("#Mtecnico", "");
}

function manejarCasoDecos(valores) {
  const elementosBaseDecos = {
    block: ["#MotivoTec", "#contacto", "#contacto1"],
    flex: ["#Titular", "#fallaChatbot"],
  };
  cambiarColorFondo("#00ccfe");
  mostrarSoloElementos(elementosBaseDecos);
  if (valores.contacto === "2") {
    mostrarSoloElementos(
      {
        block: ["#Musuariod"],
      },
      elementosBaseDecos
    );
  }
  ValueMostrar(
    "#Mtecnico",
    "titular solicita adicionar un decodificador a la orden para un total de "
  );
}
// duncion direcion piloto
function manejarCasoDireccionPiloto(valores) {
  // Configuración visual inicial
  cambiarColorFondo("#c3c3c3");
  setInnerHTML("#labelAcepta", "ACEPTAR RECIBO");
  const elemntosBasePiloto= {
     block: ["#MotivoTec", "#DRP"],
     flex : [ "#seccionDireccionSistema",]
  }
  mostrarSoloElementos(elemntosBasePiloto
   );

  // Mostrar/ocultar campos según si acepta el recibo
  if (!valores.aceptarRecibo) {
    setInnerHTML("#TMusuario", "NO SE ACEPTA PORQUE?");
  }

  if (valores.direccionNoLegible) {
    mostrarSoloElementos( elemntosBasePiloto
      
      /* {
      block: ["#MotivoTec", "#Musuariod"],
       flex : [ "#seccionDireccionSistema",]
    } */);
  }

  ValueMostrar(
    "#Mtecnico",
    "requieren corrección en la dirección, "
  );
}

// Función principal para manejarCambio
function manejarCambio(e) {
  Actualizartodo();
  setInnerHTML("#TMusuario", "MOTIVO USUARIO");
  setInnerHTML("#labelAcepta", "CLIENTE ACEPTA INSTALAR");
  setInnerHTML("#labelSuspender", "SUSPENDER ORDEN");

  const valores = obtenerValoresManejarCambio();

  if (Actualizartodo) {
    switch (valores.mLlamada) {
      case "0": // incumplimiento
        manejarCasoIncumplimiento(valores);
        setInnerHTML("#labelAcepta", "CLIENTE A LA ESPERA");
        setInnerHTML("#labelSuspender", "AGENDAR");
        break;
      case "1": // agendar
        manejarCasoAgenda(valores);
        break;
      case "2": // quiebres
        manejarCasoQuiebre(valores);
        break;
      case "3": // soporte no aplica
        manejarCasoSoporteNoAplica(valores);
        break;
      case "4": // Gestión decos
        manejarCasoDecos(valores);
        break;
      case "5": // Gestión piloto
        manejarCasoDireccionPiloto(valores)
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
    }
  }

  crearNota();
}

// Función para procesar el texto y eliminar "POR CONTINGENCIA" y "se marca al número"
function procesarTextoNotaAplicativos(texto) {
  const checkbox = document.getElementById("notaApp");
  if (checkbox && checkbox.checked) {
    let cleanedText = texto.replace(/POR CONTINGENCIA/gi, "").trim();
    cleanedText = cleanedText.replace(/se marca al /gi, "").trim();

    // Limpiar espacios extras que puedan quedar
    return cleanedText.replace(/\s+/g, " ").trim();
  }
  return texto;
}

// ===========================================
// VALIDACIÓN PARA COPIAR NOTA
// ===========================================

function validarAntesDeCopirarNota() {
  const errores = [];
  const motivoLlamada = document.getElementById("Motivo").value;
  const contingenciaActiva = document.getElementById("Contingencia")?.checked;
  const contacto = document.getElementById("Contacto")?.value;
  const clienteAgenda = document.getElementById("sus")?.checked; // ✅ Agregado

  // Campos específicos según el motivo
  const camposPorMotivo = {
    0: {
      // ✅ INCUMPLIMIENTO CORREGIDO
      NumTitular: "Número de teléfono del titular",
      NomTitular: "Nombre del titular",
      // Solo validar contacto si NO hay contingencia activa
      ...(contingenciaActiva ? {} : { Contacto: "Tipo de contacto" }),
      // ✅ CORRECCIÓN: Fecha y Franja solo si NO hay contingencia Y contacto exitoso Y cliente agenda
      ...(!contingenciaActiva && contacto === "2" && clienteAgenda
        ? { 
            Fecha: "Fecha de agenda", 
            Franja: "Franja horaria" 
          }
        : {}),
      // Motivo usuario solo si hay contacto exitoso y no hay contingencia
      ...(!contingenciaActiva && contacto === "2"
        ? { Musuario: "Motivo del cliente" }
        : {}),
    },
    1: {
      // ✅ AGENDA CORREGIDO
      NumTitular: "Número de teléfono del titular",
      NomTitular: "Nombre del titular",
      ...(contingenciaActiva ? {} : { Contacto: "Tipo de contacto" }),
      // ✅ CORRECCIÓN: Fecha y Franja SIEMPRE se piden EXCEPTO si Aceptains O sus están marcados
      ...(!document.getElementById("Aceptains")?.checked && !document.getElementById("sus")?.checked
        ? { Fecha: "Fecha de agenda", Franja: "Franja horaria" }
        : {}),
    },
    2: {
      // Quiebre (sin cambios)
      NumTitular: "Número de teléfono del titular",
      NomTitular: "Nombre del titular",
      ...(contingenciaActiva ? {} : { Contacto: "Tipo de contacto" }),
      mQuiebre: "Motivo de quiebre",
    },
    3: {
      // ✅ SOPORTE NO APLICA CORREGIDO - NO se requiere nombre ni número de titular
      noSoporte: "Tipo de soporte",
    },
    4: {
      // Gestión decos (sin cambios)
      NumTitular: "Número de teléfono del titular",
      NomTitular: "Nombre del titular",
      ...(contingenciaActiva ? {} : { Contacto: "Tipo de contacto" }),
    },
    5: {
      // Dirección piloto (sin cambios)
      direccionSistema: "Dirección del sistema",
      resultado: "Dirección de recibo",
    },
    6: {
      // Llamada caída (sin cambios)
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
    ...validarCamposCondicionales(motivoLlamada, contingenciaActiva)
  );

  return errores;
}

// ===========================================
// FUNCIÓN AUXILIAR PARA VALIDACIONES CONDICIONALES
// ===========================================

function validarCamposCondicionales(motivoLlamada, contingenciaActiva) {
  const errores = [];
  const contacto = document.getElementById("Contacto")?.value;

  // Solo validar motivo del cliente si hay contacto exitoso y no hay contingencia
  if (contacto === "2" && !contingenciaActiva) {
    const motivoCliente = document.getElementById("Musuario")?.value;
    if (!motivoCliente || motivoCliente.trim() === "") {
      errores.push(
        "❌ Falta: Motivo del cliente (cuando hay contacto exitoso)"
      );
    }
  }

  // Validaciones específicas por motivo
  switch (motivoLlamada) {
    case "2": // Quiebre
      if (contacto === "2" && !contingenciaActiva) {
        const motivoQuiebre = document.getElementById("mQuiebre")?.value;
        if (!motivoQuiebre || motivoQuiebre === "...") {
          errores.push("❌ Falta: Motivo específico de quiebre");
        }
      }
      break;

    case "3": // Soporte no aplica
      const tipoSoporte = document.getElementById("noSoporte")?.value;
      // Validar jornada si es tipo 7
      if (tipoSoporte === "7") {
        const jornada = document.getElementById("tipoJornada")?.value;
        if (!jornada || jornada === "") {
          errores.push("❌ Falta: Tipo de jornada (AM/PM)");
        }
      }
      // Validar motivo usuario para ciertos tipos de soporte
      const soportesConMotivo = ["11", "6", "13", "14", "3", "9", "4"];
      if (soportesConMotivo.includes(tipoSoporte)) {
        const motivoUsuario = document.getElementById("Musuario")?.value;
        if (!motivoUsuario || motivoUsuario.trim() === "") {
          errores.push("❌ Falta: Motivo del usuario (para este tipo de soporte)");
        }
      }
      break;

    case "5": // Dirección piloto
      const aceptaRecibo = document.getElementById("aceptarRecibo")?.checked;
      if (!aceptaRecibo) {
        const motivoNoAcepta = document.getElementById("Musuario")?.value;
        if (!motivoNoAcepta || motivoNoAcepta.trim() === "") {
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

  const contingenciaActiva = document.getElementById("Contingencia")?.checked;
  const clienteAgenda = document.getElementById("sus")?.checked; // ✅ Agregado

  // Definir qué campos son requeridos según el motivo
  const camposPorMotivo = {
    0: {
      // ✅ INCUMPLIMIENTO CORREGIDO
      NumTitular: true,
      NomTitular: true,
      // Solo requerir contacto si NO hay contingencia activa
      Contacto: !contingenciaActiva,
      // ✅ CORRECCIÓN: Fecha y Franja solo si NO hay contingencia Y hay contacto exitoso Y cliente agenda
      Fecha: !contingenciaActiva && contacto === "2" && clienteAgenda,
      Franja: !contingenciaActiva && contacto === "2" && clienteAgenda,
      // Musuario solo si hay contacto exitoso y no hay contingencia
      Musuario: contacto === "2" && !contingenciaActiva,
    },
    1: {
      // ✅ AGENDA CORREGIDO
      NumTitular: true,
      NomTitular: true,
      Contacto: !contingenciaActiva,
      // ✅ CORRECCIÓN: Fecha y Franja SIEMPRE se piden EXCEPTO si Aceptains O sus están marcados
      Fecha: !document.getElementById("Aceptains")?.checked && !document.getElementById("sus")?.checked,
      Franja: !document.getElementById("Aceptains")?.checked && !document.getElementById("sus")?.checked,
      Musuario: contacto === "2" && !contingenciaActiva,
    },
    2: {
      // Quiebre (sin cambios)
      NumTitular: true,
      NomTitular: true,
      Contacto: !contingenciaActiva,
      mQuiebre: true,
      Musuario: contacto === "2" && !contingenciaActiva,
    },
    3: {
      // ✅ SOPORTE NO APLICA CORREGIDO - NO se requiere nombre ni número de titular
      noSoporte: true,
      tipoJornada: document.getElementById("noSoporte")?.value === "7",
      Musuario: ["11", "6", "13", "14", "3", "9", "4"].includes(
        document.getElementById("noSoporte")?.value
      ),
    },
    4: {
      // Gestión decos (sin cambios)
      NumTitular: true,
      NomTitular: true,
      Contacto: !contingenciaActiva,
      Musuario: contacto === "2" && !contingenciaActiva,
    },
    5: {
      // Dirección piloto (sin cambios)
      direccionSistema: true,
      resultado: true,
      Musuario: !document.getElementById("aceptarRecibo")?.checked,
    },
    6: {
      // Llamada caída (sin cambios)
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

// ===========================================
// SISTEMA PARA DUPLICAR CONTACTOS EXACTOS - VERSIÓN CORREGIDA
// ===========================================

let contadorContactosExactos = 1; // Empezamos en 1 porque ya existe el contacto principal
let funcionOriginalGuardada = null; // Variable para guardar la función original solo una vez

// Función para agregar un nuevo contacto (conectada al botón +)
function agregarNuevoContactoExacto() {
  contadorContactosExactos++;
  
  // Buscar el contenedor padre donde está el contacto original
  const contactoOriginal = document.getElementById('contacto1');
  if (!contactoOriginal) {
    console.error('❌ No se encontró el elemento con id "contacto1"');
    return false;
  }
  
  const rowPadre = contactoOriginal.closest('.row');
  if (!rowPadre) {
    console.error('❌ No se encontró el div.row padre');
    return false;
  }
  
  // Crear el nuevo HTML exacto
  const nuevoContactoHTML = crearContactoExactoHTML(contadorContactosExactos);
  
  // Insertar después del último contacto
  const ultimoContacto = document.querySelector('[data-contacto-id]:last-of-type');
  const elementoReferencia = ultimoContacto ? ultimoContacto.closest('.row') : rowPadre;
  
  elementoReferencia.insertAdjacentHTML('afterend', nuevoContactoHTML);
  
  // Inicializar event listeners para el nuevo contacto
  inicializarEventListenersContactoExacto(contadorContactosExactos);
  
  console.log(`✅ Nuevo contacto exacto agregado: #${contadorContactosExactos}`);
  
  // Actualizar la nota SOLO si existe la función
  if (typeof crearNota === 'function') {
    crearNota();
  }
  
  return contadorContactosExactos;
}

// Función para crear el HTML exacto del nuevo contacto
function crearContactoExactoHTML(numero) {
  return `
    <div class="row" data-contacto-id="${numero}">
      <div class="col-12" id="contacto${numero}">
        <div class="row">
          <div class="col-5">
            <label for="NumTitular${numero}">Numero de Titular ${numero}</label>
            <input type="tel" class="form-control trans no-arrows" id="NumTitular${numero}" 
                   autocomplete="off" placeholder="Número de teléfono ${numero}">
          </div>
          <div class="col-5">
            <label for="Contacto${numero}">Hubo Contacto ${numero}</label>
            <select class="custom-select trans" id="Contacto${numero}">
              <option selected>...</option>
              <option value="2">Contacto</option>
              <option value="1">Sin Contacto</option>
              <option value="ocupado">Línea ocupada</option>
              <option value="fuera_servicio">Número fuera de servicio</option>
              <option value="equivocado">Número equivocado</option>
              <option value="buzon">Contestó buzón de voz</option>
              <option value="cuelga">Cliente cuelga inmediatamente</option>
              <option value="tercero">Atiende tercera persona</option>
              <option value="rechaza_llamada">Rechaza la llamada</option>
            </select>
          </div>
          <div class="col-2 d-flex align-items-end">
            <button type="button" class="btn btn-danger btn-block" 
                    onclick="eliminarContactoExacto(${numero})" 
                    data-toggle="tooltip" data-placement="top" 
                    title="Eliminar contacto ${numero}">-</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Función para inicializar event listeners del nuevo contacto
function inicializarEventListenersContactoExacto(numero) {
  const numeroInput = document.getElementById(`NumTitular${numero}`);
  const contactoSelect = document.getElementById(`Contacto${numero}`);
  
  if (numeroInput) {
    numeroInput.addEventListener('input', function() {
      // Actualizar nota cuando cambie el número
      if (typeof crearNota === 'function') {
        crearNota();
      }
    });
  }
  
  if (contactoSelect) {
    contactoSelect.addEventListener('change', function() {
      // Actualizar nota cuando cambie el tipo de contacto
      if (typeof crearNota === 'function') {
        crearNota();
      }
    });
  }
}

// Función para eliminar un contacto específico
function eliminarContactoExacto(numero) {
  const contactoRow = document.querySelector(`[data-contacto-id="${numero}"]`);
  if (contactoRow) {
    if (confirm(`¿Estás seguro de eliminar el Contacto #${numero}?`)) {
      contactoRow.remove();
      console.log(`✅ Contacto #${numero} eliminado`);
      
      // Actualizar la nota
      if (typeof crearNota === 'function') {
        crearNota();
      }
    }
  }
}

// Función para obtener todos los contactos (original + adicionales)
function obtenerTodosLosContactosExactos() {
  const contactos = [];
  
  // Contacto original
  const numOriginal = document.getElementById('NumTitular')?.value || '';
  const contactoOriginal = document.getElementById('Contacto')?.value || '...';
  
  if (numOriginal.trim() && contactoOriginal !== '...') {
    contactos.push({
      numero: 1,
      telefono: numOriginal,
      tipoContacto: contactoOriginal,
      esOriginal: true
    });
  }
  
  // Contactos adicionales
  document.querySelectorAll('[data-contacto-id]').forEach(elemento => {
    const numero = elemento.getAttribute('data-contacto-id');
    const telefono = document.getElementById(`NumTitular${numero}`)?.value || '';
    const tipoContacto = document.getElementById(`Contacto${numero}`)?.value || '...';
    
    if (telefono.trim() && tipoContacto !== '...') {
      contactos.push({
        numero: parseInt(numero),
        telefono: telefono,
        tipoContacto: tipoContacto,
        esOriginal: false
      });
    }
  });
  
  return contactos;
}

// Función para generar el texto de contactos concatenados para la nota
function generarTextoContactosConcatenados(nombreTitular) {
  const contactos = obtenerTodosLosContactosExactos();
  
  if (contactos.length === 0) {
    // Si no hay contactos válidos, usar la lógica original
    const numOriginal = document.getElementById('NumTitular')?.value || '';
    const contactoOriginal = document.getElementById('Contacto')?.value || '...';
    
    if (numOriginal.trim()) {
      if (contactoOriginal === '2') {
        return `Titular ${nombreTitular} se marca al número ${numOriginal} contesta `;
      } else if (esSinContacto(contactoOriginal)) {
        const textoSinContacto = obtenerTextoSinContacto(contactoOriginal);
        return `Titular ${nombreTitular} se marca al número ${numOriginal} ${textoSinContacto}`;
      }
    }
    
    return `Titular ${nombreTitular} se marca al número `;
  }
  
  if (contactos.length === 1) {
    // Un solo contacto - usar lógica original
    const contacto = contactos[0];
    
    if (contacto.tipoContacto === '2') {
      return `Titular ${nombreTitular} se marca al número ${contacto.telefono} contesta `;
    } else if (esSinContacto(contacto.tipoContacto)) {
      const textoSinContacto = obtenerTextoSinContacto(contacto.tipoContacto);
      return `Titular ${nombreTitular} se marca al número ${contacto.telefono} ${textoSinContacto}`;
    }
  }
  
  // Múltiples contactos - concatenar
  let textoCompleto = `Titular ${nombreTitular} `;
  let hayContactoExitoso = false;
  let textoContactoExitoso = '';
  
  contactos.forEach((contacto, index) => {
    if (contacto.tipoContacto === '2') {
      hayContactoExitoso = true;
      textoContactoExitoso = `se marca al número ${contacto.telefono} contesta `;
    } else if (esSinContacto(contacto.tipoContacto)) {
      const textoSinContacto = obtenerTextoSinContacto(contacto.tipoContacto);
      
      if (index === 0) {
        textoCompleto += `se marca al número ${contacto.telefono} ${textoSinContacto}`;
      } else if (index === contactos.length - 1 && !hayContactoExitoso) {
        textoCompleto += ` y se marca al número ${contacto.telefono} ${textoSinContacto}`;
      } else if (!hayContactoExitoso) {
        textoCompleto += `, se marca al número ${contacto.telefono} ${textoSinContacto}`;
      }
    }
  });
  
  // Si hay contacto exitoso, agregarlo al final
  if (hayContactoExitoso) {
    if (contactos.length > 1) {
      // Si hubo intentos fallidos antes del exitoso
      const intentosFallidos = contactos.filter(c => esSinContacto(c.tipoContacto));
      if (intentosFallidos.length > 0) {
        textoCompleto += `, finalmente ${textoContactoExitoso}`;
      } else {
        textoCompleto += textoContactoExitoso;
      }
    } else {
      textoCompleto = textoContactoExitoso.replace('se marca al número', `Titular ${nombreTitular} se marca al número`);
    }
  }
  
  return textoCompleto;
}

// Función para modificar la función crearNota existente (VERSIÓN CORREGIDA)
function integrarContactosConcatenadosEnNota() {
  // Verificar si ya hemos guardado la función original
  
  
  // Guardar referencia a la función original SOLO una vez
  funcionOriginalGuardada = window.crearNota;
  
  if (typeof funcionOriginalGuardada !== 'function') {
    console.warn('⚠️ No se encontró la función crearNota original');
    return;
  }
  
  // Sobrescribir la función crearNota
  window.crearNota = function() {
    // Llamar a la función original PRIMERO
    funcionOriginalGuardada();
    
    // Obtener valores necesarios
    const nombreTitular = document.getElementById('NomTitular')?.value || '';
    
    // Solo proceder si hay nombre de titular
    if (!nombreTitular.trim()) {
      return;
    }
    
    // Generar texto de contactos concatenados
    const textoContactos = generarTextoContactosConcatenados(nombreTitular);
    
    // Obtener el contenido actual de la nota
    const textoNota = document.getElementById('textoNota');
    if (!textoNota) return;
    
    let contenidoNota = textoNota.value;
    
    // Patrón más específico para evitar reemplazos múltiples
    const patronTitular = new RegExp(`Titular\\s+${nombreTitular.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+se marca al número[^,\\.]*`, 'i');
    
    if (patronTitular.test(contenidoNota)) {
      // Reemplazar el patrón existente con el texto concatenado
      contenidoNota = contenidoNota.replace(patronTitular, textoContactos);
    } else {
      // Buscar patrón más general como fallback
      const patronGeneral = /Titular\s+[^\s]+(?:\s+[^\s]+)*\s+se marca al número[^,\.]*/i;
      if (patronGeneral.test(contenidoNota)) {
        contenidoNota = contenidoNota.replace(patronGeneral, textoContactos);
      }
    }
    
    // Actualizar el contenido de la nota
    textoNota.value = contenidoNota;
  };
  
}

// Función para conectar el botón "+" 
/* function conectarBotonAgregarExacto() {
  const botonAgregar = document.getElementById('agregarNumero');
  
  if (botonAgregar) {
    // Verificar si ya tiene nuestro event listener
    
    
    // Marcar el botón como conectado
    botonAgregar.setAttribute('data-contactos-connected', 'true');
    
    // Agregar el event listener con prevención de múltiples ejecuciones
    botonAgregar.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Prevenir múltiples clics rápidos
      if (botonAgregar.disabled) return;
      
      botonAgregar.disabled = true;
      
      try {
        agregarNuevoContactoExacto();
      } finally {
        // Rehabilitar el botón después de un pequeño delay
        setTimeout(() => {
          botonAgregar.disabled = false;
        }, 300);
      }
    });
    
  } else {
    console.warn('⚠️ No se encontró el botón con id "agregarNumero"');
  }
} */

// Función de inicialización principal (VERSIÓN CORREGIDA)
function inicializarSistemaContactosExactos() {
  // Verificar si ya está inicializado
  if (window.ContactosExactosInicializado) {
    return;
  }
  
  
  // Marcar como inicializado
  window.ContactosExactosInicializado = true;
  
  // Conectar botón agregar
  conectarBotonAgregarExacto();
  
  // Integrar con sistema de notas
  integrarContactosConcatenadosEnNota();
  
}

// ===========================================
// FUNCIONES PÚBLICAS
// ===========================================

// Hacer funciones disponibles globalmente
window.ContactosExactos = {
  agregar: agregarNuevoContactoExacto,
  eliminar: eliminarContactoExacto,
  obtenerTodos: obtenerTodosLosContactosExactos,
  generarTexto: generarTextoContactosConcatenados,
  inicializar: inicializarSistemaContactosExactos,
  // Función para reiniciar el sistema si es necesario
  reiniciar: function() {
    window.ContactosExactosInicializado = false;
    funcionOriginalGuardada = null;
    contadorContactosExactos = 1;
    const botonAgregar = document.getElementById('agregarNumero');
    if (botonAgregar) {
      botonAgregar.removeAttribute('data-contactos-connected');
    }
  }
};

// Inicialización automática con protección contra múltiples ejecuciones
document.addEventListener('DOMContentLoaded', function() {
  if (!window.ContactosExactosInicializado) {
    setTimeout(() => {
      inicializarSistemaContactosExactos();
    }, 500);
  }
});

// También en window.onload por si acaso
window.addEventListener('load', function() {
  if (!window.ContactosExactosInicializado) {
    setTimeout(() => {
      inicializarSistemaContactosExactos();
    }, 800);
  }
});

