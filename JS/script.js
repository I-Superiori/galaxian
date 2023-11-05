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

function bala(){
	this.alive = false; //si esta en uso es true
	var self=object;

	//los valores de la bala
	 this.sapwn = function(x,y,speed){
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.alive = true;
	 }

	// borra la bala y la mueve, y si devuelve true la borra de la pool 
	 this.draw = function(){
		this.context.clearRect( this.x-1,this.y-1,this.width+2,this.height+2);
		this.y -=  this.speed;

		if (this.isColliding){
			return true;
		}
		else if (self === "bala"  && this.y <= 0 - this.height){
			return true;
		}
		else if(self === "balaEnemigo" && this.y  >= this.canvasHeight){
			return true;
		}
		else {
			if (self === "bala"){
				this.context.drawImage(imageRepository.bala, thjis.x, this.y);
			}
			else if (self === "balaEnemigo"){
				this.context.drawImage(imageRepository.balaEnemigo, thjis.x, this.y);
			}
		}
	 };

	 //resetea los valores de la bala

	 this.clear = function(){
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.alive = false;
		this.isColliding = false;
	 };
}
bala.prototype = new drawable ();
/*
 * Objeto QuadTree.
 *
 * Los índices de los cuadrantes se numeran de la siguiente manera:
 *     |
 *  1  |  0
 * ----+----
 *  2  |  3
 *     |
 */
function QuadTree(boundBox, lvl) {
    var maxObjects = 10;
    this.bounds = boundBox || {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };
    var objects = [];
    this.nodes = [];
    var level = lvl || 0;
    var maxLevels = 5;
	/*
     * Limpia el QuadTree y toos los nodos de objetos
     */
    this.clear = function() {
        objects = [];

        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].clear();
        }

        this.nodes = [];
    };
/*
     * Obtiene todos los objetos en el QuadTree
     */
this.getAllObjects = function(returnedObjects) {
	for (var i = 0; i < this.nodes.length; i++) {
		this.nodes[i].getAllObjects(returnedObjects);
	}

	for (var i = 0, len = objects.length; i < len; i++) {
		returnedObjects.push(objects[i]);
	}

	return returnedObjects;
    };
/*
     * Devuelve todos los objetos con los que el objeto podría colisionar
     */
this.findObjects = function(returnedObjects, obj) {
	if (typeof obj === "undefined") {
		console.log("OBJETO NO DEFINIDO");
		return;
	}

	var index = this.getIndex(obj);
	if (index != -1 && this.nodes.length) {
		this.nodes[index].findObjects(returnedObjects, obj);
	}

	for (var i = 0, len = objects.length; i < len; i++) {
		returnedObjects.push(objects[i]);
	}

	return returnedObjects;
    };
/*
     * Inserta el objeto en el QuadTree. Si el árbol
     * excede la capacidad, se dividirá y agregará todos
     * los objetos a sus nodos correspondientes.
     */
this.insert = function(obj) {
	if (typeof obj === "undefined") {
		return;
	}

	if (obj instanceof Array) {
		for (var i = 0, len = obj.length; i < len; i++) {
			this.insert(obj[i]);
		}

		return;
	}


}