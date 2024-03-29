var ctx = null;
var gameMap = [
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 9, 9, 9, 9, 7, 1, 0,
    0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 2, 2, 7, 1, 0,
    0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 6, 8, 8, 8, 8, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 4, 5, 5, 5, 5, 1, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 0,
    0, 1, 1, 5, 5, 5, 5, 4, 1, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 0,
    0, 1, 1, 5, 4, 5, 5, 4, 1, 0, 0, 1, 2, 2, 0, 2, 2, 1, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];
var tileW = 40, tileH = 40;
var mapW = 20, mapH = 20;
var currentSecond = 0, frameCount = 0, framesLastSecond = 0, lastFrameTime = 0;


var floorTypes = {
	solid	: 0,
	path	: 1,
	water	: 2,
	ice		: 3,
	conveyorU	: 4,
	conveyorD	: 5,
	conveyorL	: 6,
	conveyorR	: 7
};

var floorTypes = {
	solid	: 0,
	path	: 1,
	water	: 2
};
var tileTypes = {
	0 : { colour:"#685b48", floor:floorTypes.path},
	1 : { colour:"#5aa457", floor:floorTypes.path},
	2 : { colour:"#e8bd7a", floor:floorTypes.path},
	3 : { colour:"#286625", floor:floorTypes.solid},
	4 : { colour:"#678fd9", floor:floorTypes.water},
    //TODO: conveyor belts behaving like ice. fix it nerd
    5 : { colour:"red", floor:floorTypes.ice},
    6 : { colour:"blue", floor:floorTypes.conveyorL },
    7 : { colour:"purple", floor:floorTypes.conveyorR },
    8 : { colour:"orange", floor:floorTypes.conveyorD },
    9 : { colour:"yellow", floor:floorTypes.conveyorU	}
};

var directions = {
	up		: 0,
	right	: 1,
	down	: 2,
	left	: 3
};

var keysDown = {
	37 : false,
	38 : false,
	39 : false,
	40 : false
};

var viewport = {
	screen		: [0,0],
	startTile	: [0,0],
	endTile		: [0,0],
	offset		: [0,0],
	update		: function(px, py) {
		this.offset[0] = Math.floor((this.screen[0]/2) - px);
		this.offset[1] = Math.floor((this.screen[1]/2) - py);

		var tile = [ Math.floor(px/tileW), Math.floor(py/tileH) ];

		this.startTile[0] = tile[0] - 1 - Math.ceil((this.screen[0]/2) / tileW);
		this.startTile[1] = tile[1] - 1 - Math.ceil((this.screen[1]/2) / tileH);

		if(this.startTile[0] < 0) { this.startTile[0] = 0; }
		if(this.startTile[1] < 0) { this.startTile[1] = 0; }

		this.endTile[0] = tile[0] + 1 + Math.ceil((this.screen[0]/2) / tileW);
		this.endTile[1] = tile[1] + 1 + Math.ceil((this.screen[1]/2) / tileH);

		if(this.endTile[0] >= mapW) { this.endTile[0] = mapW-1; }
		if(this.endTile[1] >= mapH) { this.endTile[1] = mapH-1; }
	}
};


