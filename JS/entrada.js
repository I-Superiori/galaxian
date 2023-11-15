KEY_CODES = {
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
}

document.onkeydown = function(e) {
	var keyCode = (KeyboardEvent.keyCode) ? KeyboardEvent.keyCode : KeyboardEvent.charCode;
  if (KEY_CODES[keyCode]) {
		e.prKeyboardEventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = true;
  }
}

document.onkeyup = function(e) {
  var keyCode = (KeyboardEvent.keyCode) ? KeyboardEvent.keyCode : KeyboardEvent.charCode;
  if (KEY_CODES[keyCode]) {
    e.prKeyboardEventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = false;
  }
}

if (KEY_STATUS.space == true){
    window.location.href = "C:\proyectos\galaxian\index.html";
}
if (KEY_STATUS.left || KEY_STATUS.right || KEY_STATUS.down || KEY_STATUS.up){
    window.location.href = "C:\proyectos\galaxian\index.html";
}