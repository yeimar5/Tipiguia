const formulario = document.getElementById("Formulario");
document.addEventListener("click", manejarClick);
formulario.addEventListener("change", manejarCambio);

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

function manejarCambio(e) {
  Actualizartodo(); //va actualizando la nota automaticamente no borrar
  let mLlamada = document.querySelector(`#Motivo`).value;
  let soporteNA = document.querySelector(`#noSoporte`).value;
  let contacto = document.querySelector(`#Contacto`).value;
  let trabajador = document.querySelector(`#rol`).value;
  let contingencia = document.getElementById(`Contingencia`).checked;
  let aceptaInstalar = document.getElementById(`Aceptains`).checked;
  let suspender = document.getElementById(`sus`).checked;
  if (Actualizartodo) {
    switch (mLlamada) {
      case `1`: // agendar
        cambiarColorFondo(`#2d8215`);
        visualizarPantalla([`#contingencia`], `block`);
        visualizarPantalla([`#chatbot`,`#Titular`, `#contacto`], `flex`);
        visualizarPantalla([`#Soporte`], `none`);

        if (trabajador == `gestor` && contacto == `...`) {
          visualizarPantalla([`#MotivoTec`], `block`);
          visualizarPantalla(
            [
              `#MoQuiebre`,
              `#Musuariod`,
              `#fecha`,
              `#GPS`,
              `#Soporte`,
              `#contingencia`,
              `#Acepta`,
              `#chatbot`,
              `#suspender`,
            ],
            `none`
          );
        } else if (trabajador == `gestor` && contacto == `1`) {
          visualizarPantalla([`#MotivoTec`], `block`);
          visualizarPantalla(
            [
              `#MoQuiebre`,
              `#Musuariod`,
              `#fecha`,
              `#GPS`,
              `#Soporte`,
              `#contingencia`,
              `#Acepta`,
              `#chatbot`,
              `#suspender`,
            ],
            `none`
          );
        } else if (
          contacto == `1` &&
          trabajador == `técnico` &&
          !contingencia &&
          mLlamada == `1`
        ) {
          visualizarPantalla([`#MotivoTec`], `block`);
          visualizarPantalla([`#GPS`, `#contacto`], `flex`);
          visualizarPantalla(
            [
              `#MoQuiebre`,
              `#Soporte`,
              `#Musuariod`,
              `#fecha`,
              `#Acepta`,
              `#contingencia`,
              `#suspender`,
            ],
            `none`
          );
        } else if (
          contacto == `2` &&
          !contingencia &&
          mLlamada == `1` &&
          !aceptaInstalar &&
          !suspender
        ) {
          visualizarPantalla([`#Acepta`, `#suspender`], `block`);
          visualizarPantalla(
            [`#MotivoTec`, `#Musuariod`,  `#fecha`],
            `block`
          );
          visualizarPantalla(
            [`#MoQuiebre`, `#GPS`, `#Soporte`, `#contingencia`],
            `none`
          );
        } else if (
          contacto == `2` &&
          !contingencia &&
          mLlamada == `1` &&
          aceptaInstalar &&
          !suspender
        ) {
          visualizarPantalla(
            [`#MotivoTec`, `#Musuariod`, `#contingencia`, `#Acepta`],
            `block`
          );
          visualizarPantalla(
            [`#MoQuiebre`, `#fecha`, `#GPS`, `#Soporte`, `#suspender`],
            `none`
          );
        } else if (
          contacto == `2` &&
          !contingencia &&
          mLlamada == `1` &&
          !aceptaInstalar &&
          suspender
        ) {
          visualizarPantalla(
            [`#MotivoTec`, `#Musuariod`, `#fecha`, `#suspender`],
            `block`
          );
          visualizarPantalla(
            [
              `#MoQuiebre`,
              `#GPS`,
              `#Soporte`,
              `#contingencia`,
              `#Acepta`,
              `#fecha`,
            ],
            `none`
          );
        } else if (contingencia && contacto != `1`) {
          visualizarPantalla([`#MotivoTec`], `block`);
          visualizarPantalla(
            [
              `#MoQuiebre`,
              `#Musuariod`,
              `#contacto`,
              `#fecha`,
              `#GPS`,
              `#Soporte`,
              `#Acepta`,
              `#suspender`,
            ],
            `none`
          );
        } else if (contingencia) {
          visualizarPantalla([`#MotivoTec`], `block`);
          visualizarPantalla(
            [
              `#MoQuiebre`,
              `#Musuariod`,
              `#fecha`,
              `#GPS`,
              `#Soporte`,
              `#Acepta`,
              `#suspender`,
            ],
            `none`
          );
        } else if (!contingencia) {
          visualizarPantalla([`#MotivoTec`], `block`);
          visualizarPantalla(
            [`#MoQuiebre`, `#Musuariod`, `#fecha`, `#GPS`, `#Soporte`],
            `none`
          );
        }

        ValueMostrar(`#Mtecnico`, `solicitan reagendar la orden para el día `);
        break;
      case `2`: // quiebres
        cambiarColorFondo(`#dc4c4c`);
        visualizarPantalla([`#contingencia`], `block`);
        visualizarPantalla([`#Titular`,`#chatbot`], `flex`);
        visualizarPantalla([`#Soporte`,  `#Acepta`], `none`);

        if (trabajador == `gestor` && contacto == `...`) {
          visualizarPantalla([`#MotivoTec`], `block`);
          visualizarPantalla([`#contacto`], `flex`);
          visualizarPantalla(
            [
              `#MoQuiebre`,
              `#Musuariod`,
              `#fecha`,
              `#contingencia`,
              `#GPS`,
              `#Soporte`,
              `#suspender`,
            ],
            `none`
          );
        } else if (trabajador == `gestor` && contacto == `1` && !contingencia) {
          visualizarPantalla([`#MotivoTec`], `block`);
          visualizarPantalla([`#contacto`], `flex`);
          visualizarPantalla(
            [
              `#MoQuiebre`,
              `#Musuariod`,
              `#fecha`,
              `#contingencia`,
              `#GPS`,
              `#Soporte`,
              `#suspender`,
            ],
            `none`
          );
        } else if (
          trabajador == `técnico` &&
          contacto == `1` &&
          !contingencia
        ) {
          visualizarPantalla([`#MoQuiebre`, `#MotivoTec`], `block`);
          visualizarPantalla([`#contacto`, `#GPS`], `flex`);
          visualizarPantalla(
            [`#Soporte`, `#Musuariod`, `#fecha`, `#contingencia`, `#suspender`],
            `none`
          );
        } else if (contacto == `2` && !contingencia && mLlamada == `2`) {
          visualizarPantalla(
            [`#MotivoTec`, `#Musuariod`, `#MoQuiebre`, `#suspender`],
            `block`
          );
          visualizarPantalla([`#contacto`], `flex`);
          visualizarPantalla(
            [`#fecha`, `#GPS`, `#Soporte`, `#contingencia`],
            `none`
          );
        } else if (contingencia) {
          visualizarPantalla(
            [`#MotivoTec`, `#MoQuiebre`, `#nomt`, `#numt`],
            `block`
          );
          visualizarPantalla(
            [
              `#Musuariod`,
              `#fecha`,
              `#GPS`,
              `#contacto`,
              `#Soporte`,
              `#suspender`,
            ],
            `none`
          );
        } else if (!contingencia) {
          visualizarPantalla([`#MotivoTec`, `#nomt`, `#numt`], `block`);
          visualizarPantalla([`#contacto`], `flex`);
          visualizarPantalla(
            [`#MoQuiebre`, `#Musuariod`, `#fecha`, `#GPS`, `#Soporte`],
            `none`
          );
        }

        ValueMostrar(`#Mtecnico`, `titular desea cancelar el servicio por `);
        break;
      case `3`: // soporte no aplica
        cambiarColorFondo(`#F18F13`);
        visualizarPantalla([`#chatbot`, `#Acepta`, `#suspender`], `none`);

        if ([`11`, `6`, `13`, `14`, `3`, `9`, `4`].includes(soporteNA)) {
          visualizarPantalla([`#MotivoTec`, `#Musuariod`, `#Soporte`], `block`);
          visualizarPantalla([`#Titular`], `flex`);
          visualizarPantalla(
            [`#fecha`, `#MoQuiebre`, `#GPS`, `#contacto`, `#contingencia`],
            `none`
          );
        } else {
          visualizarPantalla([`#MotivoTec`, `#Soporte`], `block`);
          visualizarPantalla(
            [
              `#MoQuiebre`,
              `#Musuariod`,
              `#fecha`,
              `#GPS`,
              `#contacto`,
              `#Titular`,
              `#contingencia`,
            ],
            `none`
          );
        }

        ValueMostrar(`#Mtecnico`, ``);
        break;
      case `4`: // Gestion decos
        cambiarColorFondo(`#00ccfe`);
        visualizarPantalla([`#MotivoTec`, `#Musuariod`], `block`);
        visualizarPantalla([`#Titular`, `#contacto`, `#chatbot`], `flex`);
        visualizarPantalla(
          [`#fecha`, `#MoQuiebre`, `#GPS`, `#Soporte`, `#contingencia`,`#Acepta`, `#suspender`],
          `none`
        );
        ValueMostrar(
          `#Mtecnico`,
          `titular solicita adicionar un decodificador a la orden para un total de `
        );
        break;
      case `5`: // Gestion piloto
        cambiarColorFondo(`#c3c3c3`);
        visualizarPantalla([`#MotivoTec`, `#Acepta`], `block`);
        visualizarPantalla(
          [
            `#MoQuiebre`,
            `#Musuariod`,
            `#fecha`,
            `#GPS`,
            `#Soporte`,
            `#chatbot`,
            `#contacto`,
            `#Titular`,
            `#contingencia`,
            `#suspender`,
          ],
          `none`
        );
        ValueMostrar(
          `#Mtecnico`,
          `para validar recibo publico con dirección  \nen sistema esta `
        );
        break;
      case `6`: // llamada caida
        cambiarColorFondo(`#9513f1`);
        break;
      default:
        cambiarColorFondo(`#1392F1`);
        visualizarPantalla(
          [
            `#Soporte`,
            `#Musuariod`,
            `#fecha`,
            `#GPS`,
            `#MoQuiebre`,
            `#contingencia`,
            `#Titular`,
            `#Acepta`,
            `#contacto`,
            `#chatbot`,
            `#suspender`,
          ],
          `none`
        );
        ValueMostrar(`#Mtecnico`, ``);
    }
  }
  crearNota();
}

