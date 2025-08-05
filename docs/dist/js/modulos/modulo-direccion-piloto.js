// ===========================================
// MÓDULO DIRECCIÓN PILOTO (CASE 5)
// ===========================================

// ===========================================
// IMPORTS DE FUNCIONES AUXILIARES
// ===========================================
import {
  cambiarColorFondo,
  mostrarSoloElementos,
  setInnerHTML,
  ValueMostrar,
} from "../main.js";

// ===========================================
// FUNCIONES ESPECÍFICAS PARA DIRECCIÓN PILOTO
// ===========================================

// Función para procesar caso de dirección piloto en la creación de nota
function procesarCasoDireccionPiloto(valores, textos) {
  let respuesta = "";
  if (valores.aceptarRecibo === "SI") {
    respuesta = "SI se da aceptación al recibo publico";
  } else if (valores.aceptarRecibo === "NO") {
    respuesta = ` NO se acepta el recibo porque ${valores.motivoCliente}`;
  } else {
    respuesta = "";
  }
  let reciboPublico = valores.direcionenRecibo
    ? `en recibo publico esta ${valores.direcionenRecibo}`
    : "";
  let sistema = valores.direccionAgendador
    ? `y en sistema está ${valores.direccionAgendador}`
    : "";

  return textos.texto + ` ${reciboPublico} ${sistema} ${respuesta}`;
}

// Función para manejar la interfaz visual del caso dirección piloto
function manejarCasoDireccionPiloto(valores) {
  cambiarColorFondo("#c3c3c3");
  const elementosBasePiloto = {
    block: ["#MotivoTec", "#DRP"],
    flex: ["#seccionDireccionSistema"],
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
      ValueMostrar(
        "#Musuario",
        "la direccion no es legible, se encuentra borrosa"
      );
    } else {
      ValueMostrar("#Musuario", "");
    }
  }

  ValueMostrar("#Mtecnico", "requieren corrección en la dirección, ");
}

// ===========================================
// EXPORTS
// ===========================================
export { procesarCasoDireccionPiloto, manejarCasoDireccionPiloto };
