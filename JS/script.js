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
}