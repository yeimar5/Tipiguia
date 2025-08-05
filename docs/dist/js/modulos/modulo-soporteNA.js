// ===========================================
// MÓDULO SOPORTE NO APLICA (CASE 3)
// ===========================================

// ===========================================
// IMPORTS DE FUNCIONES AUXILIARES
// ===========================================
import {
  cambiarColorFondo,
  mostrarSoloElementos,
  ValueMostrar,
} from "../main.js";


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

// Función para manejar caso soporte no aplica en manejarCambio
function manejarCasoSoporteNoAplica(valores) {
  cambiarColorFondo("#F18F13");

  const soportesConTitular = ["11", "6", "13", "14", "3", "9", "4", "16"];

  if (soportesConTitular.includes(valores.motivoNoAplica)) {
    mostrarSoloElementos({
      block: ["#MotivoTec", "#Musuariod", "#Soporte"],
      flex: ["#Titular"],
    });
  } else {
    mostrarSoloElementos({
      block: ["#MotivoTec", "#Soporte"],
    });
    if (valores.motivoNoAplica === "7") {
      mostrarSoloElementos({
        block: ["#MotivoTec", "#Soporte"],
        flex: ["#jornadaSelect"],
      });
    }
  }

  ValueMostrar("#Mtecnico", "");
}

export { procesarCasoSoporteNoAplica, manejarCasoSoporteNoAplica };
