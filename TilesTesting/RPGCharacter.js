class PlayerCharacter extends Component{
	constructor() {

		//stats
		this.health = 10;
		this.attack = 10
		this.defense = 10;
		this.speed = 10;

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

}