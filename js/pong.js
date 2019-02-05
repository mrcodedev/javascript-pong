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

    get left() {
        return this.pos.x - this.size.x / 2;
    }

    get right() {
        return this.pos.x + this.size.x / 2;
    }

    get top() {
        return this.pos.y - this.size.y / 2;
    }

    get bottom() {
        return this.pos.y + this.size.y / 2;
    }
}

class Ball extends Rect {
    constructor() {
        //Marcamos el tamaño de la bola de 10, 10
        super(10, 10);
        this.vel = new Vec;
    }
}

class Pong {
    constructor(canvas) {
        this._canvas = canvas;
        this._context = canvas.getContext('2d');

        //Creamos una nueva bola
        this.ball = new Ball;
        //La colocamos
        this.ball.pos.x = 100;
        this.ball.pos.y = 50;

        //Le decimos la velocidad en X e Y
        this.ball.vel.x = 100;
        this.ball.vel.y = 100;

        //Ultimo movimiento
        let lastTime;

        const callback = (millis) => {
            //Si existe actualizamos
            if (lastTime) {
                //Fotogramas que se crean
                this.update((millis - lastTime) / 1000);
            }

            lastTime = millis;
            //Creamos un nuevo fotograma
            requestAnimationFrame(callback);
        }
        callback();
    }

    //Para animar la pelota con un dt (Delta Time)
    update(dt) {
        //Hacemos que la pelota actualice su posicion
        this.ball.pos.x += this.ball.vel.x * dt;
        this.ball.pos.y += this.ball.vel.y * dt;
    
        //Vemos si se sale de la pantalla e invertimos la velocidad por width
        if(this.ball.left < 0 || this.ball.right > this._canvas.width) {
            this.ball.vel.x = -this.ball.vel.x;
        }
    
        //Vemos si se sale de la pantalla e invertimos la velocidad por height
        if(this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
            this.ball.vel.y = -this.ball.vel.y;
        }
    
        //Dibujamos el escenario
        this._context.fillStyle = "#000";
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    
        //Dibujamos la pelota
        this._context.fillStyle = "#fff";
        this._context.fillRect(this.ball.pos.x, this.ball.pos.y, this.ball.size.x, this.ball.size.y);
    }
}

//Creamos el canvas
const canvas = document.getElementById('pong');
const pong = new Pong(canvas);