class Character {
    constructor() {
        this.tileFrom = [1, 1];
        this.tileTo = [1, 1];
        this.timeMoved = 0;
        this.dimensions = [30, 30];
        this.position = [45, 45];
        this.delayMove = 700;

        this.direction	= directions.up;
    }
    placeAt(x, y) {
        this.tileFrom = [x, y];
        this.tileTo = [x, y];
        this.position = [((tileW * x) + ((tileW - this.dimensions[0]) / 2)),
        ((tileH * y) + ((tileH - this.dimensions[1]) / 2))];
    }
    processMovement(t) {
        if (this.tileFrom[0] == this.tileTo[0] && this.tileFrom[1] == this.tileTo[1]) { return false; }

        if ((t - this.timeMoved) >= this.delayMove) {
            this.placeAt(this.tileTo[0], this.tileTo[1]);
            var tileFloor = tileTypes[gameMap[toIndex(this.tileFrom[0], this.tileFrom[1])]].floor;

            if(tileFloor==floorTypes.ice)
            {
                if(this.canMoveDirection(this.direction))
                {
                    this.moveDirection(this.direction, t);
                }
            }
            else if(tileFloor==floorTypes.conveyorL && this.canMoveLeft())	
			{ 
				this.moveLeft(t); 
			}
            else if(tileFloor==floorTypes.conveyorR && this.canMoveRight()) 
			{ 
				this.moveRight(t);
			}
            else if(tileFloor==floorTypes.conveyorU && this.canMoveUp())	
			{
				this.moveUp(t); 
			}
            else if(tileFloor==floorTypes.conveyorD && this.canMoveDown())	
			{
				this.moveDown(t); 
			}
        
        }

        else {
            this.position[0] = (this.tileFrom[0] * tileW) + ((tileW - this.dimensions[0]) / 2);
            this.position[1] = (this.tileFrom[1] * tileH) + ((tileH - this.dimensions[1]) / 2);

            if (this.tileTo[0] != this.tileFrom[0]) {
                var diff = (tileW / this.delayMove) * (t - this.timeMoved);
                this.position[0] += (this.tileTo[0] < this.tileFrom[0] ? 0 - diff : diff);
            }
            if (this.tileTo[1] != this.tileFrom[1]) {
                var diff = (tileH / this.delayMove) * (t - this.timeMoved);
                this.position[1] += (this.tileTo[1] < this.tileFrom[1] ? 0 - diff : diff);
            }

            this.position[0] = Math.round(this.position[0]);
            this.position[1] = Math.round(this.position[1]);
        }

        return true;
    }
    canMoveTo(x, y) {
        if (x < 0 || x >= mapW || y < 0 || y >= mapH) { return false; }
        if(tileTypes[gameMap[toIndex(x,y)]].floor!=floorTypes.path &&
		tileTypes[gameMap[toIndex(x,y)]].floor!=floorTypes.ice &&
		tileTypes[gameMap[toIndex(x,y)]].floor!=floorTypes.conveyorU &&
		tileTypes[gameMap[toIndex(x,y)]].floor!=floorTypes.conveyorD &&
		tileTypes[gameMap[toIndex(x,y)]].floor!=floorTypes.conveyorL &&
		tileTypes[gameMap[toIndex(x,y)]].floor!=floorTypes.conveyorR) { return false; }
        return true;
    }
    canMoveUp() { return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] - 1); }
    canMoveDown() { return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] + 1); }
    canMoveLeft() { return this.canMoveTo(this.tileFrom[0] - 1, this.tileFrom[1]); }
    canMoveRight() { return this.canMoveTo(this.tileFrom[0] + 1, this.tileFrom[1]); }
    
    canMoveDirection(d){
        switch(d)
        {
            case directions.up:
                return this.canMoveUp();
            case directions.down:
                return this.canMoveDown();
            case directions.left:
                return this.canMoveLeft();
            default:
                return this.canMoveRight();
        }
    };
    
    moveLeft(t) { this.tileTo[0]-=1; this.timeMoved = t; this.direction = directions.left; };
    moveRight(t) { this.tileTo[0]+=1; this.timeMoved = t; this.direction = directions.right; };
    moveUp(t) { this.tileTo[1]-=1; this.timeMoved = t; this.direction = directions.up; };
    moveDown(t) { this.tileTo[1]+=1; this.timeMoved = t; this.direction = directions.down; };

    moveDirection(d, t) {
        switch(d)
        {
            case directions.up:
                return this.moveUp(t);
            case directions.down:
                return this.moveDown(t);
            case directions.left:
                return this.moveLeft(t);
            default:
                return this.moveRight(t);
        }
    };

}
var player = new Character();

function toIndex(x, y)
{
	return((y * mapW) + x);
}

window.onload = function()
{
	ctx = document.getElementById('game').getContext("2d");
	requestAnimationFrame(drawGame);
	ctx.font = "bold 10pt sans-serif";

	window.addEventListener("keydown", function(e) {
		if(e.keyCode>=37 && e.keyCode<=40) { keysDown[e.keyCode] = true; }
	});
	window.addEventListener("keyup", function(e) {
		if(e.keyCode>=37 && e.keyCode<=40) { keysDown[e.keyCode] = false; }
	});

	viewport.screen = [document.getElementById('game').width,
		document.getElementById('game').height];
};

function drawGame()
{
	if(ctx==null) { return; }

	var currentFrameTime = Date.now();
	var timeElapsed = currentFrameTime - lastFrameTime;

	var sec = Math.floor(Date.now()/1000);
	if(sec!=currentSecond)
	{
		currentSecond = sec;
		framesLastSecond = frameCount;
		frameCount = 1;
	}
	else { frameCount++; }

	if(!player.processMovement(currentFrameTime))
	{
		if(keysDown[38] && player.canMoveUp())			{ player.moveUp(currentFrameTime); }
		else if(keysDown[40] && player.canMoveDown())	{ player.moveDown(currentFrameTime); }
		else if(keysDown[37] && player.canMoveLeft())	{ player.moveLeft(currentFrameTime); }
		else if(keysDown[39] && player.canMoveRight())	{ player.moveRight(currentFrameTime); }
	}

	viewport.update(player.position[0] + (player.dimensions[0]/2),
		player.position[1] + (player.dimensions[1]/2));

	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, viewport.screen[0], viewport.screen[1]);

	for(var y = viewport.startTile[1]; y <= viewport.endTile[1]; ++y)
	{
		for(var x = viewport.startTile[0]; x <= viewport.endTile[0]; ++x)
		{
			ctx.fillStyle = tileTypes[gameMap[toIndex(x,y)]].colour;

			ctx.fillRect( viewport.offset[0] + (x*tileW), viewport.offset[1] + (y*tileH),
				tileW, tileH);
		}
	}


	ctx.fillStyle = "#0000ff";
	ctx.fillRect(viewport.offset[0] + player.position[0], viewport.offset[1] + player.position[1],
		player.dimensions[0], player.dimensions[1]);

	ctx.fillStyle = "#ff0000";
	ctx.fillText("FPS: " + framesLastSecond, 10, 20);

	lastFrameTime = currentFrameTime;
	requestAnimationFrame(drawGame);
}