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