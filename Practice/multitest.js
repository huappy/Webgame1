var ctx = null;
//map will be its own component, that way I can easily define separate maps for each scene
//would need to take gameMap, tileW, tileH, mapW, and mapH as parameters
let gameMap = [
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

//currentSecond I think these should all be initialized to zero
//if not, try making them persistent variables
var currentSecond = 0, frameCount = 0, framesLastSecond = 0, lastFrameTime = 0;



var roofList = [
	{x:5, y:3, w:11, h:3, data: [
		10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 11,
		10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 11,
		10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 11
	]}
]

//oops this shits actually gettin nuked
// var tileEvents ={
// 	//this will probably be its own component. 
// 	//create a walkable tile at a particular location
// 	23:		drawBridge,
// 	25:		drawBridge,
// 	//these are basically door functions
// 	121:	function(c) {
// 		c.placeAt(1,8);
// 	},
// 	161:	function(c) {
// 		c.placeAt(1,6);
// 	}
// }
// // replaces the type of tile at that location with a walkable tile
// //seems to specify the kind of tile so that it doesn't try to run if it's already been done
// function drawBridge(){
// 	gameMap[toIndex(4,5)] = (gameMap[toIndex(4,5)] == 4? 2 : 4);
// }



var gameTime = 0;
//hell yeah, dictionary. Also, this controls the speed at which the game runs
var gameSpeeds = [
	{name:'Normal', mult: 1},
	{name: 'Slow', mult: 0.3},
	{name: 'Fast', mult: 3},
	{name: 'Paused', mult: 0}
]

var currentSpeed = 0;


//specifically assignes the various kinds of floor types to which you can assign diffeent attributes
var floorTypes = {
	solid: 		0,
	path: 		1,
	water: 		2,
	ice: 		3,
	conveyorU: 	4,
	conveyorD: 	5,
	conveyorL: 	6,
	conveyorR: 	7,
	grass:		8,


}

// Associates each number value in the tilemap with a very specific kind of tile
var tileTypes = {
	0: { color: "gray", floor:floorTypes.path},
	1: { color: "green", floor:floorTypes.grass},
	2: { color: "red", floor:floorTypes.solid},
	3: { color: "#286625", floor:floorTypes.solid },
	4: { color: "#678fd9", floor:floorTypes.water},
	5: { color: "#99ebff", floor: floorTypes.ice},
	6: { color: "purple", floor: floorTypes.conveyorU},
	7: { color: "blue", floor: floorTypes.conveyorD},
	8: { color: "yellow", floor: floorTypes.conveyorL},
	9: { color: "orange", floor: floorTypes.conveyorR},
	10: { color: "#bf8040", floor: floorTypes.solid},			//roof isn't working
	11: {color: "#996633", floor: floorTypes.solid}				//roof isn't working, don't worry about it
}

class Tile {
	constructor(tx, ty, tt) {
		this.x = tx;
		this.y = ty;
		this.type = tt;
		this.roof = null;
		this.roofType = 0;
		this.eventEnter = null;
	}
}

class TileMap {
	constructor() {
		this.map = [];
		this.w = 0;
		this.h = 0;
		this.layers = 4		//how many layers are there available on this map?
	}
	buildMpaFromData(d, w, h) {
		this.w = w;
		this.h = h;

		if (d.length != (w * h)) {
			return false;
		}

		this.map.length	= 0;

		for (var y = 0; y < h; y++) 
		{
			for (var x = 0; x < w; x++) 
			{
				this.map.push(new Tile(x, y, d[((y * w) + x)]));
			}
		}

		return true;
	}

	addRoofs(roofs)			//for now, don't worry about it. it's not gonna change much since it doesn't work
	{
		for(var i in roofs)
		{

		var r = roofs[i]
		if (r.x < 0 || r.y < 0 || r.x >= this.w || r.y >= this.h ||
			(r.x + r.w) > this.w || (r.y + r.h) > this.h ||
			r.data.length != (r.w * r.h))
			{
				continue;
			}
			for(var y = 0; y < r.h; y++)
			{
				for(var x = 0; x < r.w; x++)
				{
					var tileIndex = (((r.y + y) * this.w) + r.x + x)

					this.map[tileIndex].roof = r;
					this.map[tileIndex].roofType = r.data[((y * r.w) + x)]
				}
			}
		}
	}
}


var mapTileData = new TileMap();

//
var directions = {
	up:		0,
	right:	1,
	down:	2,
	left:	3
}
 
//keeps track of which keys are being pressed. This will be replaced with the new methods we're learning now
var keysDown = {
	37 : false,
	38 : false,
	39 : false,
	40 : false
};

//controls where the screen starts and ends, as well as controling the camera. This is gonna be a poain in the ass to migrate so 
var viewport = {
	screen		: [0,0],
	startTile	: [0,0],
	endTile		: [0,0],
	offset		: [0,0],
	update		: function(px, py) {
		this.offset[0] = Math.floor((this.screen[0]/2) - px);
		this.offset[1] = Math.floor((this.screen[1]/2) - py);

		var tile = [ Math.floor(px/tileW), Math.floor(py/tileH) ];

		this.startTile[0] = tile[0] - 1 - 
		Math.ceil((this.screen[0]/2) / tileW);
		this.startTile[1] = tile[1] - 1 - 
		Math.ceil((this.screen[1]/2) / tileH);

		if(this.startTile[0] < 0) 
		{ 
			this.startTile[0] = 0; 
		}
		if(this.startTile[1] < 0) 
		{ 
			this.startTile[1] = 0; 
		}

		this.endTile[0] = tile[0] + 1 + 
		Math.ceil((this.screen[0]/2) / tileW);
		this.endTile[1] = tile[1] + 1 + 
		Math.ceil((this.screen[1]/2) / tileH);

		if(this.endTile[0] >= mapW) 
		{ 
			this.endTile[0] = mapW-1; 
		}
		if(this.endTile[1] >= mapH)
		{
			this.endTile[1] = mapH-1; 
		}
	}
};

class Character {
	constructor() {
		this.tileFrom = [1, 1];
		this.tileTo = [1, 1];
		this.timeMoved = 0;
		this.dimensions = [30, 30];
		this.position = [45, 45];

		//defines the movement delay (part 1 of the movement speed) for each kind of tile
		this.delayMove = {};
		this.delayMove[floorTypes.path] = 400
		this.delayMove[floorTypes.grass] = 400;
		this.delayMove[floorTypes.ice] = 300
		this.delayMove[floorTypes.conveyorU]= 200
		this.delayMove[floorTypes.conveyorD] = 200
		this.delayMove[floorTypes.conveyorR] = 200
		this.delayMove[floorTypes.conveyorL] = 200

		this.direction = directions.up;

	}
	placeAt(x, y) {
		this.tileFrom = [x, y];
		this.tileTo = [x, y];
		this.position = [((tileW * x) + ((tileW - this.dimensions[0]) / 2)),
		((tileH * y) + ((tileH - this.dimensions[1]) / 2))];
	}
	processMovement(t) {
		if (this.tileFrom[0] == this.tileTo[0] && 
			this.tileFrom[1] == this.tileTo[1]) 
		{ 
			return false; 
		}

		//controls movement speed using the delay of the type of tile you're on and the type you're moving to
		var moveSpeed = this.delayMove[tileTypes[
			mapTileData.map[toIndex(this.tileFrom[0], 
				this.tileFrom[1])].type].floor];

		if ((t - this.timeMoved) >= moveSpeed) 
		{
			this.placeAt(this.tileTo[0], this.tileTo[1]);


			//if the tile you're moving to is associated with some sort of event, do that event
			if(mapTileData.map[toIndex(this.tileTo[0], this.tileTo[1])].eventEnter!=null)
			{
				mapTileData.map[toIndex(this.tileTo[0], this.tileTo[1])].eventEnter(this)
			}

			var tileFloor = tileTypes[mapTileData.map[toIndex(this.tileFrom[0], this.tileFrom[1])].type].floor;

			if(tileFloor == floorTypes.ice)
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
			else if(tileFloor == floorTypes.conveyorU && this.canMoveUp())
			{
				this.moveUp(t)
			}
			else if(tileFloor == floorTypes.conveyorD && this.canMoveDown())
			{
				this.moveDown(t)
			}

		}

		else {
			this.position[0] = (this.tileFrom[0] * tileW) + ((tileW - this.dimensions[0]) / 2);
			this.position[1] = (this.tileFrom[1] * tileH) + ((tileH - this.dimensions[1]) / 2);

			if (this.tileTo[0] != this.tileFrom[0]) {
				//here's where it actually tells the game what speed to move
				var diff = (tileW / moveSpeed) * (t - this.timeMoved);
				this.position[0] += (this.tileTo[0] < this.tileFrom[0] ? 0 - diff : diff);
			}
			if (this.tileTo[1] != this.tileFrom[1]) {
				var diff = (tileH / moveSpeed) * (t - this.timeMoved);
				this.position[1] += (this.tileTo[1] < this.tileFrom[1] ? 0 - diff : diff);
			}

			this.position[0] = Math.round(this.position[0]);
			this.position[1] = Math.round(this.position[1]);
		}

		return true;
	}

	canMoveTo(x,y){
		if(x < 0 || x >= mapW || y < 0 || y >= mapH){
			return false;
		}
		if(typeof this.delayMove[tileTypes[mapTileData.map[toIndex(x,y)].type].floor] =="undefined")  {
			return false
		}

		return true;
	}

	canMoveUp(){
		return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] - 1)
	}

	canMoveDown(){
		return this.canMoveTo(this.tileFrom[0], this.tileFrom[1] + 1);
	}
	canMoveLeft() {
		return this.canMoveTo(this.tileFrom[0] -1, this.tileFrom[1]);
	}
	canMoveRight() {
		return this.canMoveTo(this.tileFrom[0] +1, this.tileFrom[1])
	}
	canMoveDirection(d){
		switch(d){
			case directions.up:
				return this.canMoveUp()
			case directions.down:
				return this.canMoveDown();
			case directions.left:
				return this.canMoveDown();
			default:
				return this.canMoveRight();

		}
	}

	moveLeft(t){
		this.tileTo[0] -= 1; 
		this.timeMoved = t;
		this.direction = directions.left;
	}
	moveRight(t) {
		this.tileTo[0] += 1;
		this.timeMoved = t;
		this.direction = directions.right
	}
	moveUp(t){
		this.tileTo[1] -= 1;
		this.timeMoved = t;
		this.direction = directions.up
	}
	moveDown(t){
		this.tileTo[1] += 1;
		this.timeMoved = t;
		this.direction = directions.down
	}

	moveDirection(d,t){
		switch(d){

		case directions.up:
			return this.moveUp(t)
		case directions.down:
			return this.moveDown(t)
		case directions.left:
			return this.moveLeft(t);
		default:
			return this.moveRight(t)

		}
	}

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

	window.addEventListener("keydown", function(e) 
	{
		if(e.keyCode>=37 && e.keyCode<=40) 
		{ 
			keysDown[e.keyCode] = true; 
		}
	});
	window.addEventListener("keyup", function(e) 
	{
		if(e.keyCode>=37 && e.keyCode<=40) 
		{ 
			keysDown[e.keyCode] = false; 
		}
		if(e.keyCode == 83)
		{
			currentSpeed = (currentSpeed >= (gameSpeeds.length-1) ? 0: currentSpeed+1)
		}
	});

	viewport.screen = 
	[document.getElementById('game').width,
		document.getElementById('game').height];

	mapTileData.buildMpaFromData(gameMap, mapW, mapH);
	mapTileData.addRoofs(roofList);

	mapTileData.map[((2 * mapW) + 2)].eventEnter = function(){
		console.log("Entered tile 2,2");}


};


