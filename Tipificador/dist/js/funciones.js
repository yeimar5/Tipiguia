document.addEventListener("click", manejarClick);
document.addEventListener("change", manejarCambio);

var nombreAsesor;
var agentAsesor;

function guardarEnLocalStorage() {
    nombreAsesor = document.getElementById("NomAgent").value;
    agentAsesor = document.getElementById("Agent").value;

    localStorage.setItem("nombreAsesor", nombreAsesor);
    localStorage.setItem("agentAsesor", agentAsesor);
}

// Mostrar los valores del localStorage en los inputs correspondientes
if (localStorage.getItem("nombreAsesor")) {
    document.getElementById("NomAgent").value = localStorage.getItem("nombreAsesor");
}
if (localStorage.getItem("agentAsesor")) {
    document.getElementById("Agent").value = localStorage.getItem("agentAsesor").replace("agent_", "");
}

function manejarClick(evento) {
    const targetId = evento.target.id;
    const actions = {
        "copiar": () => copiarYAlertar(document.getElementById("NombreTec").value, alerta),
        "copiar1": () => copiarYAlertar(document.getElementById("cedula").value, alerta),
        "copiar2": () => {
            let texto = document.getElementById("telefono").value.replace("57", "");
            copiarYAlertar(texto, alerta);
        },
        "copiar3": () => copiarYAlertar(document.getElementById("atis").value, alerta),
        "button-addon1": manejarBotonAddon1,
        "limpiar": resetearFormularios,
        "Tipificar": manejarCambio,
        "CopiarT": copiarEnTipificar,
        "imagen": subirImagen,
        "guardarCambios": guardarEnLocalStorage
    };

    if (actions[targetId]) {
        actions[targetId]();
    }
}

