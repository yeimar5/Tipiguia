// Constantes y configuración
const CONFIG = {
  STORAGE_KEYS: {
    BACKGROUND_IMAGE: 'imagenFondo',
    NOMBRE_ASESOR: 'nombreAsesor',
    AGENT_ASESOR: 'agentAsesor'
  },
  TOAST_CONFIG: {
    toast: true,
    position: 'top-start',
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  }
};

// Utilidades generales
class Utils {
  static async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Error al copiar al portapapeles:', error);
      return false;
    }
  }

  static validateDateInText(text) {
    // Patrones para detectar fechas no válidas o vacías
    const datePatterns = [
      /undefined/gi,
      /null/gi,
      /NaN/gi,
      /Invalid Date/gi,
      /para el dia\s*$/gi,
      /se reagenda para\s*$/gi,
      /el día\s*en/gi,
      /día\s*en la franja/gi,
      /\b\d{4}-\d{2}-\d{2}\b/g // Formato yyyy-mm-dd sin procesar
    ];

    // Verificar si el texto contiene indicadores de fecha inválida
    const hasInvalidDate = datePatterns.some(pattern => pattern.test(text));
    
    // Verificar si contiene palabras clave de fechas pero sin fecha válida
    const dateKeywords = [
      'se reagenda orden para el dia',
      'se reagenda para',
      'para el día',
      'el día'
    ];

    const containsDateKeyword = dateKeywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );

    // Si contiene palabras clave de fecha pero no una fecha formateada válida
    const hasFormattedDate = /\b(lunes|martes|miércoles|jueves|viernes|sábado|domingo),?\s+\d{1,2}\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/i.test(text);

    return {
      isValid: !hasInvalidDate && (!containsDateKeyword || hasFormattedDate),
      hasDateContent: containsDateKeyword || hasInvalidDate,
      message: hasInvalidDate || (containsDateKeyword && !hasFormattedDate) 
        ? 'El texto contiene una fecha no válida. Por favor, selecciona una fecha válida en el formulario.'
        : null
    };
  }

  static showToast(text, icon = 'success') {
    const Toast = Swal.mixin(CONFIG.TOAST_CONFIG);
    Toast.fire({ icon, text });
  }

  static formatDate(dateString) {
    try {
      if (!dateString || dateString.trim() === '') {
        return null;
      }
      
      const [year, month, day] = dateString.split('-');
      
      // Validar que los componentes de fecha sean válidos
      if (!year || !month || !day) {
        return null;
      }
      
      const dateObj = new Date(year, month - 1, day);
      
      // Verificar que la fecha sea válida
      if (isNaN(dateObj.getTime())) {
        return null;
      }
      
      const options = { weekday: 'long', day: 'numeric', month: 'long' };
      return dateObj.toLocaleDateString('es-ES', options);
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return null;
    }
  }

  static cleanText(text) {
    return text
      .replace(/\|/g, '')
      .replace(/\s+/g, ' ')
      .replace(/¿/g, 'Ñ')
      .trim();
  }

  static getElementValue(selector, type = 'value') {
    const element = document.querySelector(selector) || 
                   document.getElementById(selector.replace('#', ''));
    
    if (!element) return null;
    
    switch (type) {
      case 'checked': return element.checked;
      case 'value': return element.value;
      default: return element.value;
    }
  }

  static autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}

// Manejador de almacenamiento local
class StorageManager {
  static save(key, value) {
    localStorage.setItem(key, value);
  }

  static get(key) {
    return localStorage.getItem(key);
  }

  static saveUserData(nombre, agent) {
    this.save(CONFIG.STORAGE_KEYS.NOMBRE_ASESOR, nombre);
    this.save(CONFIG.STORAGE_KEYS.AGENT_ASESOR, agent);
  }

  static getUserData() {
    return {
      nombre: this.get(CONFIG.STORAGE_KEYS.NOMBRE_ASESOR),
      agent: this.get(CONFIG.STORAGE_KEYS.AGENT_ASESOR)
    };
  }

  static saveBackgroundImage(imageData) {
    this.save(CONFIG.STORAGE_KEYS.BACKGROUND_IMAGE, imageData);
  }

