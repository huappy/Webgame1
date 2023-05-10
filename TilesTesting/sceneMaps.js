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