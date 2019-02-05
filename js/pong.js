//Clase vector para las posiciones
class Vec {
    constructor (x=0, y=0) {
        this.x = x;
        this.y = y;
    }
}

//Para crear un rectangulo
class Rect {
    constructor(w, h) {
        this.pos = new Vec;
        this.size = new Vec(w, h);
    }
}

class Ball extends Rect {
    constructor() {
        //Marcamos el tamaño de la bola de 10, 10
        super(10, 10);
        this.vel = new Vec;
    }
}

//Creamos el canvas
const canvas = document.getElementById('pong');
const context = canvas.getContext('2d');

//Creamos una nueva bola
const ball = new Ball;
//La colocamos
ball.pos.x = 100;
ball.pos.y = 50;

//Le decimos la velocidad en X e Y
ball.vel.x = 100;
ball.vel.y = 100;

//Ultimo movimiento
let lastTime;

function callback(millis) {
    //Si existe actualizamos
    if (lastTime) {
        //Fotogramas que se crean
        update((millis - lastTime) / 1000);
    }

    lastTime = millis;
    //Creamos un nuevo fotograma
    requestAnimationFrame(callback);
}

//Para animar la pelota con un dt (Delta Time)
function update(dt) {
    //Hacemos que la pelota actualice su posicion
    ball.pos.x += ball.vel.x * dt;
    ball.pos.y += ball.vel.y * dt;

    //Vemos si se sale de la pantalla e invertimos la velocidad por width
    if(ball.pos.x < 0 || ball.pos.x > canvas.width) {
        ball.vel.x = -ball.vel.x;
    }

    //Vemos si se sale de la pantalla e invertimos la velocidad por height
    if(ball.pos.y < 0 || ball.pos.y > canvas.height) {
        ball.vel.y = -ball.vel.y;
    }

    //Dibujamos el escenario
    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height);

    //Dibujamos la pelota
    context.fillStyle = "#fff";
    context.fillRect(ball.pos.x, ball.pos.y, ball.size.x, ball.size.y);
}

callback();