  static getBackgroundImage() {
    return this.get(CONFIG.STORAGE_KEYS.BACKGROUND_IMAGE);
  }
}

// Clase principal para manejo de notas
class NotaManager {
  constructor() {
    this.formularioData = null;
  }

  // Obtener todos los datos del formulario
  getFormData() {
    return {
      motivoLlamada: Utils.getElementValue('#Motivo'),
      motivoTecnico: Utils.getElementValue('#Mtecnico'),
      numeroTitular: Utils.getElementValue('#NumTitular'),
      nombreTitular: Utils.getElementValue('#NomTitular'),
      contingenciaActiva: Utils.getElementValue('#Contingencia', 'checked'),
      aLaEsperadeInstalacion: Utils.getElementValue('#Aceptains', 'checked'),
      trabajador: Utils.getElementValue('#rol'),
      contactoConTitular: Utils.getElementValue('#Contacto'),
      motivoQuiebre: Utils.getElementValue('#mQuiebre'),
      motivoCliente: Utils.getElementValue('#Musuario'),
      fecha: Utils.getElementValue('#Fecha'),
      franjaAgenda: Utils.getElementValue('#Franja'),
      gpsActivo: Utils.getElementValue('#gps'),
      soporteFotografico: Utils.getElementValue('#SF'),
      fallaChatbot: Utils.getElementValue('#FC', 'checked'),
      suspenderOrden: Utils.getElementValue('#sus', 'checked'),
      nombreAsesor: Utils.getElementValue('#NomAgent'),
      agentAsesor: `agent_${Utils.getElementValue('#Agent')}`,
      soporteNoAplica: Utils.getElementValue('#noSoporte'),
      textoNota: document.getElementById('textoNota')
    };
  }

  // Generar elementos comunes
  generateCommonElements(data) {
    const fechaFormateada = data.fecha ? Utils.formatDate(data.fecha) : null;
    
    return {
      fechaFormateada: fechaFormateada,
      titularContacto: `Titular ${data.nombreTitular} número ${data.numeroTitular}`,
      gestion: ` Gestionado por ${data.nombreAsesor} ${data.agentAsesor}.`,
      mensajeChatbot: data.fallaChatbot 
        ? 'Se valida soporte por falla reportada en chatbot' 
        : 'Se valida chatbot ok.',
      textoBase: `LINEA RESCATE Se comunica ${data.trabajador} informando que ${data.motivoTecnico} `
    };
  }

  // Procesadores específicos por tipo de motivo
  processReagendamiento(data, elements) {
    // *** CORRECCIÓN PRINCIPAL: Validar fecha antes de crear el mensaje ***
    if (!elements.fechaFormateada) {
      // Si no hay fecha válida, retornar un mensaje de error
      return elements.textoBase + 'ERROR: No se ha seleccionado una fecha válida para reagendar la orden. Por favor, selecciona una fecha.';
    }

    const agendaNota = ` se reagenda orden para el dia ${elements.fechaFormateada} en la franja ${data.franjaAgenda} segun indicación de técnico.`;
    let notaGenerada = '';

    if (data.trabajador === 'técnico' && data.contingenciaActiva) {
      notaGenerada = data.suspenderOrden 
        ? 'POR CONTINGENCIA se deja orden pendiente en aplicativos.'
        : ` POR CONTINGENCIA ${agendaNota}`;
    }

    let texto = elements.textoBase + elements.mensajeChatbot + ` ${elements.titularContacto} ${data.motivoCliente} `;

    if (data.contactoConTitular === '1') {
      notaGenerada = this.processSinContacto(data, elements, agendaNota);
    } else if (data.contactoConTitular === '2') {
      notaGenerada = this.processConContacto(data, elements, agendaNota);
    }

    return texto + notaGenerada;
  }

  processSinContacto(data, elements, agendaNota) {
    if (data.trabajador === 'gestor') {
      return 'no contesta se le indica a gestor que intente mas tarde para proceder con la gestión.';
    }

    let nota = `No contesta, Se Valida GPS ${data.gpsActivo} Se Valida SOPORTE FOTOGRÁFICO ${data.soporteFotografico}`;
    
    if (data.gpsActivo === 'OK' && data.soporteFotografico === 'OK') {
      // *** VALIDACIÓN ADICIONAL: Verificar fecha antes de usar agendaNota ***
      if (!elements.fechaFormateada) {
        nota += ' ERROR: No se puede reagendar sin fecha válida. Selecciona una fecha.';
      } else {
        nota += data.suspenderOrden 
          ? ' Se deja orden pendiente por reagendar.'
          : agendaNota;
      }
    } else {
      nota += ' Se le indica a técnico dirigirse al predio y Subir Soporte fotográfico.';
    }

    return nota;
  }

