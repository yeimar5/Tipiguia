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
        } else if ( contacto == `1` && trabajador == `técnico` && !contingencia && mLlamada == `1`
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
        } else if ( contacto == `2` && !contingencia && mLlamada == `1` && !aceptaInstalar && !suspender
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
        } else if ( contacto == `2` && !contingencia && mLlamada == `1` && aceptaInstalar && !suspender
        ) {
          visualizarPantalla(
            [`#MotivoTec`, `#Musuariod`, `#contingencia`, `#Acepta`],
            `block`
          );
          visualizarPantalla(
            [`#MoQuiebre`, `#fecha`, `#GPS`, `#Soporte`, `#suspender`],
            `none`
          );
        } else if ( contacto == `2` && !contingencia && mLlamada == `1` && !aceptaInstalar && suspender
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