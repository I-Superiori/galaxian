/* inicializar el juego */
var game = new Game();

function init() {
	game.init();
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
    this.fondo.src = "JS/img/fondo.png";
    this.nave.src = "JS/img/naveImperio.png";
    this.enemigo.src = "JS/img/enemigoImperio.png";
    this.balaEnemigo.src = "JS/img/balaEnemigo.png";
    this.bala.src = "JS/img/bala.png";
}


function Drawable() {	
	this.init = function(x, y, width, height) {
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
	// Define una función abstracta para implementar en objetos secundarios
    this.draw = function() {
	};
	this.move = function() {
	};
	this.isCollidableWith = function(object) {
		return (this.collidableWith === object.type);
	};
}

//la funcion que maneja el fondo y  es un child del Drawable
function Fondo(){
    this.speed = 1;
    this.draw = function (){
        this.y += this.speed;
        this.context.drawImage(imageRepository.fondo, this.x, this.y);
        this.context.drawImage(imageRepository.fondo, this.x, this.y - this.canvasHeight);
        if (this.y >= this.canvasHeight)
			this.y = 0;
    }
}
Fondo.prototype = new Drawable();

//crea la bala que dispara la nave

function Bala(object){
	this.alive = false; //si esta en uso es true
	var self = object;

	//los valores de la bala
	 this.spawn = function(x, y, speed){
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
				this.context.drawImage(imageRepository.bala, this.x, this.y);
			}
			else if (self === "balaEnemigo"){
				this.context.drawImage(imageRepository.balaEnemigo, this.x, this.y);
			}
			return false;
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
Bala.prototype = new Drawable ();
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
 * El pool funciona asi:
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
			var bala = new Bala("bala");
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
		var bala = new Bala("balaEnemigo");
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
/*
     * Dibuja las balas que se usa. Si una bala sale de la pantalla,
     * la borra y la manda al principio del array.
     */
this.animate = function() {
	for (var i = 0; i < size; i++) {
		// Solo dibuja hasta que encuentre una bala que no esta
		if (pool[i].alive) {
			if (pool[i].draw()) {
				pool[i].clear();
				pool.push((pool.splice(i,1))[0]);
			}
		}
		else
			break;
        }
    };
}

function Nave(){
	this.speed = 3;
	this.balaPool = new Pool(30);
	var fireRate = 15;
	var counter = 0;
	this.collidableWith = "balaEnemigo";
	this.type = "nave";

	this.init = function(x,y,width,height){
		//valores predeterminados
		this.x = x; 
		this.y = y;
		this.width = width;
		this.height = height;
		this.alive = true;
		this.isColliding = false;
		this.balaPool.init("bala");
	}

	this.draw =  function (){
		this.context.drawImage(imageRepository.nave,this.x,this.y);
	};
	this.move = function(){
		counter++;
		//dtermina si la accion es de movimiento
		if (KEY_STATUS.left || KEY_STATUS.right || KEY_STATUS.down || KEY_STATUS.up){
			//en este  caso la nave se movio por lo tanto se borra para redibujarla donde corresponda
			this.context.clearRect(this.x,this.y,this.width, this.height);
			//actualizar valores x y y redibujar la nave segun donde se movio
			if (KEY_STATUS.left){
				this.x -= this.speed
				if (this.x <= 0)
					this.x = 0;
			} else if (KEY_STATUS.right){
				this.x += this.speed
				if (this.x >= this.canvasWidth - this.width)
				 	this.x = this.canvasWidth - this.width
			} else if (KEY_STATUS.up){
				this.y -= this.speed
				if(this.y <= this.canvasHeight/4*3)
				this.y = this.canvasHeight/4*3
			} else if (KEY_STATUS.down){
				this.y += this.speed
				if (this.y >= this.canvasHeight -  this.height)
				this.y = this.canvasHeight -  this.height
			}
		}

		//redibujar la nave
		if (!this.isColliding){
			 this.draw();
		}

		else {
			this.alive = false;
			game.gameOver();
		}

		if (KEY_STATUS.space && counter >=  fireRate && !this.isColliding){
			this.fire ();
			counter = 0;
		}
	};

	 //dispara dos balas
	 this.fire = function(){
		this.balaPool.getTwo (this.x+6, this.y, 3, this.x+33, this.y, 3);
		game.laser.get();
	 };
}
Nave.prototype = new  Drawable();

//crea el objeto nave enemiga
function Enemigo (){
	var percentFire  =  .01;
	var chance = 0;
	this.alive = false;
	this.collidableWith = "bala";
	this.type = "enemigo";

	this.spawn = function(x, y, speed){
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.speedX = 0;
		this.speedY = speed;
		this.alive = true;
		this.leftEdge = this.x - 90;
		this.rightEdge = this.x + 90;
		this.bottomEdge = this.y + 140;
	};

	//mueve al enemigo
	this.draw = function(){
		this.context.clearRect(this.x-1, this.y, this.width+1, this.height)
		this.x += this.speedX;
		this.y += this.speedY;

		if (this.x <= this.leftEdge){
			this.speedX = this.speed;
		}
		else if (this.x >= this.rightEdge + this.width){
			this.speedX = -this.speed
		}
		else if (this.y >= this.bottomEdge){
			this.speed = 1.5;
			this.speedY = 0;
			this.y -= 5;
			this.speedX = -this.speed;
		}

		if (!this.isColliding){
			this.context.drawImage(imageRepository.enemigo, this.x, this.y);

			chance = Math.floor(Math.random()*101)
			if (chance/100 <  percentFire){
				this.fire();
			}
			return false
		}
		else {
			game.playerScore += 10;
			game.explosion.get();
			return true
		}
	};
	
	/*
	 * dispara una bala
	 */
	this.fire = function() {
		game.balaEnemigoPool.get(this.x+this.width/2, this.y+this.height, -2.5);
	};

	/*
	 * reinicia los valores del enemigo
	 */
	this.clear = function() {
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.speedX = 0;
		this.speedY = 0;
		this.alive = false;
		this.isColliding = false;
	};
}
Enemigo.prototype = new Drawable();


/**
 * crea el objeto juego 
 */
function Game() {
	/*
	 * obtiene la informacion y context del canvas
	 * devuelve true si el browser soporta canvas y false si no
	 */
	this.init = function() {
		// obtiene elementos del canvas
		this.bgCanvas = document.getElementById('fondo');
		this.naveCanvas = document.getElementById('nave');
		this.principalCanvas = document.getElementById('principal');

		// testea si el canvas funciona
		if (this.bgCanvas.getContext) {
			this.bgContext = this.bgCanvas.getContext('2d');
			this.naveContext = this.naveCanvas.getContext('2d');
			this.principalContext = this.principalCanvas.getContext('2d');

			// inicializa objetos que contienen context e informacion del canvas
			Fondo.prototype.context = this.bgContext;
			Fondo.prototype.canvasWidth = this.bgCanvas.width;
			Fondo.prototype.canvasHeight = this.bgCanvas.height;

			Nave.prototype.context = this.naveContext;
			Nave.prototype.canvasWidth = this.naveCanvas.width;
			Nave.prototype.canvasHeight = this.naveCanvas.height;

			Bala.prototype.context = this.principalContext;
			Bala.prototype.canvasWidth = this.principalCanvas.width;
			Bala.prototype.canvasHeight = this.principalCanvas.height;

			Enemigo.prototype.context = this.principalContext;
			Enemigo.prototype.canvasWidth = this.principalCanvas.width;
			Enemigo.prototype.canvasHeight = this.principalCanvas.height;

			// inicializa el objeto fondo
			this.fondo = new Fondo();
			this.fondo.init(0,0); 

			// inicilaiza objeto nave
			this.nave = new Nave();
			// define donde aparece la nave
			this.naveStartX = this.naveCanvas.width/2 - imageRepository.nave.width;
			this.naveStartY = this.naveCanvas.height/4*3 + imageRepository.nave.height*2;
			this.nave.init(this.naveStartX, this.naveStartY,
			               imageRepository.nave.width, imageRepository.nave.height);

			// inicia la pool del enemigo
			this.enemigoPool = new Pool(30);
			this.enemigoPool.init("enemigo");
			this.spawnWave();

			this.balaEnemigoPool = new Pool(50);
			this.balaEnemigoPool.init("balaEnemigo");

			// inicia QuadTree
			this.quadTree = new QuadTree({x:0,y:0,width:this.principalCanvas.width,height:this.principalCanvas.height});

			this.playerScore = 0;

			// archivos de audio
			this.laser = new SoundPool(10);
			this.laser.init("laser");

			this.explosion = new SoundPool(20);
			this.explosion.init("explosion");

			this.backgroundAudio = new Audio("JS/sounds/kick_shock.wav");
			this.backgroundAudio.loop = true;
			this.backgroundAudio.volume = .25;
			this.backgroundAudio.load();

			this.gameOverAudio = new Audio("JS/sounds/game_over.wav");
			this.gameOverAudio.loop = true;
			this.gameOverAudio.volume = .25;
			this.gameOverAudio.load();

			this.checkAudio = window.setInterval(function(){checkReadyState()},1000);
		}
	};

	//spawnea una nueva ola de enemigos
	this.spawnWave = function() {
		var height = imageRepository.enemigo.height;
		var width = imageRepository.enemigo.width;
		var x = 100;
		var y = -height;
		var spacer = y * 1.5;
		for (var i = 1; i <= 18; i++) {
			this.enemigoPool.get(x,y,2);
			x += width + 25;
			if (i % 6 == 0) {
				x = 100;
				y += spacer
			}
		}
	}

	// inicia el loop de animacion
	this.start = function() {
		this.nave.draw();
		this.backgroundAudio.play();
		animate();
	};

	// reinicia el juego
	this.restart = function() {
		this.gameOverAudio.pause();

		document.getElementById('game-over').style.display = "none";
		this.bgContext.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
		this.naveContext.clearRect(0, 0, this.naveCanvas.width, this.naveCanvas.height);
		this.principalContext.clearRect(0, 0, this.principalCanvas.width, this.principalCanvas.height);

		this.quadTree.clear();

		this.fondo.init(0,0);
		this.nave.init(this.naveStartX, this.naveStartY,
		               imageRepository.nave.width, imageRepository.nave.height);

		this.enemigoPool.init("enemigo");
		this.spawnWave();
		this.balaEnemigoPool.init("balaEnemigo");

		this.playerScore = 0;

		this.backgroundAudio.currentTime = 0;
		this.backgroundAudio.play();

		this.start();
	};

	// Game over
	this.gameOver = function() {
		this.backgroundAudio.pause();
		this.gameOverAudio.currentTime = 0;
		this.gameOverAudio.play();
		document.getElementById('game-over').style.display = "block";
	};
}

/**
 * se asegura que los sonidos hayan cargado
 */
function checkReadyState() {
	if (game.gameOverAudio.readyState === 4 && game.backgroundAudio.readyState === 4) {
		window.clearInterval(game.checkAudio);
		document.getElementById('loading').style.display = "none";
		game.start();
	}
}


/**
 * la pool de sonido
 */
function SoundPool(maxSize) {
	var size = maxSize; // maximo de balas permitidas en la pool
	var pool = [];
	this.pool = pool;
	var currSound = 0;

	
	this.init = function(object) {
		if (object == "laser") {
			for (var i = 0; i < size; i++) {
				laser = new Audio("JS/sounds/laser.wav");
				laser.volume = .12;
				laser.load();
				pool[i] = laser;
			}
		}
		else if (object == "explosion") {
			for (var i = 0; i < size; i++) {
				var explosion = new Audio("JS/sounds/explosion.wav");
				explosion.volume = .1;
				explosion.load();
				pool[i] = explosion;
			}
		}
	};

	/*
	 * hace un sonido
	 */
	this.get = function() {
		if(pool[currSound].currentTime == 0 || pool[currSound].ended) {
			pool[currSound].play();
		}
		currSound = (currSound + 1) % size;
	};
}


/**
 * el loop de animacion
 */
function animate() {
	document.getElementById('score').innerHTML = game.playerScore;

	// inserta objetos en el quadtree
	game.quadTree.clear();
	game.quadTree.insert(game.nave);
	game.quadTree.insert(game.nave.balaPool.getPool());
	game.quadTree.insert(game.enemigoPool.getPool());
	game.quadTree.insert(game.balaEnemigoPool.getPool());

	detectCollision();

	// no mas enemigos
	if (game.enemigoPool.getPool().length === 0) {
		game.spawnWave();
	}

	// anima los objetos del juego
	if (game.nave.alive) {
		requestAnimFrame( animate );

		game.fondo.draw();
		game.nave.move();
		game.nave.balaPool.animate();
		game.enemigoPool.animate();
		game.balaEnemigoPool.animate();
	}
}

function detectCollision() {
	var objects = [];
	game.quadTree.getAllObjects(objects);

	for (var x = 0, len = objects.length; x < len; x++) {
		game.quadTree.findObjects(obj = [], objects[x]);

		for (y = 0, length = obj.length; y < length; y++) {

			// algoritmo que detecta colision
			if (objects[x].collidableWith === obj[y].type &&
				(objects[x].x < obj[y].x + obj[y].width &&
			     objects[x].x + objects[x].width > obj[y].x &&
				 objects[x].y < obj[y].y + obj[y].height &&
				 objects[x].y + objects[x].height > obj[y].y)) {
				objects[x].isColliding = true;
				obj[y].isColliding = true;
			}
		}
	}
};


// las teclas
KEY_CODES = {
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
}

// crea el array que contiene los key_codes y pone sus valores en true
KEY_STATUS = {};
for (code in KEY_CODES) {
  KEY_STATUS[KEY_CODES[code]] = false;
}
/**
 * caundo haces click en una tecla esto define que tecla fue clickeada dandole el valor true
 */
document.onkeydown = function(e) {
	// Firefox and opera use charCode instead of keyCode to
	// return which key was pressed.
	var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
		e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = true;
  }
}
/**si la tecla no esta siendo clockeada le da el valor false
 */
document.onkeyup = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = false;
  }
}



window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();