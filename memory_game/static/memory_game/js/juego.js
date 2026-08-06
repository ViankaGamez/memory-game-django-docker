const tablero = document.getElementById('tablero');

const intentosIniciales = Number(
  tablero.dataset.intentos
);

const tiempoInicial = Number(
  tablero.dataset.tiempo
);

const nivelActual = tablero.dataset.nivel;

const tokenCSRF = document.querySelector(
  '[name=csrfmiddlewaretoken]'
).value;


let intentos = intentosIniciales;
let tiempo = tiempoInicial;

let primeraCarta = null;
let segundaCarta = null;

let bloquearTablero = false;
let parejasEncontradas = 0;
let juegoTerminado = false;


/* =========================
   SISTEMA DE SONIDO
========================= */

let contextoAudio = null;
let sonidoActivo = true;
let musicaIniciada = false;
let intervaloMusica = null;
let posicionMusica = 0;


const melodias = {

  basico: [
    261.63,
    329.63,
    392.00,
    329.63
  ],

  medio: [
    293.66,
    369.99,
    440.00,
    369.99
  ],

  avanzado: [
    329.63,
    415.30,
    493.88,
    554.37
  ]
};


const velocidadMusica = {

  basico: 600,
  medio: 450,
  avanzado: 320

};


function obtenerContextoAudio() {

  if (!contextoAudio) {

    contextoAudio = new (
      window.AudioContext ||
      window.webkitAudioContext
    )();

  }

  return contextoAudio;
}


function tocarTono(
  frecuencia,
  duracion,
  tipo = 'sine',
  volumen = 0.05,
  retraso = 0
) {

  if (!sonidoActivo) {
    return;
  }

  const audio = obtenerContextoAudio();

  const oscilador =
    audio.createOscillator();

  const ganancia =
    audio.createGain();

  const inicio =
    audio.currentTime + retraso;

  const final =
    inicio + duracion;


  oscilador.type = tipo;

  oscilador.frequency.setValueAtTime(
    frecuencia,
    inicio
  );


  ganancia.gain.setValueAtTime(
    volumen,
    inicio
  );

  ganancia.gain.exponentialRampToValueAtTime(
    0.001,
    final
  );


  oscilador.connect(ganancia);

  ganancia.connect(
    audio.destination
  );


  oscilador.start(inicio);

  oscilador.stop(final);
}


function sonidoPareja() {

  tocarTono(
    523.25,
    0.12,
    'sine',
    0.08
  );

  tocarTono(
    659.25,
    0.15,
    'sine',
    0.08,
    0.12
  );

}


function sonidoError() {

  tocarTono(
    180,
    0.15,
    'square',
    0.035
  );

}


function sonidoVictoria() {

  tocarTono(
    523.25,
    0.18,
    'sine',
    0.10
  );

  tocarTono(
    659.25,
    0.18,
    'sine',
    0.10,
    0.18
  );

  tocarTono(
    783.99,
    0.18,
    'sine',
    0.10,
    0.36
  );

  tocarTono(
    1046.50,
    0.35,
    'sine',
    0.10,
    0.54
  );

}


function sonidoDerrota() {

  tocarTono(
    392,
    0.20,
    'triangle',
    0.08
  );

  tocarTono(
    293.66,
    0.20,
    'triangle',
    0.08,
    0.20
  );

  tocarTono(
    196,
    0.40,
    'triangle',
    0.08,
    0.40
  );

}


function iniciarMusica() {

  if (
    musicaIniciada ||
    !sonidoActivo ||
    juegoTerminado
  ) {
    return;
  }

  musicaIniciada = true;

  const melodia =
    melodias[nivelActual];

  const velocidad =
    velocidadMusica[nivelActual];


  intervaloMusica = setInterval(() => {

    if (
      sonidoActivo &&
      !juegoTerminado
    ) {

      tocarTono(
        melodia[posicionMusica],
        0.10,
        'triangle',
        0.018
      );

      posicionMusica++;

      if (
        posicionMusica >=
        melodia.length
      ) {

        posicionMusica = 0;

      }

    }

  }, velocidad);

}


function detenerMusica() {

  if (intervaloMusica) {

    clearInterval(
      intervaloMusica
    );

    intervaloMusica = null;

  }

  musicaIniciada = false;
}


const botonSonido =
  document.getElementById(
    'boton-sonido'
  );


botonSonido.addEventListener(
  'click',
  () => {

    sonidoActivo =
      !sonidoActivo;


    if (sonidoActivo) {

      botonSonido.textContent =
        '🔊 Sonido activado';

      if (!juegoTerminado) {
        iniciarMusica();
      }

    } else {

      botonSonido.textContent =
        '🔇 Sonido desactivado';

      detenerMusica();

    }

  }
);


