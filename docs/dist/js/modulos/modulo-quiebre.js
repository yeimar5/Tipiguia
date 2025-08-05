// ===========================================
// MÓDULO QUIEBRE (CASE 2)
// ===========================================

// ===========================================
// IMPORTS DE FUNCIONES AUXILIARES
// ===========================================
import {
  cambiarColorFondo,
  mostrarSoloElementos,
  obtenerTextoSinContacto,
  ValueMostrar,
  esSinContacto,
  toggleElementStat,
  ordenarElementos,
} from "../main.js";

// Función para procesar caso de quiebre
function procesarCasoQuiebre(valores, textos) {
  const textoSinContacto = obtenerTextoSinContacto(valores.contacto);
  let notaGenerada = "";
  let mensajeChatbot = "";
  let prefijoQC = ""; // Para manejar el prefijo QC al inicio

  if (valores.trabajador === "técnico") {
    mensajeChatbot = valores.fallaChatbot
      ? " Se valida soporte por falla reportada en chatbot."
      : " Se valida chatbot ok.";

    if (valores.contingencia) {
      valores.contacto = "...";
      notaGenerada =
        " POR CONTINGENCIA se deja orden suspendida en aplicativos";
    } else {
      if (esSinContacto(valores.contacto) || valores.contacto === "...") {
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
      } else if (valores.contacto === "2") {
        const motivosEspeciales = [
          "TELÉFONO DEL CLIENTE ERRADO",
          "GESTIÓN COMERCIAL/CLIENTE ACEPTA INSTALACIÓN",
          "GESTIÓN COMERCIAL/CLIENTE SOLICITA LLAMAR EN 10 MIN",
        ];

        if (
          valores.aceptaInstalar ||
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
    valores.aceptaInstalar ||
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
        block: ["#MotivoTec", "#MoQuiebre"],
        flex: ["#notaAplicativos"],
      },
      elementosBaseQuiebre
    );
  } else {
    mostrarSoloElementos(
      {
        block: ["#MotivoTec"],
      },
      elementosBaseQuiebre
    );
    toggleElementStat("Contacto", false);
  }

  ValueMostrar("#Mtecnico", "titular desea cancelar el servicio por ");
}

export {manejarCasoQuiebre,procesarCasoQuiebre}