function manejarCambio(e) {
    let mLlamada = document.querySelector("#Motivo").value;
    let soporteNA = document.querySelector("#NS").value;
    let contacto = document.querySelector("#Contacto").value;
    let trabajador = document.querySelector("#rol").value;
    let contingencia = document.getElementById("Contingencia").checked;
    let aceptaInstalar = document.getElementById("Aceptains").checked;
    let suspender = document.getElementById("sus").checked;

    switch (mLlamada) {
        case "1": // agendar
            cambiarColorFondo("#28A745");
            if (e.target.matches("#Motivo") || e.target.matches("#Contacto") || e.target.matches("#rol") || e.target.matches("#Aceptains") || e.target.matches("#Contingencia") || e.target.matches("#sus")) {
                visualizarPantalla(["#chatbot", "#contingencia", "#contacto"], "block");
                visualizarPantalla(["#Titular", "#contacto"], "flex");
                visualizarPantalla(["#Soporte"], "none");

                if (trabajador == "gestor" && contacto == "...") {
                    visualizarPantalla(["#MotivoTec"], "block");
                    visualizarPantalla(["#MoQuiebre", "#Musuariod", "#fecha", "#GPS", "#Soporte", "#contingencia", "#Acepta", "#chatbot", "#suspender"], "none");
                } else if (trabajador == "gestor" && contacto == "1") {
                    visualizarPantalla(["#MotivoTec"], "block");
                    visualizarPantalla(["#MoQuiebre", "#Musuariod", "#fecha", "#GPS", "#Soporte", "#contingencia", "#Acepta", "#chatbot", "#suspender"], "none");
                } else if (contacto == "1" && trabajador == "tecnico" && !contingencia && mLlamada == "1") {
                    visualizarPantalla(["#GPS", "#MotivoTec", "#contacto"], "block");
                    visualizarPantalla(["#MoQuiebre", "#Soporte", "#Musuariod", "#fecha", "#Acepta", "#contingencia", "#suspender"], "none");
                } else if (contacto == "2" && !contingencia && mLlamada == "1" && !aceptaInstalar && !suspender) {
                    visualizarPantalla(["#MotivoTec", "#Musuariod", "#Acepta", "#fecha", "#suspender"], "block");
                    visualizarPantalla(["#MoQuiebre", "#GPS", "#Soporte", "#contingencia"], "none");
                } else if (contacto == "2" && !contingencia && mLlamada == "1" && aceptaInstalar && !suspender) {
                    visualizarPantalla(["#MotivoTec", "#Musuariod", "#contingencia", "#Acepta"], "block");
                    visualizarPantalla(["#MoQuiebre", "#fecha", "#GPS", "#Soporte", "#suspender"], "none");
                } else if (contacto == "2" && !contingencia && mLlamada == "1" && !aceptaInstalar && suspender) {
                    visualizarPantalla(["#MotivoTec", "#Musuariod", "#fecha", "#suspender"], "block");
                    visualizarPantalla(["#MoQuiebre", "#GPS", "#Soporte", "#contingencia", "#Acepta", "#fecha"], "none");
                } else if (contingencia && contacto != "1") {
                    visualizarPantalla(["#MotivoTec", "#contacto"], "block");
                    visualizarPantalla(["#MoQuiebre", "#Musuariod", "#fecha", "#GPS", "#Soporte", "#Acepta", "#suspender"], "none");
                } else if (contingencia) {
                    visualizarPantalla(["#MotivoTec", "#GPS", "#contacto"], "block");
                    visualizarPantalla(["#MoQuiebre", "#Musuariod", "#fecha", "#Soporte", "#Acepta", "#suspender"], "none");
                } else if (!contingencia) {
                    visualizarPantalla(["#MotivoTec"], "block");
                    visualizarPantalla(["#MoQuiebre", "#Musuariod", "#fecha", "#GPS", "#Soporte"], "none");
                }
            }
            ValueMostrar("#Mtecnico", "");
            break;
        case "2": // quiebres
            cambiarColorFondo("#FF0000");
            visualizarPantalla(["#contingencia", "#Titular"], "block");
            visualizarPantalla(["#Titular"], "flex");
            visualizarPantalla(["#Soporte", "#chatbot"], "none");

            if (e.target.matches("#Motivo") || e.target.matches("#Contacto") || e.target.matches("#rol") || e.target.matches("#Contingencia")) {
                visualizarPantalla(["#chatbot", "#Acepta"], "none");

                if (trabajador == "gestor" && contacto == "...") {
                    visualizarPantalla(["#MotivoTec", "#contacto"], "block");
                    visualizarPantalla(["#MoQuiebre", "#Musuariod", "#fecha", "#contingencia", "#GPS", "#Soporte", "#suspender"], "none");
                } else if (trabajador == "gestor" && contacto == "1" && !contingencia) {
                    visualizarPantalla(["#MotivoTec", "#contacto"], "block");
                    visualizarPantalla(["#MoQuiebre", "#Musuariod", "#fecha", "#contingencia", "#GPS", "#Soporte", "#suspender"], "none");
                } else if (trabajador == "tecnico" && contacto == "1" && !contingencia) {
                    visualizarPantalla(["#MoQuiebre", "#MotivoTec", "#GPS", "#contacto"], "block");
                    visualizarPantalla(["#Soporte", "#Musuariod", "#fecha", "#contingencia", "#suspender"], "none");
                } else if (contacto == "2" && !contingencia && mLlamada == "2") {
                    visualizarPantalla(["#MotivoTec", "#Musuariod", "#MoQuiebre", "#contacto", "#suspender"], "block");
                    visualizarPantalla(["#fecha", "#GPS", "#Soporte", "#contingencia"], "none");
                } else if (contingencia) {
                    visualizarPantalla(["#MotivoTec", "#MoQuiebre", "#nomt", "#numt"], "block");
                    visualizarPantalla(["#Musuariod", "#fecha", "#GPS", "#contacto", "#Soporte", "#suspender"], "none");
                } else if (!contingencia) {
                    visualizarPantalla(["#MotivoTec", "#contacto", "#nomt", "#numt"], "block");
                    visualizarPantalla(["#MoQuiebre", "#Musuariod", "#fecha", "#GPS", "#Soporte"], "none");
                }
            }
            ValueMostrar("#Mtecnico", "");
            break;
        case "3": // soporte no aplica
            if (e.target.matches("#Motivo") || e.target.matches("#NS")) {
                cambiarColorFondo("#F18F13");
                visualizarPantalla(["#chatbot", "#Acepta", "#suspender"], "none");

                if (["11", "6", "13", "14", "3", "9", "4"].includes(soporteNA)) {
                    visualizarPantalla(["#MotivoTec", "#Musuariod", "#Soporte", "#Titular"], "block");
                    visualizarPantalla(["#fecha", "#MoQuiebre", "#GPS", "#contacto", "#contingencia"], "none");
                } else {
                    visualizarPantalla(["#MotivoTec", "#Soporte"], "block");
                    visualizarPantalla(["#MoQuiebre", "#Musuariod", "#fecha", "#GPS", "#contacto", "#Titular", "#contingencia"], "none");
                }
            }
            ValueMostrar("#Mtecnico", "");
            break;
        case "4": // Gestion decos
            visualizarPantalla(["#MotivoTec", "#Musuariod", "#Titular"], "block");
            visualizarPantalla(["#Titular"], "flex");
            visualizarPantalla(["#fecha", "#MoQuiebre", "#GPS", "#Soporte", "#contacto", "#contingencia"], "none");
            ValueMostrar("#Mtecnico", "para adicionar un decodificador a la orden ");
            break;
        case "5": // Gestion piloto
            visualizarPantalla(["#MotivoTec", "#Acepta"], "block");
            visualizarPantalla(["#MoQuiebre", "#Musuariod", "#fecha", "#GPS", "#Soporte", "#chatbot", "#contacto", "#Titular", "#contingencia", "#suspender"], "none");
            ValueMostrar("#Mtecnico", "para validar recibo publico con dirección:  \nen sistema esta: ");
            break;
        default:
            cambiarColorFondo("#1392F1");
            visualizarPantalla(["#Soporte", "#Musuariod", "#fecha", "#GPS", "#MoQuiebre", "#contingencia", "#Titular", "#Acepta", "#contacto", "#chatbot", "#suspender"], "none");
            ValueMostrar("#Mtecnico", "");
    }
}

