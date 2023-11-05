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
	if (this.nodes.length) {
		var index = this.getIndex(obj);
		// Solo agrega el objeto a un subnodo si cabe completamente
		// dentro de uno
		if (index != -1) {
			this.nodes[index].insert(obj);

			return;
		}
	}

	objects.push(obj);
// Evita la división infinita
if (objects.length > maxObjects && level < maxLevels) {
	if (this.nodes[0] == null) {
		this.split();
	}

	var i = 0;
	while (i < objects.length) {

		var index = this.getIndex(objects[i]);
		if (index != -1) {
			this.nodes[index].insert((objects.splice(i,1))[0]);
		}
		else {
			i++;
		}
	}
        }
    };
/*
     * Determina a qué nodo pertenece el objeto. -1 significa
     * que el objeto no puede encajar completamente en un nodo y forma parte
     * del nodo actual.
     */
this.getIndex = function(obj) {

	var index = -1;
	var verticalMidpoint = this.bounds.x + this.bounds.width / 2;
	var horizontalMidpoint = this.bounds.y + this.bounds.height / 2;
	// El objeto puede encajar completamente en el cuadrante superior
	var topQuadrant = (obj.y < horizontalMidpoint && obj.y + obj.height < horizontalMidpoint);
	// El objeto puede encajar completamente en el cuadrante inferior
	var bottomQuadrant = (obj.y > horizontalMidpoint);

	// El objeto puede encajar completamente en los cuadrantes izquierdos
	if (obj.x < verticalMidpoint &&
			obj.x + obj.width < verticalMidpoint) {
		if (topQuadrant) {
			index = 1;
		}
		else if (bottomQuadrant) {
			index = 2;
		}
	}
	// El objeto puede encajar completamente en los cuadrantes derechos
	else if (obj.x > verticalMidpoint) {
		if (topQuadrant) {
			index = 0;
		}
		else if (bottomQuadrant) {
			index = 3;
		}
	}

	return index;
    };
/*
     * Divide el nodo en 4 subnodos
     */
this.split = function() {
	// Desplazamiento de bits
	var subWidth = (this.bounds.width / 2) | 0;
	var subHeight = (this.bounds.height / 2) | 0;

	this.nodes[0] = new QuadTree({
		x: this.bounds.x + subWidth,
		y: this.bounds.y,
		width: subWidth,
		height: subHeight
	}, level+1);
	this.nodes[1] = new QuadTree({
		x: this.bounds.x,
		y: this.bounds.y,
		width: subWidth,
		height: subHeight
	}, level+1);
	this.nodes[2] = new QuadTree({
		x: this.bounds.x,
		y: this.bounds.y + subHeight,
		width: subWidth,
		height: subHeight
	}, level+1);
	this.nodes[3] = new QuadTree({
		x: this.bounds.x + subWidth,
		y: this.bounds.y + subHeight,
		width: subWidth,
		height: subHeight
	}, level+1);
    };
}
/**
 * pool. .
 * El pool funciona asa:
 * - Cuando se inicializa el pool, se llena un array con objetos de bala.
 * - Cuando el pool necesita crear un nuevo objeto para su uso, examina el último elemento en el array y verifica si está actualmente en uso o no. Si está en uso, el pool está lleno. Si no está en uso, el pool "genera" el último elemento del array luego lo retira del final y lo manda de nuevo al frente del array. Esto hace que el pool tenga objetos libres en la parte trasera y objetos utilizados en la parte delantera.
 * - Cuando el pool anima sus objetos, verifica si el objeto está en uso y si lo está, lo dibuja. Si la función draw() devuelve true, el objeto lo matamos, por lo que "mata" el objeto y utiliza la función del array splice para eliminar el elemento del array y mandarlo o empujarlo hacia atrás.
 * Haciendo esto, se mantiene constante la creación/destrucción de objetos en el pool.
 */
function Pool(maxSize) {
    var size = maxSize; // Máximo de balas permitidas en el pool
    var pool = []; 
  this.getPool = function() {
	var obj = [];
	for (var i = 0; i < size; i++) {
		if (pool[i].alive) {
			obj.push(pool[i]);
		}
	}
	return obj;
    }
/*
     * Lleno el array del pool con el objeto dado
     */
this.init = function(object) {
	if (object == "bala") {
		for (var i = 0; i < size; i++) {
			// Inicializa el objeto
			var bala = new bala("bala");
			bala.init(0,0, imageRepository.bala.width,
								imageRepository.bala.height);
			bala.collidableWith = "enemigo";
			bala.type = "bala";
			pool[i] = bala;
        }
        }
else if (object == "enemigo") {
	for (var i = 0; i < size; i++) {
		var enemigo = new Enemigo();
		enemigo.init(0,0, imageRepository.enemigo.width,
						 imageRepository.enemigo.height);
		pool[i] = enemigo;
	}
}
else if (object == "balaEnemigo") {
	for (var i = 0; i < size; i++) {
		var bala = new bala("balaEnemigo");
		bala.init(0,0, imageRepository.balaEnemigo.width,
							imageRepository.balaEnemigo.height);
		bala.collidableWith = "nave";
		bala.type = "balaEnemigo";
		pool[i] = bala;
	}
        }
    };
/*
     * Obtiene el último elemento de la lista y lo inicia y
     * lo manda al principio del array.
     */
this.get = function(x, y, speed) {
	if(!pool[size - 1].alive) {
		pool[size - 1].spawn(x, y, speed);
		pool.unshift(pool.pop());
        }
    };
/*
     * se usa para que la nave pueda tener dos balas a la vez. Si
     * se usa la función get() dos veces, la nave puede
     * disparar y solo tiene 1 bala en lugar de 2.
     */
this.getTwo = function(x1, y1, speed1, x2, y2, speed2) {
	if(!pool[size - 1].alive && !pool[size - 2].alive) {
		this.get(x1, y1, speed1);
		this.get(x2, y2, speed2);
        }
    };

}