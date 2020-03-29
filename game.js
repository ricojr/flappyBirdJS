// select canvas
const canvas = document.getElementById("bird");
const context = canvas.getContext("2d");

// game vars and const
let frames = 0;

// load sprite image
const sprite = new Image();
sprite.src = "img/sprite.png";

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

    draw : function(){
        context.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);

        context.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);


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

    draw : function(){
        let bird = this.animation[this.frame];
        context.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, this.x, this.y, this.w, this.h);

    }
    
}
// draw 
function draw(){
    context.fillStyle = "#70c5ce";
    context.fillRect(0, 0, canvas.width, canvas.height);

    background.draw();
    foreground.draw();
    bird.draw();
}
// update
function update(){

}

// loop
function loop(){
    update();
    draw();
    frames++;

    requestAnimationFrame(loop);

}
loop();