  processConContacto(data, elements, agendaNota) {
    if (data.aLaEsperadeInstalacion) {
      return 'indica que esta a la espera de instalación, valida datos correctos.';
    }
    
    if (data.suspenderOrden) {
      return 'se deja orden pendiente por agendar.';
    }
    
    // *** VALIDACIÓN ADICIONAL: Verificar fecha antes de reagendar ***
    if (!elements.fechaFormateada) {
      return 'ERROR: No se puede reagendar sin fecha válida. Selecciona una fecha.';
    }
    
    return ` se reagenda para ${elements.fechaFormateada} En la franja ${data.franjaAgenda}`;
  }

  processQuiebre(data, elements) {
    let texto = elements.textoBase;
    
    if (data.trabajador === 'técnico') {
      texto += data.fallaChatbot 
        ? ', se valida soporte por falla reportada en chatbot'
        : ', se valida chatbot ok.';
    }

    if (['1', '...'].includes(data.contactoConTitular)) {
      return this.processQuiebreSinContacto(data, elements, texto);
    } else if (data.contactoConTitular === '2') {
      return this.processQuiebreConContacto(data, elements, texto);
    }

    return texto;
  }

  processQuiebreSinContacto(data, elements, texto) {
    if (data.trabajador === 'gestor') {
      return `${texto}${elements.titularContacto}. No contesta se le indica a gestor que intente mas tarde para proceder con la gestión.`;
    }

    if (data.contingenciaActiva) {
      return `QC - ${data.motivoQuiebre} - ${texto} no ${elements.titularContacto} POR CONTINGENCIA se deja orden suspendida en aplicativos`;
    }

    if (data.gpsActivo === 'OK' && data.soporteFotografico === 'OK') {
      return `QC - ${data.motivoQuiebre} - ${texto} ${elements.titularContacto}. No contesta. Se valida SOPORTE FOTOGRÁFICO ${data.soporteFotografico}. Se valida GPS ${data.gpsActivo}. Se deja orden suspendida en aplicativos.`;
    }

    return `${texto}${elements.titularContacto}. No contesta. Se valida GPS ${data.gpsActivo}. Se valida SOPORTE FOTOGRÁFICO ${data.soporteFotografico}. Se le indica al técnico dirigirse al predio y subir soporte fotográfico.`;
  }

  processQuiebreConContacto(data, elements, texto) {
    const motivosEspeciales = [
      'TELÉFONO DEL CLIENTE ERRADO',
      'GESTIÓN COMERCIAL/CLIENTE ACEPTA INSTALACIÓN',
      'GESTIÓN COMERCIAL/CLIENTE SOLICITA LLAMAR EN 10 MIN'
    ];

    if (!motivosEspeciales.includes(data.motivoQuiebre)) {
      const accion = data.suspenderOrden 
        ? 'Se deja orden suspendida en aplicativos.'
        : 'Se hace objeción pero desiste, valida datos, se procede a quebrar orden.';
      return `QC - ${data.motivoQuiebre} - ${texto} ${elements.titularContacto} ${data.motivoCliente}. ${accion}`;
    }

    return this.processMotivosEspeciales(data, elements, texto);
  }

  processMotivosEspeciales(data, elements, texto) {
    const motivosMap = {
      'GESTIÓN COMERCIAL/CLIENTE ACEPTA INSTALACIÓN': 
        `${texto}${data.motivoCliente}. Se hace objeción, acepta instalación y valida datos correctos.`,
      'GESTIÓN COMERCIAL/CLIENTE SOLICITA LLAMAR EN 10 MIN': 
        `${texto}${elements.titularContacto} ${data.motivoCliente}. Solicita que lo llamen en 10 minutos.`,
      'TELÉFONO DEL CLIENTE ERRADO': data.trabajador === 'gestor'
        ? `QC - ${data.motivoQuiebre} - ${texto} ${elements.titularContacto} ${data.motivoCliente}. se indica que debe enviar técnico a predio para poder suspender la orden.`
        : `QC - ${data.motivoQuiebre} - ${texto} ${elements.titularContacto} ${data.motivoCliente}. Se valida SOPORTE FOTOGRÁFICO OK, se valida GPS OK, se procede a suspender orden.`
    };

    return motivosMap[data.motivoQuiebre] || texto;
  }

