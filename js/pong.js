//Clase vector para las posiciones
class Vec {
    constructor (x=0, y=0) {
        this.x = x;
        this.y = y;
    }

    get len() {
        //Aumentamos la velocidad según pasa el tiempo
        return Math.sqrt(this.x * this.x + this.t * this.y);
    }
    set len(value) {
        const fact = value / this.len;
        this.x *= fact;
        this.y *= fact;
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

class Player extends Rect {
    constructor() {
        super(20, 100);
        this.score = 0;
    }
}

class Pong {
    constructor(canvas) {
        this._canvas = canvas;
        this._context = canvas.getContext('2d');

        //Creamos una nueva bola
        this.ball = new Ball;


        //Jugador
        this.players = [
            new Player,
            new Player,
        ];

        //Jugador 1
        this.players[0].pos.x = 40;
        //Jugador 2
        this.players[1].pos.x = this._canvas.width - 40;
        this.players.forEach(player => {
            player.pos.y = this._canvas.height / 2;
        });


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

            this.CHAR_PIXEL = 10;
            this.CHARS = [
                '111101101101111',
                '010010010010010',
                '111001111100111',
                '111001111001111',
                '101101111001001',
                '111100111001111',
                '111100111101111',
                '111001001001001',
                '111101111101111',
                '111101111001111',
            ].map(str => {
                const canvas = document.createElement('canvas');
                canvas.height = this.CHAR_PIXEL * 5;
                canvas.width = this.CHAR_PIXEL * 3;
                const context = canvas.getContext('2d');
                context.fillStyle = '#fff';
                str.split('').forEach((fill, index) => {
                    if(fill === '1') {
                        context.fillRect(
                            (index % 3) * this.CHAR_PIXEL, 
                            (index / 3 | 0) * this.CHAR_PIXEL,
                            this.CHAR_PIXEL,
                            this.CHAR_PIXEL
                        );
                    }
                });

                return canvas;

            });

        this.reset();
    }

    collide(player, ball) {
        if(player.left < ball. right && player.right > ball.left && player.top < ball.bottom && player.bottom > ball.top) {
            const len = ball.vel.len;
            ball.vel.x = -ball.vel.x;
            ball.vel.y += 300 * (Math.random() - .5);
            ball.ve.len *= len * 1.05;
        }
    }

    draw() {
        //Dibujamos el escenario
        this._context.fillStyle = "#000";
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

        //Dibujamos la pelota
        this.drawRect(this.ball);
        this.players.forEach(player => this.drawRect(player));
    }

    drawRect(rect) {
        this._context.fillStyle = "#fff";
        this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
    }

    drawScore() {
        const align = this._canvas.width / 3;
        const CHAR_W = this.CHAR_PIXEL - 4;
        this.players.forEach((player, index) => {
            const chars = player.score.toString().split('');
            const offset = align * (index + 1) - (CHAR_W * chars.length / 2) + this.CHAR_PIXEL;
            chars.forEach((char, pos) => {
                this._context.drawImage(this.CHARS[char|0], offset + pos * CHAR_W, 20);
            });
        });
    }

    reset() {
        //Colocamos la bola y la ponemos enmedio
        this.ball.pos.x = this._canvas.width / 2;
        this.ball.pos.y = this._canvas.height / 2;

        //Le decimos la velocidad en X e Y
        this.ball.vel.x = 0;
        this.ball.vel.y = 0;
    }

    start() {
        if(this.ball.vel.x === 0 && this.ball.vel.y === 0) {
            this.ball.vel.x = 300 * (Math.random() > .5 ? 1 : -1);
            this.ball.vel.y = 300 * (Math.random() * 2 -1); 
            this.ball.vel.len = 200;       
        }
    }

    //Para animar la pelota con un dt (Delta Time)
    update(dt) {
        //Hacemos que la pelota actualice su posicion
        this.ball.pos.x += this.ball.vel.x * dt;
        this.ball.pos.y += this.ball.vel.y * dt;
    
        //Vemos si se sale de la pantalla e invertimos la velocidad por width
        if(this.ball.left < 0 || this.ball.right > this._canvas.width) {
            //Mira si es verdadero o falso o lo convierte en un integer
            let playerId = this.ball.vel.x < 0 | 0;
            this.players[playerId].score++;
            this.reset();

            this.ball.vel.y = -this.ball.vel.y;
        }
    
        //Vemos si se sale de la pantalla e invertimos la velocidad por height
        if(this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
            this.ball.vel.y = -this.ball.vel.y;
        }

        this.players[1].pos.y = this.ball.pos.y;

        this.players.forEach(player => this.collide(player, this.ball));

        this.draw();
    }
}

//Creamos el canvas
const canvas = document.getElementById('pong');
const pong = new Pong(canvas);

canvas.addEventListener('mousemove', event => {
    pong.players[0].pos.y = event.offsetY;
});

canvas.addEventListener('click', event => {
    pong.start();
});