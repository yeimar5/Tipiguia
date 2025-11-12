// ===========================================
// MÓDULO AGENDAMIENTO (CASE 1)
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
} from "../main.mjs";

function procesarCasoAgenda(valores, textos) {
  let notaGenerada = "";
  let mensajeChatbot = "";
  const textoSinContacto = obtenerTextoSinContacto(valores.contacto);
  const agendaNota = ` se reagenda orden para el dia ${textos.fechaFormateada} en la franja ${valores.franjaAgenda} segun indicación de técnico.`;

  if (valores.trabajador === "técnico") {
    mensajeChatbot = valores.fallaChatbot
      ? "Se valida soporte por falla reportada en chatbot"
      : "Se valida chatbot ok.";

    if (valores.contingencia) {
      valores.contacto = "...";
      notaGenerada = valores.suspenderOrden
        ? "POR CONTINGENCIA se deja orden pendiente en aplicativos."
        : ` POR CONTINGENCIA ${agendaNota}`;
    }
  }

  let texto =
    textos.texto +
    mensajeChatbot +
    ` ${textos.titularContacto} ${valores.motivoCliente} `;

  if (esSinContacto(valores.contacto)) {
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
  } else if (valores.contacto === "2") {
    if (valores.aceptaInstalar) {
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
    const primerElemento = document.querySelector("#GPS");
    const segundoElemento = document.querySelector("#fecha");
    ordenarElementos(primerElemento, segundoElemento);

    if (valores.suspenderOrden) {
      mostrarSoloElementos(
        {
          block: ["#MotivoTec"],
          flex: ["#GPS", "#suspender"],
        },
        elementosBaseAgenda
      );
    }
  } else if (valores.contacto === "2" && !valores.contingencia) {
    if (valores.aceptaInstalar && !valores.suspenderOrden) {
      mostrarSoloElementos(
        {
          flex: ["#Acepta"],
          block: ["#MotivoTec", "#Musuariod"],
        },
        elementosBaseAgenda
      );
    } else if (!valores.aceptaInstalar && valores.suspenderOrden) {
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

      if (valores.suspenderOrden) {
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

// ===========================================
// EXPORTS
// ===========================================
export { procesarCasoAgenda, manejarCasoAgenda };