  processSoporteNoAplica(data, elements) {
    const mensajes = {
      1: 'se valida chatbot y no ha realizado el proceso, se le indica que debe realizar el proceso antes de comunicarse con la linea y si hay fallo reportarlo con su gestor para que reporten a centro comando, se le brinda ticket',
      2: 'se valida chatbot y no ha esperado respuesta se le recuerda parámetros del aplicativo a tener en cuenta antes de comunicarse con la linea y si hay alguna falla reportarlo con centro comando. se le brinda ticket',
      3: 'se entrega ticket',
      4: `${elements.titularContacto} contesta ${data.motivoCliente} se le indica que en linea de rescate no se gestiona ordenes porque le falten materiales debe realizar autogestión o validar con su gestor`,
      5: `${elements.titularContacto} contesta ${data.motivoCliente} se le informa que esta gestión no se realiza por linea de rescate que valide con cierre controlado o con su gestor`,
      6: `${elements.titularContacto} contesta ${data.motivoCliente} se le indica a Técnico que debe hacer autogestión o validar con gestor ya que en linea de rescate no se gestiona ordenes por lluvias`,
      7: 'se valida orden se encuentra en franja am se le indica que en linea rescate solo gestionamos ordenes en am máximo hasta las 1 pm se le indica a técnico hacer autogestión o validar con su gestor',
      8: 'se valida orden esta se encuentra en otro estado se le indica a Técnico no se puede gestionar esta orden se le indica validar con gestor',
      9: `${elements.titularContacto} contesta ${data.motivoCliente} se le indica que en linea de rescate no se gestiona orden porque no pueda llegar al predio debe validar con gestor o hacer autogestión`,
      10: 'se le indica comunicarse con gestor o hacer autogestión ya que desde linea de rescate no se gestionan por ese motivo',
      11: `${elements.titularContacto} contesta ${data.motivoCliente} se indica a técnico que este proceso no lo hace LR que debe validar con su gestor o con cierre controlado.`,
      12: 'se valida orden se encuentra en franja am se le indica que en linea rescate solo se puede hacer cambio de franja máximo hasta las 12 pm se le indica a técnico hacer autogestión o validar con su gestor',
      13: `${elements.titularContacto} contesta ${data.motivoCliente} se le informa a Técnico hacer autogestión por dirección errada`,
      14: `${elements.titularContacto} ${data.motivoCliente} se solicita la baja de perfil en speedy`,
      15: 'se valida orden y es una avería, se le indica que desde linea de rescate no se gestiona que se comunique con gestor o cierre controlado'
    };

    return elements.textoBase + (mensajes[data.soporteNoAplica] || '');
  }

  processGestionDecos(data, elements) {
    let texto = elements.textoBase + elements.mensajeChatbot + ` ${elements.titularContacto} ${data.motivoCliente}`;
    
    if (data.contactoConTitular === '2') {
      texto += ' se valida datos correctos y se actualiza TAG de equipos';
    } else if (data.contactoConTitular === '1') {
      texto += ' no hay contacto se indica a técnico que le diga al titular que este pendiente de la llamada e intente nuevamente';
    }

    return texto;
  }

  processDireccionPiloto(data, elements) {
    const respuesta = data.aLaEsperadeInstalacion 
      ? 'SI' 
      : `NO se acepta porque ${data.motivoCliente}.`;
    
    return elements.textoBase + ` aceptación de línea de rescate ${respuesta}`;
  }

  processLlamadaCaida(elements) {
    return elements.textoBase + ' pero se cae la llamada sin poder validar la información';
  }

