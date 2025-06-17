// === Elementos del DOM ===
const playSound = document.querySelector('.play-music');
const playListContainer = document.querySelector('.playlist-container');
const stopSound = document.querySelector('.stop-music');
const barra = document.querySelector('.barra-progreso');
const barraRelleno = document.querySelector('.barra-relleno');
const handle = document.querySelector('.handle');
const controlVolumen = document.querySelector('.control-volumen');
const volumeIcons = document.querySelector('.iconos-volumen');
const volumeOn = document.querySelector('#volume-on');
const volumeOff = document.querySelector('#volume-off');
const tiempoTranscurrido = document.querySelector('.tiempo-transcurrido');
const tiempoRestante = document.querySelector('.tiempo-restante');
const displayImg = document.querySelector('#imagen-cancion');
const displayTitulo = document.querySelector('#titulo-cancion');
const replay = document.querySelector('#repetir');
const iconoRepetir1 = document.querySelector('#icono-repetir-1');
const menuCanciones = document.querySelector('#menu-playlist');
const btnSiguiente = document.querySelector('.siguiente');
const btnAnterior = document.querySelector('.anterior');
const arrowDown3 = document.querySelector('.arrow-down-3');
let musica = null;
let cancionActualIndex = null;
let isDragging = false;
let porcentajeArrastre = 0;
let repetirCancion = false; // NUEVO

// === Lista de canciones ===
const canciones = [
  { titulo: "Heroes Tonight", autor: "Janji", duracion: "3:28", src: "src/audio/janji-heroes-tonight.mp3", img: "src/img/janji.jfif" },
  { titulo: "Dreams", autor: "Lost Sky", duracion: "3:35", src: "src/audio/lost-sky-dreams.mp3", img: "src/img/lost-sky.jpg" },
  { titulo: "Shadows", autor: "Different", duracion: "3:13", src: "src/audio/its-different-shadows.mp3", img: "src/img/shadows.jpg" },
  { titulo: "Blank", autor: "Disfigure", duracion: "3:29", src: "src/audio/disfigure-blank.mp3", img: "src/img/blank.jpg" },
  { titulo: "Lost", autor: "Lost Sky", duracion: "2:37", src: "src/audio/lost-sky-lost.mp3", img: "src/img/lost-sky-lost.jpg" },
  { titulo: "On and On", autor: "Cartoon", duracion: "3:28", src: "src/audio/cartoon-on-on.mp3", img: "src/img/on.jfif" },
  { titulo: "Shine", autor: "Spektrem", duracion: "4:19", src: "src/audio/spektrem-shine.mp3", img: "src/img/shine.jpg" },
  { titulo: "Frame of Mind", autor: "Tristam", duracion: "4:33", src: "src/audio/tristam-frame-of-mind.mp3", img: "src/img/frame.jpg" },
  { titulo: "Outlaw", autor: "Different", duracion: "4:14", src: "src/audio/different-outlaw.mp3", img: "src/img/outlaw.jpg" },
  { titulo: "Why We Lose", autor: "Cartoon", duracion: "3:33", src: "src/audio/cartoon-why-we-lose.mp3", img: "src/img/lose.jpg" },
  { titulo: "Invincible", autor: "Deaf Kev", duracion: "4:33", src: "src/audio/deaf-kev-invincible.mp3", img: "src/img/invincible.jfif" },
];

// === Mostrar canciones en el menú ===
canciones.forEach((cancion, index) => {
  const div = document.createElement('div');
  div.classList.add('cancion');
  div.setAttribute('data-index', index);
  div.innerHTML = `
    <img class="cancion-img" src="${cancion.img}" alt="">
    <div class="datos">
      <p class="autor">${cancion.autor}</p>
      <p class="titulo">${cancion.titulo}</p>
      <p class="duracion">${cancion.duracion}</p>
    </div>
  `;
  menuCanciones.appendChild(div);
});

// === Cambiar de canción al hacer click en el menú ===
menuCanciones.addEventListener('click', (e) => {
  const target = e.target.closest('.cancion');
  if (!target) return;

  const index = Number(target.getAttribute('data-index'));
  if (index === cancionActualIndex && musica && !musica.paused) return;

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
});

