const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const textBtnMusic1 = document.querySelector('#text-btn-musica-1');
const textBtnMusic2 = document.querySelector('#text-btn-musica-2');
const comandos = document.querySelector('.comandos-voz-container');


let recognition = null;

if (!SpeechRecognition) {
  alert("Tu navegador no soporta la API de reconocimiento de voz.");
    comandos.classList.add('oculto');
    comandos.classList.add('scale');
} else {
  recognition = new SpeechRecognition();

  recognition.lang = 'es-ES';
  recognition.continuous = true;
  recognition.interimResults = true;

  let ultimoComando = "";
  let esperandoCancion = false;

  const normalizar = str =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/gi, '').toLowerCase();

  recognition.onresult = function(event) {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      transcript += event.results[i][0].transcript.toLowerCase().trim();
    }

    if (transcript === ultimoComando && transcript !== 'siguiente') return;

    const containerOcultador = document.querySelector('.container-ocultador');

    // === Detectar si se está diciendo una canción ===
    if (canciones.some(c => transcript.includes(normalizar(c.titulo)))) {
      // Esperar resultado final antes de actuar
      if (!event.results[event.results.length - 1].isFinal) {
        recognition.lang = 'en-EN';
        esperandoCancion = true;
        return;
      }

      recognition.lang = 'es-ES'; // Restaurar a español

      recognition.interimResults = true;
      esperandoCancion = false;

      if (!menuCanciones.classList.contains('esconder') && !containerOcultador.classList.contains('oculto')) {
        const index = canciones.findIndex(c =>
          normalizar(transcript).includes(normalizar(c.titulo))
        );

        if (index !== -1) {
          reproducirCancion(index);

          const reproductor = document.querySelector('.reproductor');
          if (reproductor.classList.contains('oculto-rep')) {
            reproductor.classList.remove('oculto-rep');
          }

          if (!reproductor.classList.contains('oculto-rep')) {
            setTimeout(() => {
              menuCanciones.classList.add('height-menu');
            }, 900);
          } else {
            menuCanciones.classList.remove('height-menu');
          }
        } else {
          console.log("No se encontró la canción.");
        }
      }

      ultimoComando = transcript;
      return;
    }

    // ==== COMANDOS POR VOZ ====
    switch (true) {
      // == TEMAS == //
      case transcript.includes("cambiar tema"):
        $("#menu-temas").slideDown(100);
        $("#menu-temas").removeClass("invisible");
        $(".arrow-down").addClass("girar-flecha");
        if (!$("#menu-temas").hasClass("invisible") && transcript.includes("principal")) {
          setTimeout(() => {
          $("#menu-temas").slideUp(100);
          $("#menu-temas").addClass("invisible");
          $(".arrow-down").removeClass("girar-flecha");
          }, 1600);
          aplicarTema("principal");
        } else if (transcript.includes("frutiger")) {
          setTimeout(() => {
          $("#menu-temas").slideUp(100);
          $("#menu-temas").addClass("invisible");
          $(".arrow-down").removeClass("girar-flecha");
          }, 1600);
          aplicarTema("frutiger");
        } else if (transcript.includes("retro")) {
          setTimeout(() => {
          $("#menu-temas").slideUp(100);
          $("#menu-temas").addClass("invisible");
          $(".arrow-down").removeClass("girar-flecha");            
          }, 1600);
          aplicarTema("retro");
        }
        break;

      case transcript.includes("cerrar temas"):
        $("#menu-temas").slideUp(100);
        $("#menu-temas").addClass("invisible");
        $(".arrow-down").removeClass("girar-flecha");
        break;

      case transcript.includes("frutiger"):
        aplicarTema("frutiger");
        break;

      case transcript.includes("retro"):
        aplicarTema("retro");
        break;

      case transcript.includes("principal"):
        aplicarTema("principal");
        break;

      // == TABLERO == //
        case transcript.includes('tablero verde'):
          setBoardColor("#4ddf4f");
          $(".colores-board").slideUp(200).addClass('invisible');
        break;

        case transcript.includes('tablero azul'):
          setBoardColor("#00ffee");
          $(".colores-board").slideUp(200).addClass('invisible');
        break;

        case transcript.includes('tablero morado'):
          setBoardColor("#6a0dad");
          $(".colores-board").slideUp(200).addClass('invisible');
        break;

        case transcript.includes('cambiar tablero'):
          $(".colores-board").slideDown(200).removeClass('invisible');
        break;

        case transcript.includes('verde'):
          setTimeout(() => {
            if($(!".colores-board").slideDown(200).removeClass('invisible')) {
            $(".colores-board").slideUp(200).addClass('invisible');
            }
          }, 1600);
          setBoardColor("#4ddf4f");
        break;

        case transcript.includes('azul'):
          setTimeout(() => {
            if($(!".colores-board").slideDown(200).removeClass('invisible')) {
            $(".colores-board").slideUp(200).addClass('invisible');
            }
          }, 1600);
          setBoardColor("#00ffee");
        break;

        case transcript.includes('morado'):
          setTimeout(() => {
            if($(!".colores-board").slideDown(200).removeClass('invisible')) {
            $(".colores-board").slideUp(200).addClass('invisible');
            }
          }, 1600);
            setBoardColor("#6a0dad");
        break;
          
        case transcript.includes('cerrar tableros'):
            $(".colores-board").slideUp(200).addClass('invisible');
        break;

      // == DIFICULTAD == //
      case transcript.includes("dificultad"):
        $(".dificultades").slideDown(100);
        $(".dificultades").removeClass("invisible");
        $(".arrow-down-2").addClass("girar-flecha");
        if (!$(".dificultades").hasClass("invisible") && transcript.includes("fácil")) {
          setTimeout(() => {
            $(".dificultades").slideUp(100);
            $(".dificultades").addClass("invisible");
            $(".arrow-down-2").removeClass("girar-flecha");
          }, 1600);
          aplicarDificultad("Fácil");
        } else if (transcript.includes("normal")) {
          setTimeout(() => {
            $(".dificultades").slideUp(100);
            $(".dificultades").addClass("invisible");
            $(".arrow-down-2").removeClass("girar-flecha");
          }, 1600);
          aplicarDificultad("Normal");
        } else if (transcript.includes("difícil")) {
          setTimeout(() => {
            $(".dificultades").slideUp(100);
            $(".dificultades").addClass("invisible");
            $(".arrow-down-2").removeClass("girar-flecha");
          }, 1600);
          aplicarDificultad("Difícil");
        }
        break;

      case transcript.includes("cerrar menú"):
            $(".dificultades").slideUp(100);
            $(".dificultades").addClass("invisible");
            $(".arrow-down-2").removeClass("girar-flecha");
      break;

      case transcript.includes("modo fácil"):
        aplicarDificultad("Fácil");
        break;

      case transcript.includes("modo normal"):
        aplicarDificultad("Normal");
        break;

      case transcript.includes("modo difícil"):
        aplicarDificultad("Difícil");
        break;

      // == SONIDO == //
      case transcript.includes("con sonido"):
        if (!activarAudio.classList.contains('oculto')) {
          desactivarAudio.classList.remove('oculto');
          activarAudio.classList.add('oculto');
        }
        break;

      case transcript.includes("sin sonido"):
        if (activarAudio.classList.contains('oculto')) {
          activarAudio.classList.remove('oculto');
          desactivarAudio.classList.add('oculto');
        }
        break;

      // == PLAYLIST == //
      case transcript.includes("activar música"):
        if(containerOcultador.classList.contains('oculto')) {
          containerOcultador.classList.remove('oculto');
          playListContainer.classList.remove('esconder');
          textBtnMusic1.classList.add('invisible');
          textBtnMusic2.classList.remove('invisible');
          const elegirCancion = document.querySelector('.elegir-cancion');
          elegirCancion.classList.remove('oculto')
          setTimeout(() => {
            elegirCancion.classList.add('oculto');
          }, 6000);
        }  
        break;

      case transcript.endsWith("quitar música"):
        if(!containerOcultador.classList.contains('oculto') && musica) {
          containerOcultador.classList.add('oculto');
          playListContainer.classList.add('esconder');
          textBtnMusic1.classList.remove('invisible');
          textBtnMusic2.classList.add('invisible');
          musica.pause();
          musica.currentTime = 0;
          musica.src = '';
          musica = null;
          const reproductor = document.querySelector('.reproductor');
          reproductor.classList.add('oculto-rep');
          menuCanciones.classList.remove('height-menu');
          document.querySelectorAll('.cancion').forEach(c => c.classList.remove('sonando'));
        } else if(!containerOcultador.classList.contains('oculto')) {
            containerOcultador.classList.add('oculto');
            playListContainer.classList.add('esconder');
            textBtnMusic1.classList.remove('invisible');
            textBtnMusic2.classList.add('invisible');
        }
        break;

        case transcript.includes('esconder música'):
          if(!playListContainer.classList.contains('esconder')) {
            playlistContainer.classList.add('esconder');
            arrowDown3.classList.add('girar-flecha');
          }
        break;

        case transcript.includes('mostrar música'):
          if(playListContainer.classList.contains('esconder')) {
            playlistContainer.classList.remove('esconder');
            arrowDown3.classList.remove('girar-flecha');
          }
        break;

        // == REPRODUCTOR == //
        case transcript.endsWith('reproducir música'):
            musica.play();
            playSound.classList.add('invisible');
            stopSound.classList.remove('invisible');
            displayImg.classList.add('girar-img-cancion');
        break;

        case transcript.includes('parar música'):
            musica.pause();
            playSound.classList.remove('invisible');
            stopSound.classList.add('invisible');
            displayImg.classList.remove('girar-img-cancion');
        break;

        case transcript.includes('siguiente'):
          if (ultimoComando !== 'siguiente') {
            btnSiguiente.click();
            ultimoComando = 'siguiente';
          }
        break;

        case transcript.includes('anterior'):
          if (ultimoComando !== 'anterior') {
            btnAnterior.click();
            ultimoComando = 'anterior';
          }
        break;

        case transcript.includes('repetir'):
          repetirCancion = !repetirCancion;
          replay.classList.add('s-reproductor', repetirCancion);
          iconoRepetir1.classList.add('color-icono-1-repetir');
        break;

        case transcript.includes('cancelar repetición'):
          if(replay.classList.contains('s-reproductor')) {
            repetirCancion = !repetirCancion;
            replay.classList.remove('s-reproductor');
            iconoRepetir1.classList.remove('color-icono-1-repetir');
          }
        break;

        case transcript.includes("bajar volumen"):
          if(volumeOff.classList.contains('invisible')) {
              volumeIcons.click();
          }
        break;

        case transcript.endsWith("subir volumen"):
          if(!volumeOff.classList.contains('invisible')) {
              volumeIcons.click();
          }
        break;

        // == MANDO == //
        case transcript.includes("activar mando"):
          btnMando.click();
        break;

        // == JUEGO == //
        case transcript.endsWith('jugar'):
          resetBtn.click();
        break;

        case transcript.includes('reiniciar'):
          const textReset = document.querySelector('#resetText');
          if(!textReset.classList.contains('oculto')) {
            resetBtn.click();
          }
        break;

        case transcript.includes('pausa'):
          if(paused == false) {
            pausa.click();
          }
        break;

        case transcript.includes('continuar'):
          if(paused == true) {
            reanudar.click();
          }
        break;

        //== Controles ==//
        case transcript.includes('controles de teclado'):
          tecladoBtn.click();
        break;
        
        case transcript.includes('controles de mando'):
          mandoControlBtn.click();
        break;

        case transcript.includes('controles de xbox'):
          controlesMando.classList.remove('invisible');
          controlesTeclado.classList.add('invisible');
          $('.playstation').addClass('invisible');
          $('.ps5').addClass('oculto');
          $('.xbox').removeClass('invisible');
          $('.xbox-mando').removeClass('oculto');
          selectMandos.value = 'xbox';
        break;

        case transcript.includes('controles de playstation'):
          controlesMando.classList.remove('invisible');
          controlesTeclado.classList.add('invisible');
          $('.playstation').removeClass('invisible');
          $('.ps5').removeClass('oculto');
          $('.xbox').addClass('invisible');
          $('.xbox-mando').addClass('oculto');
          selectMandos.value = 'playstation';
        break;

    }

    ultimoComando = transcript;
  };

  recognition.onerror = function(event) {
    console.error("Error en el reconocimiento:", event.error);
  };

  let reconocimientoActivo = false;

  recognition.onend = function() {
    if (reconocimientoActivo) {
      recognition.interimResults = true; 
      recognition.start();
    }
  };

  document.getElementById("start").addEventListener("click", () => {
    reconocimientoActivo = true;
    recognition.interimResults = true; 
    recognition.start();
    const notificacion = document.querySelector('.notificacion-voz-container');
    notificacion.classList.add('notificacion-voz-mostrar');
    setTimeout(() => {
      notificacion.classList.remove('notificacion-voz-mostrar');
    }, 2000);
    comandos.classList.remove('oculto');
    comandos.classList.remove('scale');
  });
}



function setBoardColor(color) {
    boardColor = color;
    boardBackground = boardColor;
    clearBoard();
    drawFood();
    drawSnake();
}