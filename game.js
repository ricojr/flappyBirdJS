// select canvas
const canvas = document.getElementById("bird");
const context = canvas.getContext("2d");

// game vars and const
let frames = 0;
const DEGREE = Math.PI/180;
// load sprite image
const sprite = new Image();
sprite.src = "img/sprite.png";

// game state
const state = {
    current : 0,
    getReady : 0,
    game : 1,
    over : 2
}

// control the game
document.addEventListener("click", function(event){
    switch(state.current){
        case state.getReady:
            state.current = state.game;
            break;
        case state.game:
            bird.flap();
            break;
        case state.over:
            state.current = state.getReady;
            break;
    }
})

// background
// this will draw the background image
const background = {
    sX : 0,
    sY : 0,
    w : 275,
    h : 226,
    x : 0,
    y : canvas.height - 226,

    draw : function(){
        context.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);

        context.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);

    }
}

// foreground
// this will draw the foreground
const foreground = {
    sX : 276,
    sY : 0,
    w : 224,
    h : 112,
    x : 0,
    y : canvas.height - 112,
    
    dx : 2,

    draw : function(){
        context.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);

        context.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);


    },

    update : function(){
        if(state.current == state.game){
            this.x = (this.x - this.dx)%(this.w/2);
        }
    }
}

// bird
const bird = {
    animation : [
        {sX: 276, sY: 112},
        {sX: 276, sY: 139},
        {sX: 276, sY: 164},
        {sX: 276, sY: 139}
        
    ],
    x : 50,
    y : 150,
    w : 34,
    h : 26,

    frame : 0,

    gravity : 0.25,
    jump : 4.6,
    speed : 0,
    rotation : 0,

    draw : function(){
        let bird = this.animation[this.frame];

        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rotation);
        context.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, - this.w/2, - this.h/2, this.w, this.h);

        context.restore();
    },

    flap : function(){
        this.speed = - this.jump;
    },

    update : function(){
        // if the game state is in get ready state, the bird must flap slowly
        this.period = state.current == state.getReady ? 10 : 5;
        // we increment the frame by 1, each period
        this.frame += frames%this.period == 0 ? 1 : 0;
        // frame goes from 0 to 4, then again to 0
        this.frame = this.frame%this.animation.length; 

        if(state.current == state.getReady){
            this.y = 150;// reset the bird position if game over
            this.rotation = 0 * DEGREE;
        }else{
            this.speed += this.gravity;
            this.y += this.speed;

            if(this.y + this.h/2 >= canvas.height - foreground.h){
                this.y = canvas.height - foreground.h -this.h/2;
                if(state.current == state.game){
                    state.current = state.over;
                }
            }
            
            // if the speed is greater then the jump means the bird will fall down
            if(this.speed >= this.jump){
                this.rotation = 90 * DEGREE;
                this.frame = 1;
            }else{
                this.rotation = -25 * DEGREE;
            }

        }
    }
    
}

// get ready message
const getReady = {
    sX : 0,
    sY : 228,
    w : 173,
    h : 152,
    x : canvas.width/2 - 173/2,
    y : 80,

    draw : function(){
        if(state.current == state.getReady){
            context.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);

        }

    }
}

// game over message
const gameOver = {
    sX : 175,
    sY : 228,
    w : 225,
    h : 202,
    x : canvas.width/2 - 225/2,
    y : 90,

    draw : function(){
        if(state.current == state.over){
            context.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);

        }

    }
}
// draw 
function draw(){
    context.fillStyle = "#70c5ce";
    context.fillRect(0, 0, canvas.width, canvas.height);

    background.draw();
    foreground.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
}
// update
function update(){
    bird.update();
    foreground.update();
}

// loop
function loop(){
    update();
    draw();
    frames++;

    requestAnimationFrame(loop);

}
loop();