function copiarYAlertar(t, callback) {
    try {
        copiarAlPortapapeles(t);
        callback(t);
    } catch (error) {
        console.error("Error al copiar al portapapeles:", error);
    }
}

function manejarBotonAddon1() {
    try {
        const atis = document.getElementById("atis").value;
        const cuota = document.getElementById("Fecha").value;
        const franja = document.getElementById("Franja").value;
        const texto = `¡Hola! Solicito un cupo para el día ${cuota} en la franja ${franja} para la orden 100000${atis}`;

        copiarAlPortapapeles(texto);
        alerta(texto, 1);
    } catch (error) {
        console.error("Error al copiar al portapapeles:", error);
    }
}

function resetearFormularios() {
    datosTecnico.reset();
    Formulario.reset();
}

function copiarEnTipificar() {
    let motivoLlamada = document.querySelector("#Motivo").value;
    let motivoTecnico = document.getElementById("Mtecnico").value;
    let numeroTitular = document.getElementById("NumTitular").value;
    let nombreTitular = document.getElementById("NomTitular").value;
    let contingenciaActiva = document.getElementById("Contingencia").checked;
    let aLaEsperadeInstalacion = document.getElementById("Aceptains").checked;
    let trabajador = document.getElementById("rol").value;
    let contactoConTitular = document.getElementById("Contacto").value;
    let motivoQuiebre = document.getElementById("exampleDataList").value;
    let motivoCliente = document.getElementById("Musuario").value;
    let fechaAgenda = document.getElementById("Fecha").value;
    let franjaAgenda = document.getElementById("Franja").value;
    let gpsActivo = document.getElementById("gps").value;
    let soporteFotografico = document.getElementById("SF").value;
    let fallaChatbot = document.getElementById("FC").checked;
    let suspenderOrden = document.getElementById("sus").checked;
    nombreAsesor = document.getElementById("NomAgent").value;
    agentAsesor = "agent_" + document.getElementById("Agent").value;
    let mensajeChatbot = "";
    let notaGenerada = "";
    let texto = "";

    switch (motivoLlamada) {
        case "1": // agendar

            texto = `LINEA RESCATE Se comunica ${trabajador} informando ${motivoTecnico} `;

            if (trabajador === "tecnico") {
                mensajeChatbot = fallaChatbot ? "Se valida soporte por falla en chatbot" : "Se valida chatbot ok.";
                texto += mensajeChatbot + ` se marca al número ${numeroTitular} titular ${nombreTitular} ${motivoCliente} `;

                if (contingenciaActiva) {
                    notaGenerada = "POR CONTINGENCIA se deja orden pendiente en aplicativos.";
                } else if (contactoConTitular === "1") {
                    notaGenerada = "No contesta, Se Valida GPS " + gpsActivo + " Se Valida SOPORTE FOTOGRÁFICO " + soporteFotografico;
                    notaGenerada += (gpsActivo === "OK" && soporteFotografico === "OK") ? " se deja orden pendiente por reagendar." : " Se le indica a tecnico dirigirse al predio y Subir Soporte fotográfico.";
                } else if (contactoConTitular === "2") {
                    if (aLaEsperadeInstalacion) {
                        notaGenerada = "indica que esta a la espera de instalación, valida datos correctos.";
                    } else if (suspenderOrden) {
                        notaGenerada = "se deja orden pendiente por agendar.";
                    } else {
                        notaGenerada = " se reagenda para " + fechaAgenda + " En la franja " + franjaAgenda;
                    }
                }
            } else if (trabajador === "gestor") {
                texto += ` se marca al número ${numeroTitular} titular ${nombreTitular} ${motivoCliente} `;
                if (contactoConTitular === "1") {
                    notaGenerada = "no contesta se le indica a gestor que intente mas tarde para proceder con la gestión.";
                } else if (contactoConTitular === "2") {
                    if (aLaEsperadeInstalacion) {
                        notaGenerada = "indica que esta a la espera de instalación, valida datos correctos.";
                    } else if (suspenderOrden) {
                        notaGenerada = "se deja orden pendiente por agendar.";
                    } else {
                        notaGenerada = " se reagenda para " + fechaAgenda + " En la franja " + franjaAgenda;
                    }
                }
            }

            texto += notaGenerada + ` Gestionado por ${nombreAsesor} ${agentAsesor}.`;
            break;

        case "2": // quiebre
            if (contingenciaActiva) {
                texto = `QC - ${motivoQuiebre} LINEA RESCATE Se comunica ${trabajador} informando Titular desea cancelar el servicio ${motivoTecnico} no se marca al número ${numeroTitular} titular ${nombreTitular} POR CONTINGENCIA se deja orden suspendida en aplicativos Gestionado por ${nombreAsesor} ${agentAsesor}`;
            } else if (contactoConTitular == "2" && motivoQuiebre != "TELEFONO DEL CLIENTE ERRADO" && motivoQuiebre != "GESTIÓN COMERCIAL/CLIENTE ACEPTA INSTALACIÓN" && motivoQuiebre != "GESTIÓN COMERCIAL/CLIENTE SOLICITA LLAMAR EN 10 MIN" && !suspenderOrden) {
                texto = `QC - ${motivoQuiebre} LINEA RESCATE Se comunica ${trabajador} informando Titular desea cancelar el servicio ${motivoTecnico} Se marca al número ${numeroTitular} titular ${nombreTitular} ${motivoCliente} se hace objeción pero desiste valida datos, se procede a quebrar orden Gestionado por ${nombreAsesor} ${agentAsesor}`;
            } else if (contactoConTitular == "2" && motivoQuiebre != "TELEFONO DEL CLIENTE ERRADO" && motivoQuiebre != "GESTIÓN COMERCIAL/CLIENTE ACEPTA INSTALACIÓN" && motivoQuiebre != "GESTIÓN COMERCIAL/CLIENTE SOLICITA LLAMAR EN 10 MIN" && suspenderOrden) {
                texto = `QC - ${motivoQuiebre} LINEA RESCATE Se comunica ${trabajador} informando Titular desea cancelar el servicio ${motivoTecnico} Se marca al número ${numeroTitular} titular ${nombreTitular} ${motivoCliente} se deja orden suspendida en aplicativos Gestionado por ${nombreAsesor} ${agentAsesor}`;
            } else if (contactoConTitular == "2" && motivoQuiebre == "GESTIÓN COMERCIAL/CLIENTE ACEPTA INSTALACIÓN" && motivoQuiebre != "TELEFONO DEL CLIENTE ERRADO" && motivoQuiebre != "GESTIÓN COMERCIAL/CLIENTE SOLICITA LLAMAR EN 10 MIN") {
                texto = `LINEA RESCATE Se comunica técnico  informando Titular desea cancelar el servicio ${motivoTecnico} Se marca al número ${numeroTitular} titular ${nombreTitular} ${motivoCliente} se hace objeción acepta instalación, valida datos correctos Gestionado por ${nombreAsesor} ${agentAsesor}`;
            } else if (contactoConTitular == "2" && motivoQuiebre == "GESTIÓN COMERCIAL/CLIENTE SOLICITA LLAMAR EN 10 MIN" && motivoQuiebre != "TELEFONO DEL CLIENTE ERRADO") {
                texto = `LINEA RESCATE Se comunica técnico  informando Titular desea cancelar el servicio ${motivoTecnico} Se marca al número ${numeroTitular} titular ${nombreTitular} ${motivoCliente} solicita que lo llamen en 10 MIN Gestionad por ${nombreAsesor} ${agentAsesor}`;
            } else if (contactoConTitular == "2" && motivoQuiebre == "TELEFONO DEL CLIENTE ERRADO") {
                texto = `QC - ${motivoQuiebre} LINEA RESCATE Se comunica ${trabajador} informando que ${motivoTecnico} Se marca al número ${numeroTitular} titular ${nombreTitular} ${motivoCliente} se valida SOPORTE FOTOGRÁFICO OK se valida GPS OK se procede a suspender orden Gestionado por ${nombreAsesor} ${agentAsesor}`;
            } else if (contactoConTitular == "1") {
                if (gpsActivo == "OK" && soporteFotografico == "OK" && motivoQuiebre != "INCUMPLIMIENTO DE CITA ATRIBUIBLE A TITULAR") {
                    texto = `QC - ${motivoQuiebre} LINEA RESCATE Se comunica ${trabajador} informando Titular desea cancelar el servicio ${motivoTecnico} Se marca al número ${numeroTitular} titular ${nombreTitular} No contesta Se Valida GPS ${gpsActivo} Se Valida SOPORTE FOTOGRÁFICO ${soporteFotografico} se procede a  suspender orden Gestionado por ${nombreAsesor} ${agentAsesor}.`;
                } else if (motivoQuiebre == "INCUMPLIMIENTO DE CITA ATRIBUIBLE A TITULAR" && gpsActivo == "OK" && soporteFotografico == "OK") {
                    texto = `QC - ${motivoQuiebre} LINEA RESCATE Se comunica ${trabajador} informando que ${motivoTecnico} Se marca al número ${numeroTitular} titular ${nombreTitular} no contesta se valida SOPORTE FOTOGRÁFICO ${soporteFotografico}  se valida GPS ${gpsActivo} , YA QUE LLEVA MAS DE TRES VECES DE NO CONTACTO CON CLIENTE SE  PROCEDE A QUEBRAR ORDEN Gestionado por ${nombreAsesor} ${agentAsesor}.`;
                } else {
                    texto = `LINEA RESCATE Se comunica técnico informando que el cliente desea cancelar el servicio ${motivoTecnico} Se marca al número ${numeroTitular} titular ${nombreTitular} No contesta Se Valida GPS ${gpsActivo} Se Valida SOPORTE FOTOGRÁFICO ${soporteFotografico} Se le indica a Tecnico dirigirse al predio y Subir Soporte fotográfico Gestionado por ${nombreAsesor} ${agentAsesor}.`;
                }
            }

            if (contactoConTitular == "1" && trabajador == "gestor") {
                texto = `LINEA RESCATE Se comunica Gestor informando que el cliente desea cancelar el servicio  ${motivoTecnico} Se marca al número ${numeroTitular} titular ${nombreTitular} no contesta se le indica a gestor que favor envié técnico a predio para proceder con la gestión Gestionado por ${nombreAsesor} ${agentAsesor}`;
            } else if (contactoConTitular == "2" && trabajador == "gestor" && suspenderOrden) {
                texto = `QC - ${motivoQuiebre} LINEA RESCATE Se comunica Gestor informando que el cliente desea cancelar el servicio  ${motivoTecnico} Se marca al número ${numeroTitular} titular ${nombreTitular} ${motivoCliente} se deja orden suspendida en aplicativos Gestionado por ${nombreAsesor} ${agentAsesor}`;
            }

            break;
        case "3": // soporte no aplica
            const soporteNoAplica = document.querySelector("#NS").value;

            if (soporteNoAplica == "1") {
                texto = `LINEA RESCATE Se comunica ${trabajador} informando ${motivoTecnico} se valida chatbot y no ha realizado el proceso o no ha esperado respuesta se le recuerda parámetros del aplicativo a tener en cuenta antes de comunicarse con la linea y posibles causas por las cuales debe validar en caso de fallo por centro comando según la información. se le brinda ticket Gestionado por ${nombreAsesor} ${agentAsesor}`;
            } else if (soporteNoAplica == "2") {
                texto = `LINEA RESCATE Se comunica ${trabajador} informando ${motivoTecnico} se entrega ticket Gestionado  por ${nombreAsesor} ${agentAsesor}`;
            } else if (soporteNoAplica == "3") {
                texto = `LINEA RESCATE Se comunica ${trabajador} informando ${motivoTecnico}  Se marca al número ${numeroTitular} titular ${nombreTitular} contesta ${motivoCliente} se le indica que en linea de rescate no se gestiona ordenes porque le falten materiales debe realizar autogestión o validar con su gestor Gestionado por ${nombreAsesor} ${agentAsesor}`;
            } else if (soporteNoAplica == "4") {
                texto = `LINEA RESCATE Se comunica ${trabajador} informando ${motivoTecnico}  Se marca al número ${numeroTitular} titular ${nombreTitular} contesta ${motivoCliente} se le informa que esta gestión no se realiza por linea de rescate que valide con cierre controlado o con su gestor Gestionado por ${nombreAsesor} ${agentAsesor}`;
            } else if (soporteNoAplica == "6") {
                texto = `LINEA RESCATE Se comunica ${trabajador} informando ${motivoTecnico}  Se marca al número ${numeroTitular} titular ${nombreTitular} contesta ${motivoCliente} se le indica a Tecnico que debe hacer autogestión o validar con gestor ya que en linea de rescate no se gestiona ordenes por lluvias  Gestionad por ${nombreAsesor} ${agentAsesor}`;
            } else if (soporteNoAplica == "7") {
                texto = `LINEA RESCATE Se comunica ${trabajador} informando ${motivoTecnico} se valida orden se encuentra en franja  am se le indica que en linea rescate solo gestionamos ordenes en am máximo hasta las 1 pm  se le indica a técnico hacer autogestión o validar con su gestor  Gestionado por ${nombreAsesor} ${agentAsesor}`;
            } else if (soporteNoAplica == "8") {
                texto = `LINEA RESCATE Se comunica ${trabajador} informando ${motivoTecnico}  se valida orden esta se encuentra en otro estado se le indica a Tecnico no se puede gestionar esta orden se le indica validar con gestor Gestionado  por ${nombreAsesor} ${agentAsesor}`;
            } else if (soporteNoAplica == "9") {
                texto = `LINEA RESCATE Se comunica ${trabajador} informando ${motivoTecnico}  Se marca al número ${numeroTitular} titular ${nombreTitular} contesta ${motivoCliente} se le indica que en linea de rescate no se gestiona orden porque no pueda llegar al predio debe validar con gestor o hacer autogestión Gestionado por ${nombreAsesor} ${agentAsesor}`;
            } else if (soporteNoAplica == "10") {
                texto = `LINEA RESCATE Se comunica ${trabajador} informando que la dirección del predio es errada o no encuentra dirección del predio se le indica comunicarse con gestor o hacer autogestión ya que desde Linea de rescate no se gestionan por ese motivo Gestionad por ${nombreAsesor} ${agentAsesor}`;
            } else if (soporteNoAplica == "11") {
                texto = `LINEA RESCATE Se comunica ${trabajador} informando ${motivoTecnico}  Se marca al número ${numeroTitular} titular ${nombreTitular} contesta ${motivoCliente} se indica a tecnico que este proceso no lo hace LR que debe validar con su gestor o con cierre controlado. Gestionado por ${nombreAsesor} ${agentAsesor}`;
            } else if (soporteNoAplica == "13") {
                texto = `LINEA RESCATE Se comunica ${trabajador} informando ${motivoTecnico}  Se marca al número ${numeroTitular} titular ${nombreTitular} contesta ${motivoCliente} se le informa a Tecnico hacer autogestión por dirección errada Gestionado por ${nombreAsesor} ${agentAsesor}`;
            } else if (soporteNoAplica == "14") {
                texto = `LINEA RESCATE Se comunica ${trabajador} informando ${motivoTecnico}  Se marca al número ${numeroTitular} titular ${nombreTitular} ${motivoCliente} se solicita la baja de perfil en speedy Gestionado por ${nombreAsesor} ${agentAsesor}`;
            } else if (soporteNoAplica == "15") {
                texto = `LINEA RESCATE Se comunica ${trabajador} informando ${motivoTecnico}  se valida orden y es una avería, se le indica que desde linea de rescate no se gestiona que se comunique con gestor o cierre controlado Gestionado por ${nombreAsesor} ${agentAsesor}`;
            }

            break;
        case "4": // Gestion de decos
            texto = `LINEA RESCATE Se comunica ${trabajador} ${motivoTecnico}  Se marca al número ${numeroTitular} titular ${nombreTitular} ${motivoCliente} se valida datos correctos y se actualiza TAG de equipos Gestionado por ${nombreAsesor} ${agentAsesor}`;
            break;
        case "5": // Direccion piloto
            let respuesta = "";
            if (aLaEsperadeInstalacion) {
                respuesta = "SI";
            } else {
                respuesta = "NO";
            }
            texto = `LINEA RESCATE Se comunica ${trabajador} ${motivoTecnico} aceptación de línea de rescate ${respuesta}, Gestionado por ${nombreAsesor} ${agentAsesor}`;
            texto = texto.replaceAll("|", "").replace(/\s+/g, " ");
            break;
        case "6":
            texto = `LINEA RESCATE Se comunica ${trabajador} ${motivoTecnico} pero se cae la llamada sin poder validar la información  Gestionado por ${nombreAsesor} ${agentAsesor}`;
            break;
    }

    copiarYAlertar(texto, alerta);
}