/* =========================
   CARTAS
========================= */

const valores = [

  '🍎',
  '🍌',
  '🍇',
  '🍓',
  '🍒',
  '🍉',
  '🥝',
  '🍍'

];


const cartas = [
  ...valores,
  ...valores
];


function mezclarCartas() {

  cartas.sort(
    () => Math.random() - 0.5
  );

}


function crearTablero() {

  mezclarCartas();


  cartas.forEach(valor => {

    const carta =
      document.createElement(
        'button'
      );


    carta.classList.add(
      'carta'
    );

    carta.dataset.valor =
      valor;

    carta.textContent =
      valor;


    carta.addEventListener(
      'click',
      voltearCarta
    );


    tablero.appendChild(
      carta
    );

  });

}


/* =========================
   LÓGICA DEL JUEGO
========================= */

function voltearCarta() {

  iniciarMusica();


  if (
    bloquearTablero ||
    juegoTerminado
  ) {

    return;

  }


  if (
    this === primeraCarta
  ) {

    return;

  }


  if (
    this.classList.contains(
      'encontrada'
    )
  ) {

    return;

  }


  this.classList.add(
    'volteada'
  );


  if (
    primeraCarta === null
  ) {

    primeraCarta = this;

    return;

  }


  segundaCarta = this;

  comprobarPareja();

}


function comprobarPareja() {

  if (
    primeraCarta.dataset.valor ===
    segundaCarta.dataset.valor
  ) {

    parejaCorrecta();

  } else {

    parejaIncorrecta();

  }

}


function parejaCorrecta() {

  primeraCarta.classList.add(
    'encontrada'
  );

  segundaCarta.classList.add(
    'encontrada'
  );


  sonidoPareja();


  parejasEncontradas++;


  document.getElementById(
    'parejas'
  ).textContent =
    parejasEncontradas;


  reiniciarSeleccion();


  if (
    parejasEncontradas === 8
  ) {

    terminarJuego(true);

  }

}


function parejaIncorrecta() {

  bloquearTablero = true;

  intentos--;


  document.getElementById(
    'intentos'
  ).textContent =
    intentos;


  sonidoError();


  setTimeout(() => {

    primeraCarta.classList.remove(
      'volteada'
    );

    segundaCarta.classList.remove(
      'volteada'
    );


    reiniciarSeleccion();


    if (
      intentos <= 0
    ) {

      terminarJuego(false);

    }

  }, 800);

}


function reiniciarSeleccion() {

  primeraCarta = null;

  segundaCarta = null;

  bloquearTablero = false;

}


/* =========================
   TEMPORIZADOR
========================= */

const temporizador =
  setInterval(() => {

    if (juegoTerminado) {
      return;
    }


    tiempo--;


    document.getElementById(
      'tiempo'
    ).textContent =
      tiempo;


    if (
      tiempo <= 0
    ) {

      terminarJuego(false);

    }

  }, 1000);


/* =========================
   GUARDAR PARTIDA
========================= */

function guardarPartida(gano) {

  const tiempoUsado =
    tiempoInicial - tiempo;


  fetch(
    '/guardar-partida/',
    {

      method: 'POST',

      headers: {

        'Content-Type':
          'application/json',

        'X-CSRFToken':
          tokenCSRF

      },

      body: JSON.stringify({

        nivel:
          nivelActual,

        resultado:
          gano
            ? 'ganada'
            : 'perdida',

        tiempo_usado:
          tiempoUsado,

        intentos_restantes:
          intentos

      })

    }
  )
    .catch(error => {

      console.error(
        'Error al guardar la partida:',
        error
      );

    });

}


/* =========================
   FINAL DEL JUEGO
========================= */

function terminarJuego(gano) {

  if (juegoTerminado) {
    return;
  }


  juegoTerminado = true;

  bloquearTablero = true;


  clearInterval(
    temporizador
  );


  detenerMusica();


  guardarPartida(
    gano
  );


  const resultado =
    document.getElementById(
      'resultado'
    );


  const mensaje =
    document.getElementById(
      'mensaje-resultado'
    );


  resultado.classList.remove(
    'oculto'
  );


  if (gano) {

    mensaje.textContent =
      '¡Ganaste! 🎉';

    sonidoVictoria();

  } else {

    mensaje.textContent =
      '¡Perdiste! 😢';

    sonidoDerrota();

  }

}


/* =========================
   REINICIAR
========================= */

document
  .getElementById(
    'reiniciar'
  )
  .addEventListener(
    'click',
    () => {

      location.reload();

    }
  );


crearTablero();