let currentSecond = 0, frameCount = 0, framesLastSecond = 0, lastFrameTime = 0;

let gameTime = 0;
//hell yeah, dictionary. Also, this controls the speed at which the game runs
let gameSpeeds = [
    {name:'Normal', mult: 1},
    {name: 'Slow', mult: 0.3},
    {name: 'Fast', mult: 3},
    {name: 'Paused', mult: 0}
]

let currentSpeed = 0;


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


class TileMap extends Component{
    name = "TileMap"

    // Tile layout. Make a default so that it aint empty
    gameMap

    // Width of each tile
    tileWidth

    // Height of each tile
    tileHeight

    //.How many tiles wide is the map
    mapWidth

    // How many tiles tall is the map
    mapHeight

    

    /**
     * Create new instance of the class
     * @param {Array} gameMap
     * @param {Number} tileWidth
     * @param {Number} tileHeight
     * @param {Number} mapWidth
     * @param {Number} mapHeight
     */



    constructor(sceneMap = [
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
    ], 
        tileWidth = 40, tileHeight = 40,
        mapWidth = 20, mapHeight = 20){

        super()
        this.sceneMap = sceneMap;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.mapHeight = mapHeight;
        this.mapWidth = mapWidth;
        this.layers = 4 //if i figure out how to implement this, thatd be cool

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
                    this.map.push(new Tile(x, y, mapDimensions[((y * width) + x)]));
                }
            }
    
            return true;
        }
     }   

}