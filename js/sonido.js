const btnSonido = document.querySelector('.audio');
const activarAudio = document.querySelector('#activar-audio');
const desactivarAudio = document.querySelector('#desactivar-audio');

btnSonido.addEventListener('click', () => {
    if(activarAudio.classList.contains('oculto')) {
        activarAudio.classList.remove('oculto');
        desactivarAudio.classList.add('oculto');
    } else {
        desactivarAudio.classList.remove('oculto');
        activarAudio.classList.add('oculto');
    }
})

function reproducirGameOver() {
    if(!desactivarAudio.classList.contains('oculto')) {
        const sonido = new Audio('src/audio/fail.mp3');
        sonido.play();
        sonido.volume = 0.6;
    }
}

function reproducirComer() {
    if(!desactivarAudio.classList.contains('oculto')) {
        const sonido = new Audio('src/audio/comer.mp3');
        sonido.play();
        sonido.volume = 0.6;
    }
}

function reproducirLogro() {
    if(!desactivarAudio.classList.contains('oculto')) {
        const sonido = new Audio('src/audio/logro.mp3');
        sonido.play();
        sonido.volume = 0.6;
    }
}