import "/engine/engine.js"
import "./RPGCharacter.js"
//LOOK AT CLASS NOTES (the written ones) FOR WORLD --> SCREEN--> GUI TRANSLATION FOR MAKING TEXTBOXES
//also look at camera class for the code for camera transitions
//---------------------------------Start Scene-------------------------------
class StartController extends Component{
    start() {
        this.freezeTime = 0
        this.maxFreezeTime = 1
    }
    update() {
        this.freezeTime += Time.deltaTime
        if (keysDown["f"] && this.freezeTime >= this.maxFreezeTime){
            SceneManager.changeScene(1)
        }
    }
}

// class StartDrawComponent extends Component{
//     draw(ctx) {
//         ctx.fillStyle = "black"
//         ctx.fillRect(0,0, canvas.width, canvas.height)
//         ctx.fillStyle = "white"
//         ctx.fillText("Title", canvas.width/2, canvas.height/2)
//         ctx.fillText("New Game", (canvas.width/2)+15, (canvas.height/2)+15)
//         ctx.fillText("Load Game", (canvas.width/2)+30, (canvas.height/2)+30)
//     }
// }

class StartControllerGameObject extends GameObject{
    start() {
        this.addComponent(new StartController())
    }
}


class StartScene extends Scene {
    constructor(){
        super("gray")
    }    
    start() {
        this.addGameObject(new StartControllerGameObject(new StartController()))
        this.addGameObject(new GameObject("RPG").addComponent(
            new Text("This is the Title", "white")), new Vector2(-125, 20))
    
        }
        update(){
            if (keysDown["f"]){
                SceneManager.changeScene(1)
            }
        }
}




//---------------------------------Main-------------------------------

