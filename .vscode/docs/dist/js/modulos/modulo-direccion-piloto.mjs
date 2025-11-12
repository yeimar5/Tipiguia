// ===========================================
// MÓDULO DIRECCIÓN PILOTO (CASE 5)
// ===========================================

// ===========================================
// IMPORTS DE FUNCIONES AUXILIARES
// ===========================================
import * as Utilidades from "./modulo-utilidades.mjs";
import {
  cambiarColorFondo,
  mostrarSoloElementos,
  setInnerHTML,
  ValueMostrar,
  aplicarLimpiezaAInput,
} from "../main.mjs";

const direccionInput = document.getElementById("via");
const direccionSistema = document.getElementById("direccionSistema");
const complementoInput = document.getElementById("complemento");
const complementoAgendador = document.getElementById("complemento_agendador");

// Definir las palabras clave que activan la división
const palabrasClave = [
  "INTERIOR",
  "INT",
  "IN",
  "BL",
  "BQU",
  "BLOQUE",
  "BQ",
  "CAS",
  "CS",
  "AP",
  "APTO",
  "TORRE",
  "APT",
  "OF",
  "LT",
  "LOTE",
  "TRR",
  "TO",
  "PISO",
  "PIS",
  "PI",
  "LCA",
  "LC",
  "SOTANO",

];

const sinonimos = {
  // Puntos cardinales
  n: "norte",
  norte: "norte",
  s: "sur",
  sur: "sur",
  e: "este",
  este: "este",
  oriente: "este",
  o: "oeste",
  oeste: "oeste",
  occidente: "oeste",
  w: "oeste",

  // Tipos de vías
  c: "calle",
  cl: "calle",
  calle: "calle",
  cll: "calle",
  cr: "carrera",
  carrera: "carrera",
  crr: "carrera",
  cra: "carrera",
  k: "carrera",
  kr: "carrera",
  avda: "avenida",
  av: "avenida",
  avenida: "avenida",
  ave: "avenida",
  diag: "diagonal",
  dg: "diagonal",
  diagonal: "diagonal",
  trans: "transversal",
  transversal: "transversal",
  tv: "transversal",

  // Otros términos comunes
  no: "numero",
  num: "numero",
  numero: "numero",
  "#": "numero",
  mz: "manzana",
  m: "manzana",
  manzana: "manzana",
  urb: "urbanizacion",
  urbanizacion: "urbanizacion",
};

// ===========================================
// FUNCIONES ESPECÍFICAS PARA DIRECCIÓN PILOTO
// ===========================================

// Función para procesar caso de dirección piloto en la creación de nota
function procesarCasoDireccionPiloto(valores, textos) {
  let respuesta = "";

  if (valores.aceptarRecibo === "SI") {
    respuesta =
      "SI se da aceptación al recibo publico, tambien a la foto de la placa del predio con georreferencia y contador";
  } else if (valores.aceptarRecibo === "NO") {
    respuesta = `NO se acepta el recibo porque ${valores.motivoCliente}`;
  } else {
    respuesta = "";
  }

  let reciboPublico = "";
  if (valores.direcionenRecibo) {
    const complementoRecibo = document.getElementById("complemento")?.value || "";
    reciboPublico =
      `en recibo publico esta ${valores.direcionenRecibo} ${complementoRecibo}`.trim();
  }
  let sistema = "";
  if (valores.direccionAgendador) {
    const complemento = document.getElementById("complemento_agendador")?.value || "";
    const direccionCompleta = `${valores.direccionAgendador} ${complemento}`.trim();
    sistema = `y en sistema está ${direccionCompleta}`;
  }
  // ✅ Tomamos el valor del input intentosRecibo
  let intentos = document.getElementById("intentosRecibo")?.value || "";

  // Armamos el texto base
  let nota = textos.texto + ` ${reciboPublico} ${sistema} ${respuesta}`.trim();

  // ✅ Si intentos tiene valor, lo agregamos al final
  if (intentos) {
    nota += `, técnico se ha comunicado ${intentos} ${intentos == 1 ? "vez" : "veces"}`;
    if (valores.aceptarRecibo === "NO" && parseInt(intentos) >= 3) {
      nota += ", se le indica validar con gestor por cantidad de intentos";
    }
  }

  return nota;
}

