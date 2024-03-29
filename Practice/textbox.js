
class Character {
    constructor() {
        this.tileFrom = [1, 1];
        this.tileTo = [1, 1];
        this.timeMoved = 0;
        this.dimensions = [30, 30];
        this.position = [45, 45];
        this.delayMove = 700;
    }
    placeAt(x, y) {
        this.tileFrom = [x, y];
        this.tileTo = [x, y];
        this.position = [((thileW * x) +
            ((tileW - this.dimensions[0]) / 2),
            (tileH * y) + (tileH - this.dimensions[1]) / 2)];

    }
    processMovement(t) {
        if (this.tileFrom[0] == this.tileTo[0] &&
            this.tileFrom[1] == this.tileTo[1]) {
            return false;
        }

        if ((t - this.timeMoved) >= this.delayMove) {
            this.placeAt(this.tileTo[0], this.tileTo[1]);
        }
        else {
            this.position[0] = (this.tileFrom[0] * tileW) +
                ((tileW - this.dimesions[0]) / 2);
            this.position[1] = (this.tileFrom[1] * tileH) +
                ((tileH - this.dimensions[1]) / 2);
            if (this.tileTo[0] != this.tileFrom[0]) {
                let diff = (tileW / this.delayMove) *
                    (t - this.timeMoved);
                this.position[0] += (this.tileTo[0] < this.tileFrom[0] ?
                    0 - diff : diff);
            }
            if (this.tileTo[1] != this.tileFrom[1]) {
                let diff = (tileH / this.delayMove) *
                    (t - this.timeMoved);
                this.position[1] += (this.tileTo[1] < this.tileFrom[1] ?
                    0 - diff : diff);
            }
            this.position[0] = Math.round(this.position[0]);
            this.position[1] = Math.round(this.position[1]);
        }
        return true;
    }
}

let ctx = null;
//tileW * mapW = how big the canvas needs to be
let tileW = 40;
let tileH = 40;
//map variables determine how many tiles are on the canvas
let mapW = 20;
let mapH = 20;

let currentSecond = 0;
let frameCount = 0;
let framesLastSecond = 0;
let lastFrameTime = 0;

let keysDown = {
    37: false,
    38: false,
    39: false,
    40: false
}

let player = new Character();

let gameMap = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 2, 2, 2, 2, 2, 1, 0, 0, 1, 1, 2, 2, 2, 2, 2, 1, 0,
    0, 1, 1, 2, 2, 2, 2, 2, 1, 0, 0, 1, 1, 2, 2, 2, 2, 2, 1, 0,
    0, 1, 1, 2, 2, 1, 2, 2, 1, 0, 0, 1, 1, 2, 2, 1, 2, 2, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 2, 2, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 0,
    0, 1, 1, 2, 2, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 0,
    0, 1, 1, 2, 2, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 2, 2, 1, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];




//move
function toIndex(x,y){
    return((y*mapW) + x)
}

window.onload = function()
{
    ctx = document.getElementById("game").getContext('2d');
    requestAnimationFrame(drawGame);
    ctx.font = "bold 10pt sans-serif";

    window.addEventListener("keydown", function(e){
        if(e.keyCode >= 37 && e.keyCode <= 40){
            keysDown[e.keyCode] = true;
        }
    });
    window.addEventListener("keyup", function(e){
        if(e.keyCode >= 37 && e.keyCode <= 40){
            keysDown[e.keyCode] = false;
        }
    });
}

function drawGame(){
    if(ctx==null){
        return;
    }

    let currentFrameTime = Date.now();
    let timeElapsed = currentFrameTime - lastFrameTime;


    let sec = Math.floor(Date.now()/1000);
    if(sec!==currentSecond){
        currentSecond = sec;
        framesLastSecond = frameCount;
        frameCount = 1;
    }
    else {
        frameCount++;
    }

    if(!player.processMovement(currentFrameTime)){
        if(keysDown[38] && player.tileFrom[1] > 0 &&
            gameMap[toIndex(player.tileFrom[0],
                player.tileFrom[1]-1)]==1)
                {
                    player.tileTo[1] -= 1;

                }
        else if(keysDown[40] && player.tileFrom [1]<(mapH-1) &&
        gameMap[toIndex(player.tileFrom[0],
            player.tileFrom[1]-1)]==1)
            {
                player.tileTo[1] -=1;
            }


        else if(keysDown[37] && player.tileFrom[0] > 0 &&
            gameMap[toIndex(player.tileFrom[0]-1,
                player.tileFrom[1])]==1)
                {
                    player.tileTo[0] -= 1;
                }

        else if(keysDown[39] && player.tileFrom [0]<(mapW-1) &&
        gameMap[toIndex(player.tileFrom[0]+1,
            player.tileFrom[1])]==1)
            {
                player.tileTo[0] +=1;
            }

        if(player.tileFrom[0] != player.tileTo[0] ||
            player.tileFrom[1] != player.tileTo[1])
            {
                player.timeMoved = currentFrameTime;
            }
                
    }

    for(let y = 0; y < mapH; y++){
        for(let x = 0; x < mapW; x++){
            switch(gameMap[((y * mapW) + x)]){
                case 0:
                    ctx.fillStyle = "#999999";
                    break;
                case 1:
                    ctx.fillStyle = "green";
                    break;
                case 2:
                    ctx.fillStyle = "red";

            }
            ctx.fillRect(x*tileW, y*tileH, tileW, tileH);
        }
    }

ctx.fillStyle = "#0000ff"
ctx.fillRect(player.position[0], player.position[1],
    player.dimensions[0], player.dimensions[1])

ctx.fillStyle = "#ff0000";
ctx.fillText("FPS: " + framesLastSecond, 10, 20);

lastFrameTime = currentFrameTime;
requestAnimationFrame(drawGame);
}