function alerta(text) {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-start",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
    });

    Toast.fire({
        icon: "success",
        title: "NOTA COPIADA",
        text: text,
    });
}

async function copiarAlPortapapeles(txt) {
    await navigator.clipboard.writeText(txt);
}

async function subirImagen() {
    const { value: file } = await Swal.fire({
        title: "Cambiar Fondo",
        input: "file",
        inputAttributes: {
            accept: "image/*",
            "aria-label": "Subir Fondo",
        },
    });

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            Swal.fire({
                title: "Su fondo Ha Sido Cambiado",
            });
            const base64Image = e.target.result;
            document.body.style.backgroundImage = `url(${base64Image})`;
            localStorage.setItem("imagenFondo", base64Image);
        };
        reader.readAsDataURL(file);
    }
}

// Recuperar y mostrar la imagen de fondo guardada en el localStorage al cargar la página
window.onload = function () {
    const imagenFondoGuardada = localStorage.getItem("imagenFondo");
    if (imagenFondoGuardada) {
        document.body.style.backgroundImage = `url(${imagenFondoGuardada})`;
    }
};

function visualizarPantalla(selectors, displayValue) {
    selectors.forEach((selector) => {
        document.querySelector(selector).style.display = displayValue;
    });
}

function cambiarColorFondo(color) {
    document.getElementById("color").style.background = color;
}

function setInnerHTML(selector, html) {
    document.querySelector(selector).innerHTML = html;
}

function ValueMostrar(selector, valorValue) {
    document.querySelector(selector).textContent = valorValue;
}