// Función para manejar la interfaz visual del caso dirección piloto
function manejarCasoDireccionPiloto(valores) {
  cambiarColorFondo("#c3c3c3");
  const elementosBasePiloto = {
    block: ["#MotivoTec", "#DRP", "#seccionDireccionSistema"],
    flex: ["#select_aceptarRecibo", "#intentosRecibo"],
  };

  // Mostrar/ocultar campos según si acepta el recibo
  if (valores.aceptarRecibo !== "NO") {
    mostrarSoloElementos(elementosBasePiloto);
  } else {
    setInnerHTML("#TMusuario", "NO SE ACEPTA PORQUE?");
    mostrarSoloElementos(elementosBasePiloto, {
      block: ["#Musuariod"],
    });
    if (valores.motivoLlamada === "5") {
      ValueMostrar("#Musuario", "la direccion no es legible, se encuentra borrosa");
    } else {
      ValueMostrar("#Musuario", "");
    }
  }

  ValueMostrar("#Mtecnico", "requieren corrección en el complemento de la dirección, ");
}

/**
 * Divide el texto pegado en un input según palabras clave y lo distribuye entre dos inputs
 * @param {HTMLElement} inputOrigen - Input donde se pega el texto original
 * @param {HTMLElement} inputDestino - Input donde va la parte dividida
 * @param {Array} palabrasClave - Array de palabras que activan la división (ej: ['BQU', 'CAS', 'APTO', 'APT'])
 */
function aplicarDivisionTexto(inputOrigen, inputDestino, palabrasClave = []) {
  if (!inputOrigen || !inputDestino || !Array.isArray(palabrasClave)) {
    console.warn("Se requieren elementos DOM válidos y array de palabras clave");
    return;
  }

  // Convertir palabras clave a mayúsculas para comparación
  const palabrasClaveUpper = palabrasClave.map((palabra) => palabra.toUpperCase());

  function dividirTexto() {
    const textoCompleto = inputOrigen.value.trim();

    if (!textoCompleto) return;

    // Buscar la primera palabra clave que aparezca en el texto
    let indiceDivision = -1;
    let palabraEncontrada = "";

    palabrasClaveUpper.forEach((palabra) => {
      const indice = textoCompleto.toUpperCase().indexOf(palabra);
      if (indice !== -1 && (indiceDivision === -1 || indice < indiceDivision)) {
        indiceDivision = indice;
        palabraEncontrada = palabra;
      }
    });

    // Si encontró una palabra clave, dividir el texto
    if (indiceDivision !== -1) {
      const parteAntes = textoCompleto.substring(0, indiceDivision).trim();
      const parteDespues = textoCompleto.substring(indiceDivision).trim();

      // Actualizar los inputs
      inputOrigen.value = parteAntes;
      inputDestino.value = parteDespues;

      console.log(`Texto dividido en "${palabraEncontrada}":`, {
        origen: parteAntes,
        destino: parteDespues,
      });
    }
  }

  // Aplicar la división después del paste
  inputOrigen.addEventListener("paste", () => {
    setTimeout(dividirTexto, 0);
  });
}

// Función para normalizar direcciones

/**
 * Limpia y normaliza una cadena de dirección para su comparación.
 * Convierte a minúsculas, elimina caracteres no deseados y estandariza los puntos cardinales y tipos de vía.
 * @param {string} direccion La dirección a limpiar.
 * @returns {string} La dirección normalizada.
 */