//specifically assignes the various kinds of floor types to which you can assign diffeent attributes
let floorTypes = {
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

let directions = {
	up:		0,
	right:	1,
	down:	2,
	left:	3
}

// Associates each number value in the tilemap with a very specific kind of tile
let tileTypes = {
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

let scene1Map = [
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
//look at example copy folder from class today
class TileMap extends Component{
	constructor(map, tileWidth, tileHeight, mapWidth, mapHeight, layers) {
    super()
	this.map = [];		//a list of tiles in the map
	this.tileW = tileWidth 
	this.tileH = tileHeight;
	this.mapW = mapWidth
	this.mapH= mapHeight;
	this.layers = layers	//how many layers are there available on this map?

	}
	buildMpaFromData(mapDimensions, width, height) {
		this.mapWidth = width;
		this.mapHeight = height;

		// if the map's dimensions are greater than what the tile map says they should be, there be a problem
		if (mapDimensions.length != (width * height)) {
			return false;
		}

		this.map.length	= 0;

		for (let y = 0; y < height; y++) 
		{
			for (let x = 0; x < width; x++) 
			{
				//adds a new Tile to the list of tiles in the map at coordinates x,y with the tile type at that location
				this.map.push(new TileComponent(x, y, mapDimensions[((y * width) + x)]));
			}
		}

		return true;
	}
}


class TileComponent extends Component {
	constructor(tileX, tileY, tileType) {
		super()
        this.x = tileX;
		this.y = tileY;
		this.type = tileType;
		this.roof = null;
		this.roofType = 0;
		this.eventEnter = null;

    }
}

class MapDrawComponent extends Component{
    draw(ctx)
{
	if(ctx==null) { 
		return; 
	}
	this.mapTileData = new TileMap(scene1Map, 40, 40, 20, 20, 4)
	viewport.screen = 
	[document.getElementById('game').width,
		document.getElementById('game').height];

		this.mapTileData.buildMpaFromData(this.mapTileData.map, this.mapTileData.mapHeight, this.mapTileData.mapWidth);
	// mapTileData.addRoofs(roofList);

	mapTileData.map[((2 * mapW) + 2)].eventEnter = function(){
		console.log("Entered tile 2,2");}
	let currentFrameTime = Date.now();
	let timeElapsed = currentFrameTime - lastFrameTime;
	gameTime += Math.floor(timeElapsed * gameSpeeds[currentSpeed].mult)

	let sec = Math.floor(Date.now()/1000);
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

	let playerRoof1 = mapTileData.map[toIndex(
		player.tileFrom[0], player.tileFrom[1])].roof;
		
	let playerRoof2 = mapTileData.map[toIndex(
		player.tileTo[0], player.tileTo[1])].roof

	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, viewport.screen[0], viewport.screen[1]);


		for(let y = viewport.startTile[1]; y <= viewport.endTile[1]; ++y)
		{
			for(let x = viewport.startTile[0]; x <= viewport.endTile[0]; ++x)
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
}

class PlayerCharacter extends Component{
	constructor(name, max_hp, attack, defense, speed, 
		/*stress, special, player_actions */) {
        super()

		//stats (don't worry about stress and special, haven't used them for anything yet)
		//player actions also won't matter unless I can implement more than one character
        this.name			 = name
        this.max_hp			 = 10
        this.temp_max_hp 	 = max_hp
        this.temp_hp		 = max_hp
        this.attack			 = 10
        this.temp_attack	 = attack
        this.defense		 = 10
        this.temp_defense	 = defense
        this.speed			 = 10
        this.temp_speed 	 = speed
        //this.stress 		 = 10
        //this.special		 = 10
        //this.player_actions = []			//make a list of actions and then use an if statement to call the desired function
		//I'm going to omit this for now because there's only one player character I have prepared

		//starting position defaults
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
	processMovement(tile) {
		if (this.tileFrom[0] == this.tileTo[0] && 
			this.tileFrom[1] == this.tileTo[1]) 
		{ 
			return false; 
		}

		//controls movement speed using the delay of the type of tile you're on and the type you're moving to
		let moveSpeed = this.delayMove[tileTypes[
			mapTileData.map[toIndex(this.tileFrom[0], 
				this.tileFrom[1])].type].floor];

		if ((tile - this.timeMoved) >= moveSpeed) 
		{
			this.placeAt(this.tileTo[0], this.tileTo[1]);


			//if the tile you're moving to is associated with some sort of event, do that event
			if(mapTileData.map[toIndex(this.tileTo[0], this.tileTo[1])].eventEnter!=null)
			{
				mapTileData.map[toIndex(this.tileTo[0], this.tileTo[1])].eventEnter(this)
			}

			let tileFloor = tileTypes[mapTileData.map[toIndex(this.tileFrom[0], this.tileFrom[1])].type].floor;

			if(tileFloor == floorTypes.ice)
			{
				if(this.canMoveDirection(this.direction))
				{
					this.moveDirection(this.direction, tile);
				}
			}
			else if(tileFloor==floorTypes.conveyorL && this.canMoveLeft())
			{
				this.moveLeft(tile);
			}
			else if(tileFloor==floorTypes.conveyorR && this.canMoveRight())
			{
				this.moveRight(tile);
			}
			else if(tileFloor == floorTypes.conveyorU && this.canMoveUp())
			{
				this.moveUp(tile)
			}
			else if(tileFloor == floorTypes.conveyorD && this.canMoveDown())
			{
				this.moveDown(tile)
			}

		}

		else {
			this.position[0] = (this.tileFrom[0] * tileW) + ((tileW - this.dimensions[0]) / 2);
			this.position[1] = (this.tileFrom[1] * tileH) + ((tileH - this.dimensions[1]) / 2);

			if (this.tileTo[0] != this.tileFrom[0]) {
				//here's where it actually tells the game what speed to move
				let diff = (tileW / moveSpeed) * (tile - this.timeMoved);
				this.position[0] += (this.tileTo[0] < this.tileFrom[0] ? 0 - diff : diff);
			}
			if (this.tileTo[1] != this.tileFrom[1]) {
				let diff = (tileH / moveSpeed) * (tile - this.timeMoved);
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

	moveLeft(tile){
		this.tileTo[0] -= 1; 
		this.timeMoved = tile;
		this.direction = directions.left;
	}
	moveRight(tile) {
		this.tileTo[0] += 1;
		this.timeMoved = tile;
		this.direction = directions.right
	}
	moveUp(tile){
		this.tileTo[1] -= 1;
		this.timeMoved = tile;
		this.direction = directions.up
	}
	moveDown(tile){
		this.tileTo[1] += 1;
		this.timeMoved = tile;
		this.direction = directions.down
	}

	moveDirection(mapDimensions,tile){
		switch(mapDimensions){

		case directions.up:
			return this.moveUp(tile)
		case directions.down:
			return this.moveDown(tile)
		case directions.left:
			return this.moveLeft(tile);
		default:
			return this.moveRight(tile)

		}
	}

	player_Action(enemy){
		selection = 11
		while(selection > 3 || selection < 0){
			//fix this a little so I can have selection happen in GUI, 
			//but for now just set it up
			//end conditions will be set in each of the battles
			
			if(selection == 0){
				player_attack(enemy)
			}
			if(selection == 1){
				waltz()
			}
			if(selection == 2){
				rhapsody()
			}
			if(selection == 3){
				ballad()
			}
		}
	}

	waltz(){
		this.temp_speed += 5
		//print text to gui "Alex played an energizing waltz! Their speed increased!"
		return temp_speed
	}

	rhapsody(){
		this.temp_hp += 10
		if(this.temp_hp > this.temp_max_hp){
			this.temp_hp = this.temp_max_hp
		}
		//print(f"{character.name} played an invigorating rhapsody!")
		//print(f"{character.name} healed 10 HP!")
		//print(f"{character.name}'s current HP is {character.temp_hp}")
	
	}


}

class NpcComponent extends Component{
    name = "NPC"
    start() {
        this.npcX = 1004
        this.npcY= 657 
    }

    update(){

    }

    draw(ctx){
        ctx.fillStyle = "orange"
        ctx.beginPath()
        ctx.fillRect(this.npcX, this.npcY, 10, 10)
        ctx.fill()
    }
}


class TextBoxComponent extends Component{
    name = "textbox"
    start(){

    }

    update(){

    }

    draw(ctx){
        //need if statement to determine whether textbox appears at top or bottom of screen
        ctx.fillStyle = "white"
        ctx.fillRect(0,0, screen.width, 110)

        ctx.fillStyle ="blue"
        ctx.fillRect(10,10, screen.width-10, 90)

        ctx.fillStyle = "white"
        ctx.fillText("testing", 20, 20)

    }
}

class MainCameraComponent extends Component{
    start(){

    }
    update(){
        // this.transform.x = 75;
        //  this.transform.y = 75;
        //  this.transform.sx = 3;
        //  this.transform.sy = 3;
        this.transform.x = 50
    }
}

class MainControllerGameObject extends GameObject{
    start() {
        this.addComponent(new MainController())
    }
}

class MainController extends Component{
    start(){
        this.up = true
        
        let playerComponent = new PlayerCharacter();

        let playerGameObject = new GameObject("PlayerGameObject")
        playerComponent.addListener(this)
        playerGameObject.addComponent(playerComponent)

        GameObject.instantiate(playerGameObject)

}   

    handleUpdate(component, eventName){
        if(eventName == "0 HP"){
            SceneManager.changeScene(2)
        }

        this.freezeTime += Time.deltaTime
        if (keysDown["f"] && this.freezeTime >= this.maxFreezeTime){
            SceneManager.changeScene(2)

        

        } 
    }
}

class MainScene extends Scene{
    constructor() {
        super()
    }
    start() {
         this.map = this.addGameObject(new GameObject("TileMapGameObject").addComponent(
            new TileMap(scene1Map), new TileComponent(), new MapDrawComponent()))
         this.addGameObject(new MainControllerGameObject(new MainController()))
    }
}

//---------------------------------Game Over Scene-------------------------------

class EndController extends Component{
    start(){

    }
    update(){
        if (keysDown["f"]){
            SceneManager.changeScene(0)
        }
    }
}


class EndScene extends Scene {
    constructor() {
        super("blue")
    }
    start() {
        this.addGameObject(new GameObject("EndTextGameObject").addComponent(new Text("GAME OVER", "red")), new Vector2(-100, 20))
        this.addGameObject(new GameObject().addComponent(new EndController()))

    }
}


let startScene = new StartScene()
let mainScene = new MainScene()
let endScene = new EndScene()

window.allScenes = [startScene, mainScene, endScene]