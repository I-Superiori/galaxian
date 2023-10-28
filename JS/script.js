/* inicializar el juego */
var game = new game();

function init() {
    if (game.init())
        game.start();
}

/* se crean objetos que van a contener las imagenes para que se generen una sola vez */
var imageRepository = new function() {
    this.fondo = new Image();
    this.nave =  new Image();
    this.enemigo = new Image();
    this.balaEnemigo = new Image();
    this.bala = new Image();

    //me aseguro que las imagenes carguen bien
    var numImages = 5;
    var numLoaded = 0;
    function imageLoaded() {
		numLoaded++;
		if (numLoaded === numImages) {
			window.init();
		}
	}
	this.fondo.onload = function() {
		imageLoaded();
	}
	this.nave.onload = function() {
		imageLoaded();
	}
	this.bala.onload = function() {
		imageLoaded();
	}
	this.enemigo.onload = function() {
		imageLoaded();
	}
	this.balaEnemigo.onload = function() {
		imageLoaded();
	}

    //conecto las imgs
    this.fondo.src = "img/fondo.png";
    this.nave.src = "img/nave.png";
    this.enemigo.src = "img/enemigo.png";
    this.balaEnemigo.src =  "img/balaEnemigo.png";
    this.bala.src = "img/bala.png";
}
