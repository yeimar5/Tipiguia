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
// INICIALIZACIÓN Y EVENT LISTENERS
// ===========================================

const inputDireccion = document.getElementById("direccionSistema");

if (inputDireccion) {
  inputDireccion.addEventListener("paste", function (e) {
    setTimeout(() => (this.value = limpiarTexto(this.value)), 10);
  });
}

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
    btnCopiarNota: () =>
      copiarYAlertar(document.getElementById(`textoNota`).value, alerta),
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
  const selectContacto = document.getElementById("Contacto");
  selectContacto.disabled = false; // Habilitar el select de contacto
  resetearTextareas();
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
  // Mantener cualquier otra lógica de inicialización original
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

  if (fechaObj < hoy) {
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

function actualizarNota(event) {
  return true;
}

function Actualizartodo() {
  const formulario = document.querySelector("#Formulario");
  formulario.addEventListener("input", (event) => {
    if (actualizarNota(event)) {
      actualizarNotaCompleta();
    }
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
  const checkbox = document.getElementById('notaApp');
  if (checkbox) {
    checkbox.addEventListener('change', function() {
      const textoLabel = this.checked ? 'NOTA APLICATIVOS' : 'NOTA NORMAL';
      setInnerHTML('#labelText', textoLabel);
      
      // Regenerar la nota cuando cambie el estado del checkbox
      if (typeof crearNota === 'function') {
        crearNota();
      }
    });
  }
}

// ===========================================
// INICIALIZACIÓN PRINCIPAL
// ===========================================

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

// Función para obtener todos los valores del formulario
function obtenerValoresFormulario() {
  return {
    motivoLlamada: document.querySelector("#Motivo").value,
    motivoTecnico: document.getElementById("Mtecnico"),
    numeroTitular: document.getElementById("NumTitular").value,
    nombreTitular: document.getElementById("NomTitular").value,
    contingenciaActiva: document.getElementById("Contingencia").checked,
    aLaEsperadeInstalacion: document.getElementById("Aceptains").checked,
    trabajador: document.getElementById("rol").value,
    contactoConTitular: document.getElementById("Contacto").value,
    motivoQuiebre: document.getElementById("mQuiebre").value,
    motivoCliente: document.getElementById("Musuario").value,
    fecha: document.getElementById("Fecha").value,
    franjaAgenda: document.getElementById("Franja").value,
    gpsActivo: document.getElementById("gps").value,
    soporteFotografico: document.getElementById("SF").value,
    fallaChatbot: document.getElementById("FC").checked,
    suspenderOrden: document.getElementById("sus").checked,
    nombreAsesor: document.getElementById("NomAgent").value,
    agentAsesor: `agent_${document.getElementById("Agent").value}`,
    direccionAgendador: document.getElementById("direccionSistema").value,
    direcionenRecibo: document.getElementById("resultado").value,
  };
}

// Función para generar textos base
function generarTextosBase(valores) {
  return {
    titularContacto: `Titular ${valores.nombreTitular} número ${valores.numeroTitular}`,
    gestion: `. Gestionado por ${valores.nombreAsesor} ${valores.agentAsesor}.`,
    fechaFormateada: FormatearFecha(valores.fecha),
    texto: `LINEA RESCATE Se comunica ${valores.trabajador} informando que ${valores.motivoTecnico.value} `,
  };
}

// Función para procesar caso de agenda
function procesarCasoAgenda(valores, textos) {
  let notaGenerada = "";
  let mensajeChatbot = "";

  const agendaNota = ` se reagenda orden para el dia ${textos.fechaFormateada} en la franja ${valores.franjaAgenda} segun indicación de técnico.`;

  if (valores.trabajador === "técnico") {
    mensajeChatbot = valores.fallaChatbot
      ? "Se valida soporte por falla reportada en chatbot"
      : "Se valida chatbot ok.";

    if (valores.contingenciaActiva) {
      notaGenerada = valores.suspenderOrden
        ? "POR CONTINGENCIA se deja orden pendiente en aplicativos."
        : ` POR CONTINGENCIA ${agendaNota}`;
    }
  }

  let texto =
    textos.texto +
    mensajeChatbot +
    ` ${textos.titularContacto} ${valores.motivoCliente} `;

  if (valores.contactoConTitular === "1") {
    if (valores.trabajador === "gestor") {
      notaGenerada =
        "no contesta se le indica a gestor que intente mas tarde para proceder con la gestión.";
    } else {
      notaGenerada = `No contesta, Se Valida GPS ${valores.gpsActivo} Se Valida SOPORTE FOTOGRÁFICO ${valores.soporteFotografico}`;

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
  let texto = textos.texto;
  let mensajeChatbot = "";

  if (valores.trabajador === "técnico") {
    mensajeChatbot = valores.fallaChatbot
      ? ", se valida soporte por falla reportada en chatbot"
      : ", se valida chatbot ok.";
  }

  texto += mensajeChatbot;

  if (
    valores.contactoConTitular === "1" ||
    valores.contactoConTitular === "..."
  ) {
    if (valores.trabajador === "gestor") {
      texto += `${textos.titularContacto}. No contesta se le indica a gestor que intente mas tarde para proceder con la gestión.`;
    } else {
      if (valores.contingenciaActiva) {
        texto = `QC - ${valores.motivoQuiebre} - ${texto} no ${textos.titularContacto} POR CONTINGENCIA se deja orden suspendida en aplicativos`;
      } else if (
        valores.gpsActivo === "OK" &&
        valores.soporteFotografico === "OK"
      ) {
        texto = `QC - ${valores.motivoQuiebre} - ${texto} ${textos.titularContacto}. No contesta. Se valida SOPORTE FOTOGRÁFICO ${valores.soporteFotografico}. Se valida GPS ${valores.gpsActivo}. Se deja orden suspendida en aplicativos.`;
      } else {
        texto += `${textos.titularContacto}. No contesta. Se valida GPS ${valores.gpsActivo}. Se valida SOPORTE FOTOGRÁFICO ${valores.soporteFotografico}. Se le indica al técnico dirigirse al predio y subir soporte fotográfico.`;
      }
    }
  } else if (valores.contactoConTitular === "2") {
    const motivosEspeciales = [
      "TELÉFONO DEL CLIENTE ERRADO",
      "GESTIÓN COMERCIAL/CLIENTE ACEPTA INSTALACIÓN",
      "GESTIÓN COMERCIAL/CLIENTE SOLICITA LLAMAR EN 10 MIN",
    ];

    if (!motivosEspeciales.includes(valores.motivoQuiebre)) {
      texto = valores.suspenderOrden
        ? `QC - ${valores.motivoQuiebre} - ${texto} ${textos.titularContacto} ${valores.motivoCliente}. Se deja orden suspendida en aplicativos.`
        : `QC - ${valores.motivoQuiebre} - ${texto} ${textos.titularContacto} ${valores.motivoCliente}. Se hace objeción pero desiste, valida datos, se procede a quebrar orden.`;
    } else {
      texto = procesarMotivoEspecial(valores, textos, texto);
    }
  }

  return texto;
}

// Función auxiliar para procesar motivos especiales en quiebre
function procesarMotivoEspecial(valores, textos, texto) {
  if (
    valores.motivoQuiebre === "GESTIÓN COMERCIAL/CLIENTE ACEPTA INSTALACIÓN"
  ) {
    return (
      texto +
      `${valores.motivoCliente}. Se hace objeción, acepta instalación y valida datos correctos.`
    );
  } else if (
    valores.motivoQuiebre ===
    "GESTIÓN COMERCIAL/CLIENTE SOLICITA LLAMAR EN 10 MIN"
  ) {
    return (
      texto +
      `${textos.titularContacto} ${valores.motivoCliente}. Solicita que lo llamen en 10 minutos.`
    );
  } else if (valores.motivoQuiebre === "TELÉFONO DEL CLIENTE ERRADO") {
    if (valores.trabajador === "gestor") {
      return `QC - ${valores.motivoQuiebre} - ${texto} ${textos.titularContacto} ${valores.motivoCliente}. se indica que debe enviar técnico a predio para poder suspender la orden.`;
    } else {
      return `QC - ${valores.motivoQuiebre} - ${texto} ${textos.titularContacto} ${valores.motivoCliente}. Se valida SOPORTE FOTOGRÁFICO OK, se valida GPS OK, se procede a suspender orden.`;
    }
  }
  return texto;
}

// Función para procesar caso de soporte no aplica
function procesarCasoSoporteNoAplica(valores, textos) {
  const soporteNoAplica = document.querySelector("#noSoporte").value;
  const mensajes = {
    1: "se valida chatbot y no ha realizado el proceso, se le indica que debe realizar el proceso antes de comunicarse con la linea y si hay fallo reportarlo con su gestor para que reporten a centro comando, se le brinda ticket",
    2: "se valida chatbot y no ha esperado respuesta se le recuerda parámetros del aplicativo a tener en cuenta antes de comunicarse con la linea y si hay alguna falla reportarlo con centro comando. se le brinda ticket",
    3: "se entrega ticket",
    4: `${textos.titularContacto} contesta ${valores.motivoCliente} se le indica que en linea de rescate no se gestiona ordenes porque le falten materiales debe realizar autogestión o validar con su gestor`,
    5: `${textos.titularContacto} contesta ${valores.motivoCliente} se le informa que esta gestión no se realiza por linea de rescate que valide con cierre controlado o con su gestor`,
    6: `${textos.titularContacto} contesta ${valores.motivoCliente} se le indica a Técnico que debe hacer autogestión o validar con gestor ya que en linea de rescate no se gestiona ordenes por lluvias`,
    7: "se valida orden se encuentra en franja am se le indica que en linea rescate solo gestionamos ordenes en am máximo hasta las 1 pm se le indica a técnico hacer autogestión o validar con su gestor",
    8: "se valida orden esta se encuentra en otro estado se le indica a Técnico no se puede gestionar esta orden se le indica validar con gestor",
    9: `${textos.titularContacto} contesta ${valores.motivoCliente} se le indica que en linea de rescate no se gestiona orden porque no pueda llegar al predio debe validar con gestor o hacer autogestión`,
    10: "se le indica comunicarse con gestor o hacer autogestión ya que desde linea de rescate no se gestionan por ese motivo",
    11: `${textos.titularContacto} contesta ${valores.motivoCliente} se indica a técnico que este proceso no lo hace LR que debe validar con su gestor o con cierre controlado.`,
    12: "se valida orden se encuentra en franja am se le indica que en linea rescate solo se puede hacer cambio de franja máximo hasta las 12 pm se le indica a técnico hacer autogestión o validar con su gestor",
    13: `${textos.titularContacto} contesta ${valores.motivoCliente} se le informa a Técnico hacer autogestión por dirección errada`,
    14: `${textos.titularContacto} ${valores.motivoCliente} se solicita la baja de perfil en speedy`,
    15: "se valida orden y es una avería, se le indica que desde linea de rescate no se gestiona que se comunique con gestor o cierre controlado",
  };

  return textos.texto + mensajes[soporteNoAplica];
}

// Función para procesar caso de gestión de decos
function procesarCasoGestionDecos(valores, textos) {
  const mensajeChatbot = valores.fallaChatbot
    ? ", se valida soporte por falla reportada en chatbot"
    : ", se valida chatbot ok.";

  let texto =
    textos.texto +
    mensajeChatbot +
    ` ${textos.titularContacto} ${valores.motivoCliente}`;

  if (valores.contactoConTitular === "2") {
    texto += " se valida datos correctos y se actualiza TAG de equipos";
  } else if (valores.contactoConTitular === "1") {
    texto +=
      " no hay contacto se indica a técnico que le diga al titular que este pendiente de la llamada e intente nuevamente";
  }

  return texto;
}

// Función para procesar caso de dirección piloto
function procesarCasoDireccionPiloto(valores, textos) {
  const respuesta = valores.aLaEsperadeInstalacion
    ? "SI se da aceptación al recibo publico"
    : `NO se acepta porque ${valores.motivoCliente}`;

  return (
    textos.texto +
    ` ${valores.direcionenRecibo} y en sistema está ${valores.direccionAgendador} ${respuesta}`
  );
}

// Función principal
function crearNota() {
  const valores = obtenerValoresFormulario();
  const textos = generarTextosBase(valores);
  const textoNota = document.getElementById("textoNota");
  let textoFinal = "";

  switch (valores.motivoLlamada) {
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
        textos.texto +
        " pero se cae la llamada sin poder validar la información";
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

// Lista de todos los elementos que se manejan en la aplicación
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
  "#direccionSistema",
  "#nomt",
  "#numt",
];

// Función mejorada que acepta elementos base que siempre se muestran
function mostrarSoloElementos(configuracion, elementosBase = {}) {
  // Ocultar todos primero
  todosLosElementos.forEach((selector) => {
    const elemento = document.querySelector(selector);
    if (elemento) {
      elemento.style.display = "none";
    }
  });

  // Mostrar elementos base primero (siempre visibles)
  if (elementosBase.block) {
    elementosBase.block.forEach((selector) => {
      const elemento = document.querySelector(selector);
      if (elemento) {
        elemento.style.display = "block";
      }
    });
  }

  if (elementosBase.flex) {
    elementosBase.flex.forEach((selector) => {
      const elemento = document.querySelector(selector);
      if (elemento) {
        elemento.style.display = "flex";
      }
    });
  }

  // Mostrar elementos específicos de la configuración
  if (configuracion.block) {
    configuracion.block.forEach((selector) => {
      const elemento = document.querySelector(selector);
      if (elemento) {
        elemento.style.display = "block";
      }
    });
  }

  if (configuracion.flex) {
    configuracion.flex.forEach((selector) => {
      const elemento = document.querySelector(selector);
      if (elemento) {
        elemento.style.display = "flex";
      }
    });
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
    suspender: document.getElementById("sus").checked,
  };
}

// Función para manejar caso agendamiento en manejarCambio
function manejarCasoAgenda(valores) {
  cambiarColorFondo("#2d8215");

  // Elementos que SIEMPRE se muestran en agenda
  const elementosBaseAgenda = {
    block: ["#contingencia", "#contacto", , "#contacto1"],
    flex: ["#fallaChatbot", "#Titular"],
  };

  if (
    valores.trabajador === "gestor" &&
    (valores.contacto === "..." || valores.contacto === "1")
  ) {
    mostrarSoloElementos(
      {
        block: ["#MotivoTec"],
      },
      elementosBaseAgenda
    );
  } else if (
    valores.contacto === "1" &&
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
          flex: [, "#suspender"],
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
    if (valores.contacto !== "1") {
      const selectContacto = document.getElementById("Contacto");
      selectContacto.selectedIndex = 0; // Fuerza la opción por defecto (index 0)
      selectContacto.disabled = true; // Bloquea el select para que no pueda modificarse
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
    const selectContacto = document.getElementById("Contacto");
    if (selectContacto) selectContacto.disabled = false;
  }

  ValueMostrar("#Mtecnico", "solicitan reagendar la orden para el día ");
}

// Función para manejar caso quiebre en manejarCambio
function manejarCasoQuiebre(valores) {
  cambiarColorFondo("#dc4c4c");

  // Elementos que SIEMPRE se muestran en quiebre
  const elementosBaseQuiebre = {
    block: ["#contingencia", "#contacto", "#contacto1"],
    flex: ["#Titular", "#fallaChatbot"],
  };

  if (
    valores.trabajador === "gestor" &&
    (valores.contacto === "..." || valores.contacto === "1")
  ) {
    mostrarSoloElementos(
      {
        block: ["#MotivoTec"],
        /* flex: ["#contacto"] */
      },
      elementosBaseQuiebre
    );
  } else if (
    valores.trabajador === "técnico" &&
    valores.contacto === "1" &&
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
        flex: ["#suspender"],
      },
      elementosBaseQuiebre
    );
    ordenarElementos(
      document.querySelector("#contacto", "#contacto1"),
      document.querySelector("#Musuariod")
    );
  } else if (valores.contingencia) {
    const selectContacto = document.getElementById("Contacto");
    selectContacto.selectedIndex = 0; // Fuerza la opción por defecto (index 0)
    selectContacto.disabled = true; // Bloquea el select para que no pueda modificarse
    mostrarSoloElementos(
      {
        block: ["#MotivoTec", "#MoQuiebre", "#nomt", "#numt"],
        flex: ["#notaAplicativos"],
      },
      elementosBaseQuiebre
    );
  } else {
    mostrarSoloElementos(
      {
        block: ["#MotivoTec", "#nomt", "#numt"],
      },
      elementosBaseQuiebre
    );
    const selectContacto = document.getElementById("Contacto");
    if (selectContacto) selectContacto.disabled = false;
  }

  ValueMostrar("#Mtecnico", "titular desea cancelar el servicio por ");
}

// Función para manejar caso soporte no aplica en manejarCambio
function manejarCasoSoporteNoAplica(valores) {
  cambiarColorFondo("#F18F13");

  const soportesConTitular = ["11", "6", "13", "14", "3", "9", "4"];

  if (soportesConTitular.includes(valores.soporteNA)) {
    mostrarSoloElementos({
      block: ["#MotivoTec", "#Musuariod", "#Soporte"],
      flex: ["#Titular"],
    });
  } else {
    mostrarSoloElementos({
      block: ["#MotivoTec", "#Soporte"],
    });
  }

  ValueMostrar("#Mtecnico", "");
}

// Función principal para manejarCambio
function manejarCambio(e) {
  Actualizartodo();
  setInnerHTML("#TMusuario", "MOTIVO USUARIO");

  const valores = obtenerValoresManejarCambio();

  if (Actualizartodo) {
    switch (valores.mLlamada) {
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
        cambiarColorFondo("#00ccfe");
        mostrarSoloElementos({
          block: ["#MotivoTec", "#Musuariod", "#contacto", "#contacto1"],
          flex: ["#Titular", "#fallaChatbot"],
        });
        ValueMostrar(
          "#Mtecnico",
          "titular solicita adicionar un decodificador a la orden para un total de "
        );
        break;
      case "5": // Gestión piloto
        cambiarColorFondo("#c3c3c3");
        mostrarSoloElementos({
          flex: ["#Acepta"],
          block: ["#MotivoTec", "#direccionSistema", "#DRP"],
        });

        if (!valores.aceptaInstalar) {
          mostrarSoloElementos({
            flex: ["#Acepta"],
            block: ["#MotivoTec", "#direccionSistema", "#Musuariod", "#DRP"],
          });
          setInnerHTML("#TMusuario", "NO SE ACEPTA PORQUE?");
        }
        ValueMostrar(
          "#Mtecnico",
          "requieren cambio de complemento, en recibo publico está "
        );
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

// Función para procesar el texto y eliminar "POR CONTINGENCIA"
function procesarTextoNotaAplicativos(texto) {
    const checkbox = document.getElementById('notaApp');
    if (checkbox && checkbox.checked) {
        // Eliminar la frase "POR CONTINGENCIA" (case insensitive)
        const cleanedText = texto.replace(/POR CONTINGENCIA/gi, '').trim();
        // Limpiar espacios extras que puedan quedar
        return cleanedText.replace(/\s+/g, ' ').trim();
    }
    return texto;
}