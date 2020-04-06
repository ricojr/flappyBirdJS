// select canvas
const canvas = document.getElementById("bird");
const context = canvas.getContext("2d");

// game vars and const
let frames = 0;
const DEGREE = Math.PI / 180;
// load sprite image
const sprite = new Image();
sprite.src = "img/sprite.png";

// load sounds
const SCORE_S = new Audio();
SCORE_S.src = "audio/sfx_point.wav";

const FLAP = new Audio();
FLAP.src = "audio/sfx_flap.wav";

const HIT = new Audio();
HIT.src = "audio/sfx_hit.wav";

const SWOOSHING = new Audio();
SWOOSHING.src = "audio/sfx_swooshing.wav";

const DIE = new Audio();
DIE.src = "audio/sfx_die.wav";

// game state
const state = {
    current: 0,
    getReady: 0,
    game: 1,
    over: 2
}

// start button coord
const startBtn = {
    x: 120,
    y: 263,
    w: 83,
    h: 29,
}

// control the game
canvas.addEventListener("click", function (event) {
    switch (state.current) {
        case state.getReady:
            state.current = state.game;
            SWOOSHING.play();
            break;
        case state.game:
            bird.flap();
            FLAP.play();
            break;
        case state.over:
            let rect = canvas.getBoundingClientRect();
            let clickX = event.clientX - rect.left;
            let clickY = event.clientY - rect.top;

            // check if we click on the start button 
            if (clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h) {
                pipes.reset();
                bird.speedReset();
                score.reset();
                state.current = state.getReady;
            }

            break;
    }
})

// background
// this will draw the background image
const background = {
    sX: 0,
    sY: 0,
    w: 275,
    h: 226,
    x: 0,
    y: canvas.height - 226,

    draw: function () {
        context.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);

        context.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);

    }
}

// foreground
// this will draw the foreground
const foreground = {
    sX: 276,
    sY: 0,
    w: 224,
    h: 112,
    x: 0,
    y: canvas.height - 112,

    dx: 2,

    draw: function () {
        context.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);

        context.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);


    },

    update: function () {
        if (state.current == state.game) {
            this.x = (this.x - this.dx) % (this.w / 2);
        }
    }
}

// bird
const bird = {
    animation: [
        { sX: 276, sY: 112 },
        { sX: 276, sY: 139 },
        { sX: 276, sY: 164 },
        { sX: 276, sY: 139 }

    ],
    x: 50,
    y: 150,
    w: 34,
    h: 26,

    radius: 12,

    frame: 0,


    gravity: 0.25,
    jump: 4.6,
    speed: 0,
    rotation: 0,

    draw: function () {
        let bird = this.animation[this.frame];

        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rotation);
        context.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, - this.w / 2, - this.h / 2, this.w, this.h);

        context.restore();
    },

    flap: function () {
        this.speed = - this.jump;
    },

    update: function () {
        // if the game state is in get ready state, the bird must flap slowly
        this.period = state.current == state.getReady ? 10 : 5;
        // we increment the frame by 1, each period
        this.frame += frames % this.period == 0 ? 1 : 0;
        // frame goes from 0 to 4, then again to 0
        this.frame = this.frame % this.animation.length;

        if (state.current == state.getReady) {
            this.y = 150;// reset the bird position if game over
            this.rotation = 0 * DEGREE;
        } else {
            this.speed += this.gravity;
            this.y += this.speed;

            if (this.y + this.h / 2 >= canvas.height - foreground.h) {
                this.y = canvas.height - foreground.h - this.h / 2;
                if (state.current == state.game) {
                    state.current == state.over;
                    DIE.play();
                }
            }

            // if the speed is greater then the jump means the bird will fall down
            if (this.speed >= this.jump) {
                this.rotation = 90 * DEGREE;
                this.frame = 1;
            } else {
                this.rotation = -25 * DEGREE;
            }

        }
    },
    speedReset: function () {
        this.speed = 0;
    }

}

// get ready message
const getReady = {
    sX: 0,
    sY: 228,
    w: 173,
    h: 152,
    x: canvas.width / 2 - 173 / 2,
    y: 80,

    draw: function () {
        if (state.current == state.getReady) {
            context.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);

        }

    }
}

// game over message
const gameOver = {
    sX: 175,
    sY: 228,
    w: 225,
    h: 202,
    x: canvas.width / 2 - 225 / 2,
    y: 90,

    draw: function () {
        if (state.current == state.over) {
            context.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);

        }

    }
}

// pipes
const pipes = {
    position: [],

    top: {
        sX: 553,
        sY: 0,

    },
    bottom: {
        sX: 502,
        sY: 0,
    },

    w: 53,
    h: 400,
    gap: 85,
    maxYPos: -150,
    dx: 2,

    draw: function () {
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];

            let topYPos = p.y;
            let bottomYPos = p.y + this.h + this.gap;

            // top pipe
            context.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);

            // bottom pipe
            context.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);


        }
    },

    update: function () {
        if (state.current !== state.game) return;

        if (frames % 100 == 0) {
            this.position.push({
                x: canvas.width,
                y: this.maxYPos * (Math.random() + 1)
            });
        }
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];


            let bottomPipeYPos = p.y + this.h + this.gap;

            // collision detection
            // top pipe
            if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h) {
                state.current = state.over;
                HIT.play();
            }

            // bottom pipe
            if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomPipeYPos && bird.y - bird.radius < bottomPipeYPos + this.h) {
                state.current = state.over;
                HIT.play();
            }

            // for hitting the ground
            if (bird.y === 355) {
                state.current = state.over;
                HIT.play();
            }


            // if pipes go beyond canvas, we delete them from the array
            if (p.x + this.w <= 0) {
                this.position.shift();
                score.value += 1;
                SCORE_S.play();
                score.best = Math.max(score.value, score.best);
                localStorage.setItem("best", score.best);
            }
            // move pipes to the left
            p.x -= this.dx;
        }
    },
    reset: function () {
        this.position = [];
    }

}

// score
const score = {
    best: parseInt(localStorage.getItem("best")) || 0,
    value: 0,

    draw: function () {
        context.fillStyle = "#FFF";
        context.strokeStyle = "#000";

        if (state.current == state.game) {
            context.lineWidth = 1.5;
            context.font = "35px Teko";
            context.fillText(this.value, canvas.width / 2, 50);
            context.strokeText(this.value, canvas.width / 2, 50);

        } else if (state.current == state.over) {
            // score value
            context.fillText(this.value, 225, 186);
            context.strokeText(this.value, 225, 186);
            // best score
            context.fillText(this.best, 225, 228);
            context.strokeText(this.best, 225, 228);
        }

    },
    reset: function () {
        this.value = 0;
    }
}

// draw 
function draw() {
    context.fillStyle = "#70c5ce";
    context.fillRect(0, 0, canvas.width, canvas.height);

    background.draw();
    pipes.draw();
    foreground.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
    score.draw();
}
// update
function update() {
    bird.update();
    foreground.update();
    pipes.update();

}

// loop
function loop() {
    update();
    draw();
    frames++;

    requestAnimationFrame(loop);

}
loop();