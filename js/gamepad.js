const cerrarNotificacion = document.querySelector('.icono-cerrar');
const notificacionMando1 = document.querySelector('.notificacion-mando-1');
const btnMando = document.querySelector('.btn-mando');
const textoNoti = document.querySelector('#texto-noti');


btnMando.addEventListener('click', () => {
    notificacionMando1.classList.remove('esconder-noti');

    window.addEventListener("gamepadconnected", function() {
    notificacionMando1.classList.add('mando-conectado');
    textoNoti.textContent = '¡Mando conectado corectamente!';

    setTimeout(() => {
        notificacionMando1.classList.add('esconder-noti');
    }, 1000);

    setTimeout(() => {
        gamepadLoop();
        activarMando();
    }, 200);

    });

    cerrarNotificacion.addEventListener('click', () => {
    notificacionMando1.classList.add('esconder-noti')
    })
})




function activarMando() {

let buttonStates = {};
function checkGamepad() {
    const gamepads = navigator.getGamepads();
    const gp = gamepads[0];
    

    if (gp) {
        gp.buttons.forEach((btn, index) => {
            if (btn.pressed) {
                if (!buttonStates[index]) {
                    buttonStates[index] = true;
                    console.log(index)
                    if(paused === false && index === 9){
                        pausa.click();
                    } else if(paused === true && index === 9 ||paused === true && index === 0 ) {
                        reanudar.click()
                    }
                    if(index === 2) {
                        btnSonido.click()
                    } else if(index === 3) {
                        const cancelarMusica = document.querySelector('#text-btn-musica-2');
                        if(!cancelarMusica.classList.contains('invisible')) {
                            cancelarMusica.click();
                        } else {
                            btnMusica.click()
                        }
                    } else if(index === 1) {
                        $('.dificultad-menu').click()
                    } else if(index === 7) {
                        btnPlayMenu.click()
                    } else if(index === 6) {
                        $('#start').click()
                    } else if(index === 10) {
                        $("#select-tema").click()
                    } else if(index === 11) {
                        $(".board-bg").click()
                    } else if(index === 5) {
                        btnSiguiente.click();
                    } else if(index === 4) {
                        btnAnterior.click();
                    }
                }
            } else {
                buttonStates[index] = false;
            }
        });
    }

    requestAnimationFrame(checkGamepad);
}
requestAnimationFrame(checkGamepad);
}