// === Función para reproducir una canción por índice ===
function reproducirCancion(index) {
  const cancion = canciones[index];
  if (!cancion) return;

  if (musica) {
    musica.pause();
    musica.currentTime = 0;
    musica.removeEventListener('ended', handleEnded); // eliminar anterior listener
  }

  musica = new Audio(cancion.src);
  musica.volume = controlVolumen.value;
  cancionActualIndex = index;

  displayImg.src = cancion.img;
  displayTitulo.textContent = `${cancion.autor} - ${cancion.titulo}`;
  musica.play();

  playSound.classList.add('invisible');
  stopSound.classList.remove('invisible');

  document.querySelectorAll('.cancion').forEach(c => c.classList.remove('sonando'));
  const cancionDiv = document.querySelector(`.cancion[data-index="${index}"]`);
  if (cancionDiv) cancionDiv.classList.add('sonando');

  musica.addEventListener('ended', handleEnded); // asignar nuevo listener

  musica.addEventListener('loadedmetadata', () => {
    tiempoTranscurrido.textContent = formatearTiempo(0);
    tiempoRestante.textContent = formatearTiempo(musica.duration);
  });

  musica.addEventListener('timeupdate', () => {
    if (musica.duration && !isDragging) {
      const current = Math.round(musica.currentTime);
      const remaining = Math.round(musica.duration - musica.currentTime);
      const porcentaje = (current / musica.duration) * 100;
      barraRelleno.style.width = `${porcentaje}%`;
      handle.style.left = `${porcentaje}%`;
      tiempoTranscurrido.textContent = formatearTiempo(current);
      tiempoRestante.textContent = formatearTiempo(remaining);
    }
  });
}

// === Función manejadora de 'ended' ===
function handleEnded() {
  if (repetirCancion) {
    musica.currentTime = 0;
    musica.play();
  } else {
    reproducirCancion((cancionActualIndex + 1) % canciones.length);
  }
}

// === Botones siguiente y anterior ===
btnSiguiente.addEventListener('click', () => {
  if (cancionActualIndex === null) return;
  const siguiente = (cancionActualIndex + 1) % canciones.length;
  reproducirCancion(siguiente);
});

btnAnterior.addEventListener('click', () => {
  if (cancionActualIndex === null) return;
  const anterior = (cancionActualIndex - 1 + canciones.length) % canciones.length;
  reproducirCancion(anterior);
});

// === Play y stop ===
playSound.addEventListener('click', () => {
  if (musica) musica.play();
  playSound.classList.add('invisible');
  stopSound.classList.remove('invisible');
});

stopSound.addEventListener('click', () => {
  if (musica) musica.pause();
  playSound.classList.remove('invisible');
  stopSound.classList.add('invisible');
});

// === Barra de progreso ===
barra.addEventListener('click', (e) => {
  if (!musica || !musica.duration) return;
  const rect = barra.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const porcentaje = clickX / rect.width;
  musica.currentTime = musica.duration * porcentaje;
});

// === Arrastrar el handle ===
handle.addEventListener('mousedown', () => {
  isDragging = true;
  document.body.style.userSelect = 'none';
  handle.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging || !musica || !musica.duration) return;
  const rect = barra.getBoundingClientRect();
  let x = e.clientX - rect.left;
  x = Math.max(0, Math.min(x, rect.width));
  porcentajeArrastre = x / rect.width;
  handle.style.left = `${porcentajeArrastre * 100}%`;
  barraRelleno.style.width = `${porcentajeArrastre * 100}%`;
});

document.addEventListener('mouseup', () => {
  if (isDragging && musica && musica.duration) {
    isDragging = false;
    document.body.style.userSelect = '';
    handle.style.cursor = 'grab';
    musica.currentTime = musica.duration * porcentajeArrastre;
  }
});

// === Control de volumen ===
controlVolumen.addEventListener('input', (e) => {
  if (!musica) return;
  const volumen = e.target.value;
  musica.volume = volumen;
  volumeOn.classList.toggle('invisible', volumen == 0);
  volumeOff.classList.toggle('invisible', volumen > 0);
});

volumeIcons.addEventListener('click', () => {
  if (!musica) return;
  const isMuted = volumeOn.classList.contains('invisible');
  if (isMuted) {
    musica.volume = 0.4;
    controlVolumen.value = 0.4;
    volumeOn.classList.remove('invisible');
    volumeOff.classList.add('invisible');
  } else {
    musica.volume = 0;
    controlVolumen.value = 0;
    volumeOn.classList.add('invisible');
    volumeOff.classList.remove('invisible');
  }
});

// === Toggle botón de repetición ===
replay.addEventListener('click', () => {
  repetirCancion = !repetirCancion;
  replay.classList.toggle('s-reproductor', repetirCancion);
  iconoRepetir1.classList.toggle('color-icono-1-repetir');
});

iconoRepetir1.addEventListener('click', () => {
  repetirCancion = !repetirCancion;
  replay.classList.toggle('s-reproductor', repetirCancion);
  iconoRepetir1.classList.toggle('color-icono-1-repetir');
});

// === Formatear tiempo ===
function formatearTiempo(segundos) {
  const minutos = Math.floor(segundos / 60);
  const seg = Math.floor(segundos % 60);
  return `${minutos}:${seg.toString().padStart(2, '0')}`;
}

const cancelarMusica = document.querySelector('#text-btn-musica-2');
cancelarMusica.addEventListener('click', () => {
  if(musica) {
    musica.pause();
    musica.currentTime = 0;
    musica.src = '';
    musica = null;
    const reproductor = document.querySelector('.reproductor');
    reproductor.classList.add('oculto-rep');
    menuCanciones.classList.remove('height-menu');
    document.querySelectorAll('.cancion').forEach(c => c.classList.remove('sonando'));
  }
})