  // Método principal para crear notas
  createNote() {
    const data = this.getFormData();
    const elements = this.generateCommonElements(data);
    
    const processors = {
      '1': () => this.processReagendamiento(data, elements),
      '2': () => this.processQuiebre(data, elements),
      '3': () => this.processSoporteNoAplica(data, elements),
      '4': () => this.processGestionDecos(data, elements),
      '5': () => this.processDireccionPiloto(data, elements),
      '6': () => this.processLlamadaCaida(elements)
    };

    let texto = processors[data.motivoLlamada]?.() || elements.textoBase;
    texto += elements.gestion;
    texto = Utils.cleanText(texto);
    
    data.textoNota.value = texto;
  }
}

// Manejador de eventos y acciones
class ActionHandler {
  constructor() {
    this.notaManager = new NotaManager();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const formulario = document.getElementById('Formulario');
    if (formulario) {
      document.addEventListener('click', this.handleClick.bind(this));
      formulario.addEventListener('change', this.handleChange.bind(this));
    }
  }

  handleClick(event) {
    const targetId = event.target.id;
    const actions = {
      copiar: () => this.copyField('NombreTec'),
      copiar1: () => this.copyField('cedula'),
      copiar2: () => this.copyPhoneField(),
      copiar3: () => this.copyField('atis'),
      btnCopiarNota: () => this.copyField('textoNota'),
      pedirCupo: () => this.requestQuota(),
      limpiar: () => this.resetForms(),
      Tipificar: () => this.launchModal(),
      imagen: () => this.uploadImage(),
      guardarCambios: () => this.saveToStorage(),
      btnModificar: () => this.toggleAutoUpdate()
    };

    if (actions[targetId]) {
      actions[targetId]();
    }
  }

  handleChange(event) {
    // Lógica para manejar cambios en el formulario
    this.updateNote();
  }

