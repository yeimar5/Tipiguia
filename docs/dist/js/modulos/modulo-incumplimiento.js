// ===========================================
// MÓDULO INCUMPLIMIENTO (CASE 0)
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
} from "../main.js";

function procesarCasoIncumplimiento(valores, textos) {
  let notaGenerada = "";
  let mensajeChatbot = "";
  const textoSinContacto = obtenerTextoSinContacto(valores.contacto);
  let texto = textos.texto + mensajeChatbot + ` ${textos.titularContacto} `;

  if (valores.trabajador === "técnico") {
    mensajeChatbot = valores.fallaChatbot
      ? "Se valida soporte por falla reportada en chatbot"
      : "Se valida chatbot ok.";

    if (valores.contingencia) {
      valores.contacto = "...";
      notaGenerada = "POR CONTINGENCIA se deja orden pendiente en aplicativos";
    } else {
      if (esSinContacto(valores.contacto)) {
        notaGenerada = `${textoSinContacto}, Se Valida GPS ${valores.gpsActivo} Se Valida SOPORTE FOTOGRÁFICO ${valores.soporteFotografico}`;
        if (valores.gpsActivo === "OK" && valores.soporteFotografico === "OK") {
          notaGenerada +=
            " Se deja orden pendiente en aplicativos por no contacto con cliente";
        } else {
          notaGenerada +=
            " Se le indica a técnico dirigirse al predio y Subir Soporte fotográfico";
        }
      } else if (valores.contacto === "2") {
        notaGenerada += ` contesta e indica que ${valores.motivoCliente}`;
        if (valores.aceptaInstalar) {
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
        if (!valores.suspenderOrden && !valores.aceptaInstalar) {
          mostrarSoloElementos(
            {
              block: ["#Musuariod"],
              flex: ["#suspender", "#Acepta"],
            },
            elementosBaseIncumplimiento
          );
        } else if (valores.suspenderOrden && !valores.aceptaInstalar) {
          mostrarSoloElementos(
            {
              block: ["#Musuariod", "#fecha"],
              flex: ["#suspender"],
            },
            elementosBaseIncumplimiento
          );
        } else if (!valores.suspenderOrden && valores.aceptaInstalar) {
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

export { manejarCasoIncumplimiento, procesarCasoIncumplimiento };
