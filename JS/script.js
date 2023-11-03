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


function Drawable() {	
	this.init = function(x, y) {
		this.x = x;
		this.y = y;
        this.width = width;
        this.height = height;
	}

    this.speed = 0;
	this.canvasWidth = 0;
	this.canvasHeight = 0;
	this.collidableWith = "";
	this.isColliding = false;
	this.type = "";

    this.draw = function() {
	};
	this.move = function() {
	};
	this.isCollidableWith = function(object) {
		return (this.collidableWith === object.type);
	};
}

//la funcion que maneja el fondo y  es un child del drawable
function fondo(){
    this.speed = 1;
    this.draw = function (){
        this.y += this.speed;
        this.context.drawImage(imageRepository.fondo, this.x, this.y);
        this.context.drawImage(imageRepository.fondo, this.x, this.y - this.canvasHeight);
        if (this.y >= this.canvasHeight)
			this.y = 0;
    }
}
fondo.prototype = new drawable();

//crea la bala que dispara la nave

function bullet(){
	this.alive = false; //si esta en uso es true
	var self=object;
}