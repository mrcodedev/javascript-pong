//Clase vector para las posiciones
class Vec {
    constructor (x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    get len() {
        //Aumentamos la velocidad según pasa el tiempo
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    set len(value) {
        const fact = value / this.len;
        this.x *= fact;
        this.y *= fact;
    }
}

//Para crear un rectangulo
class Rect {
    constructor(x = 0, y = 0) {
        this.pos = new Vec(0, 0);
        this.size = new Vec(x, y);
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
        this.vel = new Vec;
        this.score = 0;

        this._lastPos = new Vec;
    }

    update(dt) {
        this.vel.y = (this.pos.y - this._lastPos.y) / dt;
        this._lastPos.y = this.pos.y;
    }
}


class Pong {
    constructor(canvas) {
        this._canvas = canvas;
        this._context = canvas.getContext('2d');

        //Velocidad inicial
        this.initialSpeed = 250;

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
        let lastTime = null;

        this._frameCallback = (millis) => {
            //Si existe actualizamos
            if (lastTime !== null) {
                const diff = millis - lastTime;
                //Fotogramas que se crean
                this.update(diff / 1000);
            }

            lastTime = millis;
            //Creamos un nuevo fotograma
            requestAnimationFrame(this._frameCallback);
        };

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
            str.split('').forEach((fill, i) => {
                if(fill === '1') {
                    context.fillRect(
                        (i % 3) * this.CHAR_PIXEL, 
                        (i / 3 | 0) * this.CHAR_PIXEL,
                        this.CHAR_PIXEL,
                        this.CHAR_PIXEL
                    );
                }
            });

            return canvas;

        });

        this.reset();
    }

    clear() {
        this._context.fillStyle = '#000';
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    }

    collide(player, ball) {
        if(player.left < ball.right && player.right > ball.left && player.top < ball.bottom && player.bottom > ball.top) {
            ball.vel.x = -ball.vel.x * 1.05;
            const len = ball.vel.len;
            ball.vel.y += player.vel.y * .2;
            ball.vel.len = len;
        }
    }

    draw() {
        this.clear();

        //Dibujamos la pelota
        this.drawRect(this.ball);
        this.players.forEach(player => this.drawRect(player));

        this.drawScore();
    }

    drawRect(rect) {
        this._context.fillStyle = "#fff";
        this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
    }

    drawScore() {
        const align = this._canvas.width / 3;
        const CHAR_W = this.CHAR_PIXEL * 4;
        this.players.forEach((player, index) => {
            const chars = player.score.toString().split('');
            const offset = align * (index + 1) - (CHAR_W * chars.length / 2) + this.CHAR_PIXEL / 2;
            chars.forEach((char, pos) => {
                this._context.drawImage(this.CHARS[char|0], offset + pos * CHAR_W, 20);
            });
        });
    }

    play()
    {
        const b = this.ball;
        if (b.vel.x === 0 && b.vel.y === 0) {
            b.vel.x = 200 * (Math.random() > .5 ? 1 : -1);
            b.vel.y = 200 * (Math.random() * 2 - 1);
            b.vel.len = this.initialSpeed;
        }
    }    

    reset() {
        const b = this.ball;

        //Le decimos la velocidad en X e Y
        b.vel.x = 0;
        b.vel.y = 0;
        //Colocamos la bola y la ponemos enmedio
        b.pos.x = this._canvas.width / 2;
        b.pos.y = this._canvas.height / 2;
    }

    start() {
        requestAnimationFrame(this._frameCallback);
    }

    //Para animar la pelota con un dt (Delta Time)
    update(dt) {
        const cvs = this._canvas;
        const ball = this.ball;
        ball.pos.x += ball.vel.x * dt;
        ball.pos.y += ball.vel.y * dt;

        if (ball.right < 0 || ball.left > cvs.width) {
            ++this.players[ball.vel.x < 0 | 0].score;
            this.reset();
        }

        if (ball.vel.y < 0 && ball.top < 0 ||
            ball.vel.y > 0 && ball.bottom > cvs.height) {
            ball.vel.y = -ball.vel.y;
        }

        this.players[1].pos.y = ball.pos.y;

        this.players.forEach(player => {
            player.update(dt);
            this.collide(player, ball);
        });

        this.draw();
    }
}

//Creamos el canvas
const canvas = document.getElementById('pong');
const pong = new Pong(canvas);

canvas.addEventListener('click', () => {
    pong.play();
});

canvas.addEventListener('mousemove', event => {
    const scale = event.offsetY / event.target.getBoundingClientRect().height;
    pong.players[0].pos.y = canvas.height * scale;
});

pong.start();