function normalizarDireccion(direccion) {
  if (!direccion) return "";

  // 1. Limpieza inicial y conversión a minúsculas
  let normalizada = direccion
    .toLowerCase()
    .replace(/[^\w\s#]/g, " ") // Quitar caracteres especiales excepto #
    .replace(/\s+/g, " ") // Normalizar espacios
    .trim();

  // Dividir en palabras
  let palabras = normalizada.split(/\s+/).filter((palabra) => palabra.length > 0);

  // 2. Reemplazar cada palabra con su sinónimo estándar si existe
  palabras = palabras.map((palabra) => sinonimos[palabra] || palabra);

  // 3. Eliminar tipos de vía y palabras indicadoras después del primer número
  // Estos son referencias de cruce/placa, no cambian la dirección real
  const tiposVia = ["calle", "carrera", "avenida", "diagonal", "transversal"];
  const indicadores = ["numero", "con", "esquina", "bis", "a", "b", "c"];
  const palabrasAEliminar = [...tiposVia, ...indicadores];

  const esNumero = (palabra) => !isNaN(palabra);

  let palabrasFiltradas = [];
  let encontroNumero = false;

  for (let i = 0; i < palabras.length; i++) {
    const palabra = palabras[i];

    // Si es un número, marcamos que ya encontramos números y lo agregamos
    if (esNumero(palabra)) {
      encontroNumero = true;
      palabrasFiltradas.push(palabra);
    }
    // Si ya encontramos números y esta palabra es eliminable, la omitimos
    else if (encontroNumero && palabrasAEliminar.includes(palabra)) {
      continue; // Saltar palabras indicadoras después de números
    }
    // Cualquier otra palabra la agregamos
    else {
      palabrasFiltradas.push(palabra);
    }
  }

  // 4. Eliminar duplicados consecutivos y unir
  return palabrasFiltradas
    .filter((palabra, index) => palabra !== palabrasFiltradas[index - 1])
    .join(" ")
    .trim();
}

// Función para comparar direcciones
function compararDirecciones() {
  const direccionInput = document.getElementById("via");
  const direccionSistema = document.getElementById("direccionSistema");

  if (!direccionInput || !direccionSistema) {
    console.error("No se encontraron los elementos con los IDs especificados");
    return;
  }

  const valor1 = direccionInput.value; // Valor original del input (ej: "Calle 123 Sur")
  const valor2 = direccionSistema.value; // Valor original del input (ej: "cl 123 s")

  const direccion1Normalizada = normalizarDireccion(valor1); // "calle 123 sur"
  const direccion2Normalizada = normalizarDireccion(valor2); // "calle 123 sur"

  // Comparar las copias normalizadas (no los valores reales)
  const sonIguales = direccion1Normalizada === direccion2Normalizada;

  // Aplicar estilos según el resultado
  if (sonIguales) {
    // Verde para coincidencia
    direccionInput.style.backgroundColor = "#d4edda";
    direccionInput.style.borderColor = "#28a745";
    direccionInput.style.color = "#000000";
    direccionSistema.style.backgroundColor = "#d4edda";
    direccionSistema.style.borderColor = "#28a745";
    direccionSistema.style.color = "#000000";
  } else {
    // Rojo para no coincidencia
    direccionInput.style.backgroundColor = "#f8d7da";
    direccionInput.style.borderColor = "#dc3545";
    direccionInput.style.color = "#000000";
    direccionSistema.style.backgroundColor = "#f8d7da";
    direccionSistema.style.borderColor = "#dc3545";
    direccionSistema.style.color = "#000000";
  }

  return sonIguales;
}

// Función para agregar los event listeners
function inicializarComparadorDirecciones() {
  const direccionInput = document.getElementById("via");
  const direccionSistema = document.getElementById("direccionSistema");

  if (direccionInput && direccionSistema) {
    // Agregar event listeners para comparar en tiempo real
    direccionInput.addEventListener("input", compararDirecciones);
    direccionInput.addEventListener("blur", compararDirecciones);
    direccionSistema.addEventListener("input", compararDirecciones);
    direccionSistema.addEventListener("blur", compararDirecciones);

    // Comparación inicial
    compararDirecciones();
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarComparadorDirecciones);
} else {
  inicializarComparadorDirecciones();
}

// Función adicional para comparar manualmente (opcional)
function compararManualmente(direccion1, direccion2) {
  const normalizada1 = normalizarDireccion(direccion1);
  const normalizada2 = normalizarDireccion(direccion2);
  return normalizada1 === normalizada2;
}

aplicarLimpiezaAInput(direccionInput, Utilidades.limpiarTexto);
aplicarLimpiezaAInput(direccionSistema, Utilidades.limpiarTexto);
aplicarDivisionTexto(direccionInput, complementoInput, palabrasClave);
aplicarDivisionTexto(direccionSistema, complementoAgendador, palabrasClave);

// ===========================================
// EXPORTS
// ===========================================
export {
  procesarCasoDireccionPiloto,
  manejarCasoDireccionPiloto,
  aplicarDivisionTexto,
  compararDirecciones,
};