  async copyField(fieldId) {
  const element = document.getElementById(fieldId);
  if (element) {
    const textToCopy = element.value;

    // Validación personalizada para fecha inválida específica
    if (fieldId === 'textoNota' && textToCopy.includes('se reagenda orden para el dia Invalid Date')) {
      Swal.fire({
        title: 'Fecha no válida',
        text: 'La fecha seleccionada no es válida. Por favor, verifica la fecha.',
        icon: 'warning',
        confirmButtonColor: '#70b578',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    // Validación general ya existente
    if (fieldId === 'textoNota') {
      const dateValidation = Utils.validateDateInText(textToCopy);

      if (!dateValidation.isValid && dateValidation.hasDateContent) {
        Swal.fire({
          title: 'Fecha no válida',
          text: dateValidation.message,
          icon: 'warning',
          confirmButtonColor: '#70b578',
          confirmButtonText: 'Entendido'
        });
        return;
      }
    }

    const success = await Utils.copyToClipboard(textToCopy);
    if (success) {
      Utils.showToast(textToCopy);
    }
  }
}


  async copyPhoneField() {
    const phoneElement = document.getElementById('telefono');
    if (phoneElement) {
      const phoneText = phoneElement.value.replace('57', '');
      const success = await Utils.copyToClipboard(phoneText);
      if (success) {
        Utils.showToast(phoneText);
      }
    }
  }

  async requestQuota() {
    const atis = Utils.getElementValue('#atis');
    const fechaAgenda = Utils.getElementValue('#Fecha');
    const franja = Utils.getElementValue('#Franja');
    
    // Validar que la fecha esté seleccionada
    if (!fechaAgenda || fechaAgenda.trim() === '') {
      Swal.fire({
        title: 'Fecha requerida',
        text: 'Por favor, selecciona una fecha válida antes de solicitar el cupo.',
        icon: 'warning',
        confirmButtonColor: '#70b578',
        confirmButtonText: 'Entendido'
      });
      return;
    }
    
    const fechaFormateada = Utils.formatDate(fechaAgenda);
    
    // *** VALIDACIÓN ADICIONAL: Verificar que el formateo de fecha fue exitoso ***
    if (!fechaFormateada) {
      Swal.fire({
        title: 'Error en fecha',
        text: 'La fecha seleccionada no es válida. Por favor, verifica la fecha.',
        icon: 'error',
        confirmButtonColor: '#70b578',
        confirmButtonText: 'Entendido'
      });
      return;
    }
    
    const texto = `¡Hola! Solicito un cupo para el día ${fechaFormateada} en la franja ${franja} para la orden ${atis}`;
    
    // Validar que el texto generado no tenga fechas inválidas
    const dateValidation = Utils.validateDateInText(texto);
    if (!dateValidation.isValid && dateValidation.hasDateContent) {
      Swal.fire({
        title: 'Error en fecha',
        text: 'La fecha seleccionada no es válida. Por favor, verifica la fecha.',
        icon: 'error',
        confirmButtonColor: '#70b578',
        confirmButtonText: 'Entendido'
      });
      return;
    }
    
    const success = await Utils.copyToClipboard(texto);
    if (success) {
      Utils.showToast('Solicitud de cupo copiada');
    }
  }

  resetForms() {
    const datosTecnico = document.getElementById('datosTecnico');
    const formulario = document.getElementById('Formulario');
    
    if (datosTecnico) datosTecnico.reset();
    if (formulario) formulario.reset();

    // Restablecer textareas
    document.querySelectorAll('textarea').forEach(textarea => {
      textarea.style.height = 'auto';
      textarea.rows = 2;
    });
  }

  async uploadImage() {
    try {
      const { value: file } = await Swal.fire({
        title: 'Cambiar Fondo',
        input: 'file',
        inputAttributes: {
          accept: 'image/*',
          'aria-label': 'Subir Fondo'
        }
      });

      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Image = e.target.result;
          document.body.style.backgroundImage = `url(${base64Image})`;
          StorageManager.saveBackgroundImage(base64Image);
          Swal.fire({ title: 'Su fondo Ha Sido Cambiado' });
        };
        reader.onerror = () => {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo cambiar el fondo. Inténtelo de nuevo.',
            icon: 'error'
          });
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  }

  saveToStorage() {
    const nombreAsesor = Utils.getElementValue('#NomAgent');
    const agentAsesor = Utils.getElementValue('#Agent');

    StorageManager.saveUserData(nombreAsesor, agentAsesor);
    
    const closeButton = document.getElementById('close-login');
    if (closeButton) closeButton.click();
    
    Utils.showToast('DATOS GUARDADOS\n Exitosamente');
  }

  launchModal() {
    const userData = StorageManager.getUserData();
    
    if (userData.nombre && userData.agent) {
      document.getElementById('NomAgent').value = userData.nombre;
      document.getElementById('Agent').value = userData.agent.replace('agent_', '');
      
      const modal = new bootstrap.Modal(document.getElementById('tipificarNota'));
      modal.show();
      this.handleChange();
    } else {
      Swal.fire({
        title: 'DATOS FALTANTES',
        text: 'Por Favor, Ingresa tu Nombre y tu Numero de Agent.',
        iconColor: '#f8f32b',
        icon: 'warning',
        confirmButtonColor: '#70b578',
        confirmButtonText: 'Ingresar datos'
      }).then((result) => {
        if (result.isConfirmed) {
          const modal = new bootstrap.Modal(document.getElementById('login-modal'));
          modal.show();
        }
      });
    }
  }

  updateNote() {
    this.notaManager.createNote();
    const textArea = document.getElementById('textoNota');
    if (textArea) {
      Utils.autoResize(textArea);
    }
  }

  toggleAutoUpdate() {
    const formulario = document.querySelector('#Formulario');
    if (formulario) {
      formulario.removeEventListener('input', this.handleChange);
      const textArea = document.getElementById('textoNota');
      if (textArea) textArea.focus();
    }
  }
}

// Inicialización de la aplicación
class App {
  constructor() {
    this.actionHandler = new ActionHandler();
    this.init();
  }

  init() {
    window.addEventListener('load', this.onWindowLoad.bind(this));
  }

  onWindowLoad() {
    // Recuperar imagen de fondo
    const backgroundImage = StorageManager.getBackgroundImage();
    if (backgroundImage) {
      document.body.style.backgroundImage = `url(${backgroundImage})`;
    }

    // Recuperar datos de usuario (si es necesario)
    const userData = StorageManager.getUserData();
    console.log('Usuario cargado:', userData);
  }
}

// Funciones globales para mantener compatibilidad
function crearNota() {
  const notaManager = new NotaManager();
  notaManager.createNote();
}


// Inicializar la aplicación
const app = new App();