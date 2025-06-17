//Evitar scroll con las flechas de movimiento
document.addEventListener('keydown', (e) => {
    const flechasTeclado = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'];

    if(flechasTeclado.includes(e.key)) {
        e.preventDefault();
    }
})


/* Actualizar max score */
const storedMaxScore = document.querySelector('#max-score');
storedMaxScore.textContent = localStorage.getItem('maxScore') || 0;


/* Cambiar temas */
$("body").on("click", () => {
  if (!$("#menu-temas").hasClass("invisible")) {
    $("#menu-temas").slideToggle(100);
    $("#menu-temas").addClass("invisible");
    $("#select-tema").children("p").removeClass("borde-abierto");
    $(".arrow-down").toggleClass("girar-flecha");
  }
});

$("#select-tema").on("click", (e) => {
  e.stopPropagation();
  $("#menu-temas").slideToggle(100);
  $("#menu-temas").toggleClass("invisible");
  $(".arrow-down").toggleClass("girar-flecha");

  const p = $("#select-tema").children("p");

  if ($("#menu-temas").hasClass("invisible")) {
    p.removeClass("borde-abierto");
  } else {
    p.addClass("borde-abierto");
  }
});


$("#tema").on("click", () => {
    $("#menu-temas").addClass("invisible");
});

const temas = document.querySelectorAll('.tema');
const clasesTemas = ["frutiger-bg", "retro-bg"];

function aplicarTema(temaId) {
    $("body").removeClass(clasesTemas.join(" "));

    if (temaId === "main") {
        $("body").removeClass(clasesTemas.join(" "));
    } else if (temaId) {
        $("body").addClass(`${temaId}-bg`);
    }
}

// Eventos por clic
temas.forEach(tema => {
    tema.addEventListener('click', () => {
        const temaId = tema.getAttribute("id");
        aplicarTema(temaId);
    });
});

/* Cambiar dificultad */
$(".dificultad-menu").on("click", (e) => {
  e.stopPropagation();
  $(".dificultades").slideToggle(100);
  $(".dificultades").toggleClass("invisible");
  $(".arrow-down-2").toggleClass("girar-flecha");
});

$("body").on("click", () => {
  if (!$(".dificultades").hasClass("invisible")) {
    $(".dificultades").slideUp(100);
    $(".dificultades").addClass("invisible");
    $(".arrow-down-2").removeClass("girar-flecha");
  }
});

const dificultades = document.querySelectorAll('.dificultad');
const dificultadText = document.querySelector('#dificultad-text');


function aplicarDificultad(nombreDificultad) {
    difficulty = nombreDificultad;
    dificultadText.textContent = nombreDificultad;

    switch (nombreDificultad) {
        case "Fácil":
            difficultSpeed = 115;
            break;
        case "Normal":
            difficultSpeed = 75;
            break;
        case "Difícil":
            difficultSpeed = 45;
            break;
        default:
            difficultSpeed = 75;
            break;
    }

    $(".dificultades").addClass("invisible");
}

// Eventos por clic
dificultades.forEach(dificultad => {
    dificultad.addEventListener('click', () => {
        aplicarDificultad(dificultad.textContent);
    });
});


difficultSpeed = 75;


// Cambiar tablero //
$(".board-bg").on("click", (e) => {
  e.stopPropagation();
  $(".colores-board").slideToggle(100);
  $(".colores-board").toggleClass("invisible");
  $(".arrow-down-4").toggleClass("girar-flecha");
});

$("body").on("click", () => {
  if (!$(".colores-board").hasClass("invisible")) {
    $(".colores-board").slideUp(100);
    $(".colores-board").addClass("invisible");
    $(".arrow-down-4").removeClass("girar-flecha");
  }
});


// Menú Controles //
const tecladoBtn = document.querySelector('.icono-teclado');
const mandoControlBtn = document.querySelector('.icono-mando-control');
const controlesTeclado = document.querySelector('.teclado');
const controlesMando = document.querySelector('.mando');
const selectMandos = document.querySelector('#selector-mando');

tecladoBtn.addEventListener('click', () => {
  controlesTeclado.classList.remove('invisible');
  controlesMando.classList.add('invisible');
})
mandoControlBtn.addEventListener('click', () => {
  controlesTeclado.classList.add('invisible');
  controlesMando.classList.remove('invisible');
})

selectMandos.addEventListener('change', () => {
  
  switch (selectMandos.value) {
    case 'xbox':
      $('.playstation').addClass('invisible');
      $('.ps5').addClass('oculto');
      $('.xbox').removeClass('invisible');
      $('.xbox-mando').removeClass('oculto');
    break;

    case 'playstation':
      $('.playstation').removeClass('invisible');
      $('.ps5').removeClass('oculto');
      $('.xbox').addClass('invisible');
      $('.xbox-mando').addClass('oculto');
    break;
  }
})



