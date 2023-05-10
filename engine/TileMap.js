class TileMap extends Component{
	constructor() {
		this.map = [];		//a list of tiles in the map
		this.mapWidth = 0;
		this.mapHeight = 0;
		this.layers = 4		//how many layers are there available on this map?
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


class Tile extends Component {
	constructor(tileX, tileY, tileType) {
		this.x = tileX;
		this.y = tileY;
		this.type = tileType;
		this.roof = null;
		this.roofType = 0;
		this.eventEnter = null;

    }
}