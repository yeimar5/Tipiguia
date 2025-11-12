// ===========================================
// MÓDULO GESTION DECOS (CASE 4)
// ===========================================

// ===========================================
// IMPORTS DE FUNCIONES AUXILIARES
// ===========================================
import {
  cambiarColorFondo,
  mostrarSoloElementos,
  ValueMostrar,
  obtenerTextoSinContacto,
  esSinContacto
} from "../main.mjs";

// Función para procesar caso de gestión de decos
function procesarCasoGestionDecos(valores, textos) {
  const textoSinContacto = obtenerTextoSinContacto(valores.contacto);
  const mensajeChatbot = valores.fallaChatbot
    ? ", se valida soporte por falla reportada en chatbot"
    : ", se valida chatbot ok.";

  let texto =
    textos.texto +
    mensajeChatbot +
    ` ${textos.titularContacto} ${valores.motivoCliente}`;

  if (valores.contacto === "2") {
    texto += " se valida datos correctos y se actualiza TAG de equipos";
  } else if (esSinContacto(valores.contacto)) {
    texto += ` ${textoSinContacto} se indica a técnico que le diga al titular que este pendiente de la llamada e intente nuevamente`;
  }

  return texto;
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

export{manejarCasoDecos,procesarCasoGestionDecos}