function drawGame()
{
	if(ctx==null) { 
		return; 
	}

	var currentFrameTime = Date.now();
	var timeElapsed = currentFrameTime - lastFrameTime;
	gameTime += Math.floor(timeElapsed * gameSpeeds[currentSpeed].mult)

	var sec = Math.floor(Date.now()/1000);
	if(sec!=currentSecond)
	{
		currentSecond = sec;
		framesLastSecond = frameCount;
		frameCount = 1;
	}
	else { 
		frameCount++; 
	}

	if(!player.processMovement(gameTime) && gameSpeeds[currentSpeed].mult!=0)
	{
		if(keysDown[38] && player.canMoveUp())
		{
			player.moveUp(gameTime)
		}
		else if (keysDown[40] && player.canMoveDown()) 
		{
			player.moveDown(gameTime)
		}
		else if(keysDown[37] && player.canMoveLeft()) 
		{
			player.moveLeft(gameTime)
		}
		else if(keysDown[39] && player.canMoveRight()) 
		{
			player.moveRight(gameTime)
		}

	}

	viewport.update(player.position[0] + (player.dimensions[0]/2),
		player.position[1] + (player.dimensions[1]/2));

	var playerRoof1 = mapTileData.map[toIndex(
		player.tileFrom[0], player.tileFrom[1])].roof;
		
	var playerRoof2 = mapTileData.map[toIndex(
		player.tileTo[0], player.tileTo[1])].roof

	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, viewport.screen[0], viewport.screen[1]);


		for(var y = viewport.startTile[1]; y <= viewport.endTile[1]; ++y)
		{
			for(var x = viewport.startTile[0]; x <= viewport.endTile[0]; ++x)
			{

					ctx.fillStyle = tileTypes[mapTileData.map[toIndex(x,y)].type].color;

					ctx.fillRect( viewport.offset[0] + (x*tileW), viewport.offset[1] + (y*tileH),
						tileW, tileH);
			
			}
		}
	
	ctx.fillStyle = "#0000ff";
	ctx.fillRect(viewport.offset[0] + player.position[0], viewport.offset[1] + player.position[1],
		player.dimensions[0], player.dimensions[1]);

	ctx.fillStyle = "#ff0000";
	ctx.fillText("FPS: " + framesLastSecond, 10, 20);
	ctx.fillText("Game speed: " +gameSpeeds[currentSpeed].name, 10, 40)

	lastFrameTime = currentFrameTime;
	requestAnimationFrame(drawGame);
}