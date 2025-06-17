const btnPlayMenu = document.querySelector('#menu-playlist-btn');
const playlistContainer = document.querySelector('.playlist-container');
const btnMusica = document.querySelector('.btn-musica');
const containerOcultador = document.querySelector('.container-ocultador');

btnPlayMenu.addEventListener('click', () => {
    playlistContainer.classList.toggle('esconder');
    arrowDown3.classList.toggle('girar-flecha');
})

btnMusica.addEventListener('click', () => {
    const oculto = containerOcultador.classList.contains('oculto');
    const escondido = playlistContainer.classList.contains('esconder');
    const span1 = document.querySelector('#text-btn-musica-1');
    const span2 = document.querySelector('#text-btn-musica-2');

    if (oculto && escondido) {
        containerOcultador.classList.remove('oculto');
        playlistContainer.classList.remove('esconder');
    } else if (!oculto && !escondido) {
        containerOcultador.classList.add('oculto');
        setTimeout(() => playlistContainer.classList.add('esconder'), 200);
    } else if (!oculto && escondido) {
        containerOcultador.classList.add('oculto');
    }

    if(span2.classList.contains('invisible')) {
        span2.classList.remove('invisible')
        span1.classList.add('invisible')
    } else {
        span2.classList.add('invisible')
        span1.classList.remove('invisible')
    }
});