function copiarYAlertar(t, callback) {
  try {
    copiarAlPortapapeles(t);
    callback(t);
  } catch (error) {
    console.error(`Error al copiar al portapapeles:`, error);
  }
}

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

function resetearFormularios() {
  datosTecnico.reset();
  Formulario.reset();

  // Restablecer la altura de los textareas
  const textareas = document.querySelectorAll("textarea");
  textareas.forEach((textarea) => {
    textarea.style.height = "auto";
    textarea.rows = 2; // Establecer el número de líneas inicial
  });
}

function crearNota() {
  let motivoLlamada = document.querySelector(`#Motivo`).value;
  let motivoTecnico = document.getElementById("Mtecnico").value;
  let numeroTitular = document.getElementById(`NumTitular`).value;
  let nombreTitular = document.getElementById(`NomTitular`).value;
  let contingenciaActiva = document.getElementById(`Contingencia`).checked;
  let aLaEsperadeInstalacion = document.getElementById(`Aceptains`).checked;
  let trabajador = document.getElementById(`rol`).value;
  let contactoConTitular = document.getElementById(`Contacto`).value;
  let motivoQuiebre = document.getElementById(`mQuiebre`).value;
  let motivoCliente = document.getElementById(`Musuario`).value;
  let fechaAgenda = document.getElementById(`Fecha`).value;
  let franjaAgenda = document.getElementById(`Franja`).value;
  let gpsActivo = document.getElementById(`gps`).value;
  let soporteFotografico = document.getElementById(`SF`).value;
  let fallaChatbot = document.getElementById(`FC`).checked;
  let suspenderOrden = document.getElementById(`sus`).checked;
  nombreAsesor = document.getElementById(`NomAgent`).value;
  agentAsesor = `agent_` + document.getElementById(`Agent`).value;
  let textoNota = document.getElementById(`textoNota`);
  //mensajes
  let notaGenerada = ``;
  let titularContacto = `se marca al número ${numeroTitular} titular ${nombreTitular}`;
  let gestion = ` Gestionado por ${nombreAsesor} ${agentAsesor}.`;
  let mensajeChatbot = ``;
  let texto = `LINEA RESCATE Se comunica ${trabajador} informando que ${motivoTecnico} `;

  switch (motivoLlamada) {
    case `1`: // agendar
      if (trabajador === `técnico`) {
        mensajeChatbot = fallaChatbot
          ? `Se valida soporte por falla reportada en chatbot`
          : `Se valida chatbot ok.`;

        if (contingenciaActiva) {
          notaGenerada = `POR CONTINGENCIA se deja orden pendiente en aplicativos.`;
        }
      }
      texto += mensajeChatbot + ` ${titularContacto} ${motivoCliente} `;
      if (contactoConTitular === `1`) {
        if (trabajador === `gestor`) {
          notaGenerada = `no contesta se le indica a gestor que intente mas tarde para proceder con la gestión.`;
        } else {
          notaGenerada =
            `No contesta, Se Valida GPS ` +
            gpsActivo +
            ` Se Valida SOPORTE FOTOGRÁFICO ` +
            soporteFotografico;
          notaGenerada +=
            gpsActivo === `OK` && soporteFotografico === `OK`
              ? ` se deja orden pendiente por reagendar.`
              : ` Se le indica a técnico dirigirse al predio y Subir Soporte fotográfico.`;
        }
      } else if (contactoConTitular === `2`) {
        if (aLaEsperadeInstalacion) {
          notaGenerada = `indica que esta a la espera de instalación, valida datos correctos.`;
        } else if (suspenderOrden) {
          notaGenerada = `se deja orden pendiente por agendar.`;
        } else {
          notaGenerada =
            ` se reagenda para ` +
            fechaAgenda +
            ` En la franja ` +
            franjaAgenda;
        }
      }

      texto += notaGenerada;
      break;
    case `2`: // quiebre

    if (trabajador === `técnico`) {
      mensajeChatbot = fallaChatbot
        ? `, se valida soporte por falla reportada en chatbot`
        : `, se valida chatbot ok.`;
      }

      texto += mensajeChatbot
      if (contactoConTitular == "1") {
        if (trabajador == "gestor") {
          texto += `${titularContacto}. No contesta se le indica a gestor que intente mas tarde para proceder con la gestión.`;
        } else {
          if (contingenciaActiva) {
            texto = `QC - ${motivoQuiebre} - ${texto} no ${titularContacto} POR CONTINGENCIA se deja orden suspendida en aplicativos`;
          } else if (gpsActivo === "OK" && soporteFotografico === "OK") {
            texto = `QC - ${motivoQuiebre} - ${texto} ${titularContacto}. No contesta. Se valida SOPORTE FOTOGRÁFICO ${soporteFotografico}. Se valida GPS ${gpsActivo}. Se deja orden suspendida en aplicativos.`;
          } else {
            texto += `${titularContacto}. No contesta. Se valida GPS ${gpsActivo}. Se valida SOPORTE FOTOGRÁFICO ${soporteFotografico}. Se le indica al técnico dirigirse al predio y subir soporte fotográfico.`;
          }
        }
      } else {
        if (contactoConTitular == "2") {
          if (
            motivoQuiebre !== "TELEFONO DEL CLIENTE ERRADO" &&
            motivoQuiebre !== "GESTIÓN COMERCIAL/CLIENTE ACEPTA INSTALACIÓN" &&
            motivoQuiebre !==
              "GESTIÓN COMERCIAL/CLIENTE SOLICITA LLAMAR EN 10 MIN"
          ) {
            if (!suspenderOrden) {
              texto = `QC - ${motivoQuiebre} - ${texto} ${titularContacto} ${motivoCliente}. Se hace objeción pero desiste, valida datos, se procede a quebrar orden.`;
            } else {
              texto = `QC - ${motivoQuiebre} - ${texto} ${titularContacto} ${motivoCliente}. Se deja orden suspendida en aplicativos.`;
            }
          } else {
            if (
              motivoQuiebre === "GESTIÓN COMERCIAL/CLIENTE ACEPTA INSTALACIÓN"
            ) {
              texto += `${motivoCliente}. Se hace objeción, acepta instalación y valida datos correctos.`;
            } else if (
              motivoQuiebre ===
              "GESTIÓN COMERCIAL/CLIENTE SOLICITA LLAMAR EN 10 MIN"
            ) {
              texto += `${titularContacto} ${motivoCliente}. Solicita que lo llamen en 10 minutos.`;
            } else {
              if (
                motivoQuiebre === "TELEFONO DEL CLIENTE ERRADO" &&
                trabajador === "gestor"
              ) {
                texto = `QC - ${motivoQuiebre} - ${texto} ${titularContacto} ${motivoCliente}. se indica que debe enviar tecnico a predio para poder suspender la orden.`;
              } else {
                texto = `QC - ${motivoQuiebre} - ${texto} ${titularContacto} ${motivoCliente}. Se valida SOPORTE FOTOGRÁFICO OK, se valida GPS OK, se procede a suspender orden.`;
              }
            }
          }
        }
      }
      break;
    case `3`: // soporte no aplica
      const soporteNoAplica = document.querySelector(`#noSoporte`).value;
      const mensajes = {
        1: `se valida chatbot y no ha realizado el proceso, se le indica que debe realizar el poceso antes de comunicarse con la linea y si hay fallo reportarlo con su gestor para que reporten a centro comando, se le brinda ticket`,
        2: `se valida chatbot y no ha esperado respuesta se le recuerda parámetros del aplicativo a tener en cuenta antes de comunicarse con la linea y si hay alguna falla reportarlo con centro comando. se le brinda ticket`,
        3: `se entrega ticket`,
        4: `${titularContacto} contesta ${motivoCliente} se le indica que en linea de rescate no se gestiona ordenes porque le falten materiales debe realizar autogestión o validar con su gestor`,
        5: `${titularContacto} contesta ${motivoCliente} se le informa que esta gestión no se realiza por linea de rescate que valide con cierre controlado o con su gestor`,
        6: `${titularContacto} contesta ${motivoCliente} se le indica a Tecnico que debe hacer autogestión o validar con gestor ya que en linea de rescate no se gestiona ordenes por lluvias`,
        7: `se valida orden se encuentra en franja am se le indica que en linea rescate solo gestionamos ordenes en am máximo hasta las 1 pm se le indica a técnico hacer autogestión o validar con su gestor`,
        8: `se valida orden esta se encuentra en otro estado se le indica a Tecnico no se puede gestionar esta orden se le indica validar con gestor`,
        9: `${titularContacto} contesta ${motivoCliente} se le indica que en linea de rescate no se gestiona orden porque no pueda llegar al predio debe validar con gestor o hacer autogestión`,
        10: `LINEA RESCATE Se comunica ${trabajador} informando que la dirección del predio es errada o no encuentra dirección del predio se le indica comunicarse con gestor o hacer autogestión ya que desde Linea de rescate no se gestionan por ese motivo`,
        11: `${titularContacto} contesta ${motivoCliente} se indica a técnico que este proceso no lo hace LR que debe validar con su gestor o con cierre controlado.`,
        12: `se valida orden se encuentra en franja am se le indica que en linea rescate solo se puede hacer cambio de franja máximo hasta las 12 pm se le indica a técnico hacer autogestión o validar con su gestor`,
        13: `${titularContacto} contesta ${motivoCliente} se le informa a Tecnico hacer autogestión por dirección errada`,
        14: `${titularContacto} ${motivoCliente} se solicita la baja de perfil en speedy`,
        15: `se valida orden y es una avería, se le indica que desde linea de rescate no se gestiona que se comunique con gestor o cierre controlado`,
      };

      texto += mensajes[soporteNoAplica];

      break;
    case `4`: // Gestion de decos
      mensajeChatbot = fallaChatbot? `, se valida soporte por falla reportada en chatbot`: `, se valida chatbot ok.`;
      texto += mensajeChatbot + ` ${titularContacto} ${motivoCliente}`;
      if (contactoConTitular == `2`) {
        texto += ` se valida datos correctos y se actualiza TAG de equipos`;
      } else {
        if (contactoConTitular == `1`) {
          texto += ` no hay contacto se indica a técnico que le diga al titular que este pendiente de la llamada e intente nuevamente`;
        }
      }
      break;
    case `5`: // Direccion piloto
      let respuesta = ``;
      if (aLaEsperadeInstalacion) {
        respuesta = `SI`;
      } else {
        respuesta = `NO`;
      }
      texto += ` aceptación de línea de rescate ` + respuesta;
      break;
    case `6`:
      texto += ` pero se cae la llamada sin poder validar la información`;
      break;
  }
  texto += gestion;
  texto = texto.replace(/\|/g, ``).replace(/\s+/g, ` `).replace(/\¿/g, `Ñ`);
  textoNota.value = texto;
}

