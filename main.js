class Game {
  constructor() {
    this.container = document.getElementById("game-container");
    this.puntosElement = document.getElementById("puntos");
    this.personaje = null;
    this.monedas = [];
    this.puntuacion = 0;
    this.crearEscenario();
    this.agregarEventos();
    this.inicializarSonidos();
  }
  inicializarSonidos() {
    this.sonidoMoneda = new Audio("https://www.myinstants.com/media/sounds/mario-coin.mp3");
    this.sonidoMoneda.volume = 0.5;

    this.musicaFondo = new Audio("./sounds/background_sound.mp3");
    this.musicaFondo.loop = true;
    this.musicaFondo.volume = 0.5;
    this.musicaFondo.play();
    document.addEventListener("keydown", () => {
      this.musicaFondo.play();
    }, { once: true });
    const stopMusicButton = document.getElementById("stopMusic");
    stopMusicButton.addEventListener("click", () => {
      if (this.musicaFondo.paused) {
        this.musicaFondo.play();
      }else{
        this.musicaFondo.pause();
      }
    });
  }
  reproducirSonidoMoneda() {
    this.sonidoMoneda.currentTime = 0; // Reinicia el sonido para que se pueda reproducir varias veces seguidas
    this.sonidoMoneda.play();
  }
  mostrarSangre(x, y) {
    const sangre = document.createElement("div");
    sangre.classList.add("sangre");
    sangre.style.left = `${x}px`;
    sangre.style.top = `${y}px`;
    this.container.appendChild(sangre);
    setTimeout(() => {
      this.container.removeChild(sangre);
    }, 500);
  }
  crearEscenario() {  //definimos los elementos que queremos que esten dentro del escenario
    this.personaje = new Personaje();
    this.container.appendChild(this.personaje.element);
    for (let i = 0; i < 15; i++) {
      let moneda;
      if (Math.random() < 0.25) { // 50% de probabilidad de crear una moneda dorada
        moneda = new MonedaDorada();
      } else {
        moneda = new Moneda();
      }
      this.monedas.push(moneda);
      this.container.appendChild(moneda.element);
    }
  }
  agregarEventos() {
    window.addEventListener("keydown", (e) => this.personaje.mover(e));  //llamamos a un evento en la ventana, con el (e) que es el evento que presiona la tecla
    this.checkColisiones();
  }
  checkColisiones() {
    setInterval(() => {
      this.monedas.forEach((moneda, index) => {
        if (this.personaje.colisionaCon(moneda)) {
          this.container.removeChild(moneda.element);
          this.monedas.splice(index, 1);
          this.reproducirSonidoMoneda();
          this.actualizarPuntuacion(moneda.obtenerPuntuacion());
          this.mostrarSangre(moneda.x, moneda.y);
          if (this.monedas.length === 0) {
            this.mostrarFinalDePartida();
          }
        }
      });
    }, 100);
  }
  mostrarFinalDePartida() {
    const mensajeFinal = document.createElement("div");
    mensajeFinal.classList.add("mensaje-final");
    mensajeFinal.textContent = "Fin de partida";
    this.container.appendChild(mensajeFinal);
  }
  actualizarPuntuacion(puntos) {
    this.puntuacion += puntos;
    this.puntosElement.textContent = `Puntos: ${this.puntuacion}`;
  }
}

class Personaje {
  constructor() {
    this.x = 50
    this.y = 300;
    this.width = 80; // Se agrega tamaño del personaje
    this.height = 80;
    this.velocidad = 10;
    this.saltando = false;
    this.element = document.createElement("div");
    this.element.classList.add("personaje");
    this.actualizarPosicion();
  }

  mover(evento) {
    const container = document.getElementById("game-container"); // Obtener el contenedor
    const containerWidth = container.offsetWidth; //(para medir el ancho/alto) Ancho del contenedor
    const containerHeight = container.offsetHeight; // Altura del contenedor

    if (evento.key === "ArrowRight" && this.x + this.width + this.velocidad <= containerWidth) { //&& -> el persona no pasa el borde derecho
      this.x += this.velocidad;
    } else if (evento.key === "ArrowLeft" && this.x - this.velocidad >= 0) { //&& -> el personaje no pasa el borde izquierdo
      this.x -= this.velocidad;
    } else if (evento.key === "ArrowUp" && !this.saltando) {
      this.saltar();
    }
    this.actualizarPosicion();
  }

  saltar() {
    if (this.y <= 0) return; // Evita que el personaje suba más allá del límite superior
    this.saltando = true;
    let alturaMaxima = Math.max(this.y - 300, 0); //No permitir subir más allá del borde superior        
    const salto = setInterval(() => {
      if (this.y > alturaMaxima) {
        this.y -= 10;
      } else {
        clearInterval(salto);
        this.caer();
      }
      this.actualizarPosicion();
    },
      20);
  }

  caer() {
    const gravedad = setInterval(() => {
      if (this.y < 300) {
        this.y += 10;
      } else {
        clearInterval(gravedad);
        this.saltando = false;
      }
      this.actualizarPosicion();
    },
      20);
  }

  actualizarPosicion() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

  colisionaCon(objeto) {
    return (
      this.x < objeto.x + objeto.width &&
      this.x + this.width > objeto.x &&
      this.y < objeto.y + objeto.height &&
      this.y + this.height > objeto.y
    );
  }
}

class Moneda {
  constructor() {
    this.x = Math.random() * 700 + 50;
    this.y = Math.random() * 250 + 50;
    this.width = 30;
    this.height = 30;
    this.element = document.createElement("div");
    this.element.classList.add("moneda");

    this.actualizarPosicion();
  }

  actualizarPosicion() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

  obtenerPuntuacion() {
    return 5;
  }
}

class MonedaDorada extends Moneda {
  constructor() {
    super();
    this.element.classList.add("moneda-dorada");
  }

  obtenerPuntuacion() {
    return 10;
  }
}



const juego = new Game();