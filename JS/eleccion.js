document.getElementById('vaderSable').addEventListener('click', function() {
    // Acción para el sable de Darth Vader

    window.location.href = 'entradaImperio.html';
});

document.getElementById('obiWanSable').addEventListener('click', function() {
 
    // Redirige a la página entrada.html
    window.location.href = 'entrada.html';
});
function playSound(soundId) {
    var sound = document.getElementById(soundId);
    sound.currentTime = 2;  // Reinicia el sonido si ya está reproduciéndose
    sound.play();
}