function alerta(text) {
  const Toast = Swal.mixin({
    toast: true,
    position: `top-start`,
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener(`mouseenter`, Swal.stopTimer);
      toast.addEventListener(`mouseleave`, Swal.resumeTimer);
    },
  });

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
      const reader = new FileReader();
      reader.onload = (e) => {
        Swal.fire({
          title: `Su fondo Ha Sido Cambiado`,
        });
        const base64Image = e.target.result;
        document.body.style.backgroundImage = `url(${base64Image})`;
        localStorage.setItem(`imagenFondo`, base64Image);
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
  } catch (error) {
    console.error(`Error al subir la imagen:`, error);
  }
}

window.onload = function () {
  // Recuperar y mostrar la imagen de fondo guardada en el localStorage al cargar la página
  const imagenFondoGuardada = localStorage.getItem("imagenFondo");
  if (imagenFondoGuardada) {
    document.body.style.backgroundImage = `url(${imagenFondoGuardada})`;
  }

  const nombreAsesor = localStorage.getItem("nombreAsesor");
  const agentAsesor = localStorage.getItem("agentAsesor");
};

function guardarEnLocalStorage() {
  const nombreAsesor = document.getElementById("NomAgent").value;
  const agentAsesor = document.getElementById("Agent").value;

  localStorage.setItem("nombreAsesor", nombreAsesor);
  localStorage.setItem("agentAsesor", agentAsesor);
  // Cerrar el modal
  document.getElementById("close-login").click();
  alerta(`DATOS GUARDADOS\n Exitosamente`);
}

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

function lanzarModal() {
  const nombreAsesor = localStorage.getItem("nombreAsesor");
  const agentAsesor = localStorage.getItem("agentAsesor");
  // Verificar si los valores no son nulos ni vacíos
  if (nombreAsesor && agentAsesor) {
    document.getElementById("NomAgent").value = nombreAsesor;
    document.getElementById("Agent").value = agentAsesor.replace("agent_", "");
    // Mostrar el modal usando Bootstrap
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
        // Mostrar el modal usando Bootstrap
        const modal = new bootstrap.Modal(
          document.getElementById("login-modal")
        );
        modal.show();
      }
    });
  }
}
