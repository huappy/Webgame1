import "/engine/engine.js"
//LOOK AT CLASS NOTES (the written ones) FOR WORLD --> SCREEN--> GUI TRANSLATION FOR MAKING TEXTBOXES
//also look at camera class for the code for camera transitions
//---------------------------------Start Scene-------------------------------

class PersistentPointsComponent extends Component {
    name = "PersistentPointsComponent"
    points = 0
    start() {
        // if(GameObject.getObjectByName("PersistentPointsGameObject") != this.parent){
        //     this.parent.destroy();
        //     console.log("Removing duplicate persistent points component");
        // }
        // else{
        //     console.log("Only one persistent points component. Move on.")
        // }
    }
    updatePoints(points) {
        this.points = points;
        document.cookie = this.points;
    }
}

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

class ScoreSetterComponent extends Component {
    name = "ScoreSetterComponent"
    start() {
        this.maxScoreComponent = this.parent.getComponent("Text");
    }
    update() {
        let persistentPointsGameObject = GameObject.getObjectByName("PersistentPointsGameObject");

        if (persistentPointsGameObject) {

            this.maxScoreComponent.string = "High Score: "

            let persistentPointsComponent = persistentPointsGameObject
                .getComponent("PersistentPointsComponent")

            this.maxScoreComponent.string += persistentPointsComponent.points
        }
    }
}

class StartCameraComponent extends Component {
    start() {

    }
    update() {
        this.parent.transform.x += 0;
    }
}


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
        this.addGameObject(new GameObject("StartConttrollerGameObject").addComponent(new StartController()))
        this.addGameObject(new GameObject("PersistentPointsGameObject").addComponent(new PersistentPointsComponent()))
        this.addGameObject(new GameObject("WelcomeToPongGameObject").addComponent(new Text("Rain", "blue")), new Vector2(-125, 20))
        this.addGameObject(new GameObject("MaxScoreGameObject").addComponent(new Text("", "white")).addComponent(new ScoreSetterComponent()), new Vector2(-125, 45))        

        Camera.main.parent.addComponent(new StartCameraComponent());
    
        }
    
}



//-------------------------------------------------------------------------------------------
//Main


class MainController extends Component {

    walls = [
            //floor
        {
           type: new Rectangle("gray", "gray", 10),
           size: new Vector2(0, 200),
           transform_sx: 1000,
           transform_sy: 100
        },

            //ceiling
        {
            type: new Rectangle("transparent", "transparent", 10),
            size: new Vector2(0, -245),
            transform_sx: 1000,
            transform_sy: 100
         },

            //left_wall
         {
            type: new Rectangle("gray", "gray", 10),
            size: new Vector2(400, 0),
            transform_sx: 100,
            transform_sy: 1000
         },
         
            //right_wall
         {
            type: new Rectangle("gray", "gray", 10),
            size: new Vector2(-400, 0),
            transform_sx: 100,
            transform_sy: 1000
         }
    ]

    start(ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);

        // Add three color stops
        gradient.addColorStop(0, "gray");
        gradient.addColorStop(.5, "#000066")

    
        Camera.main.fillStyle = gradient
        this.setGradient = true;
        this.score = 0;

        
        //Create new player object
        let playerGameObject = new GameObject("PlayerGameObject")
        let playerComponent = new PlayerComponent();
        playerComponent.addListener(this)

        playerGameObject.addComponent(playerComponent)

        let circle = new Circle() 
        playerGameObject.addComponent(circle)
        circle.fillStyle = "blue"

        circle.transform.sx = 5
        circle.transform.x = -15

        // let handleComponent = new HandlerComponent();
        // handleComponent.collider = circle
        // playerGameObject.addComponent(handleComponent)

        GameObject.instantiate(playerGameObject)


        let enemyGameObject = new GameObject("Enemy1")
        let enemyComponent = new EnemyComponent()
        enemyComponent.addListener(this)
        enemyComponent.addListener(GameObject.getObjectByName("Enemy1"))
        enemyGameObject.addComponent(enemyComponent)
        //create the ball. Need to figure out how to assign which ball is player and which is enemy 
        let badCircle = new Circle() 
        enemyGameObject.addComponent(badCircle)
        badCircle.fillStyle = "red"

        badCircle.transform.sx = 5
        badCircle.transform.x = -15
        GameObject.instantiate(enemyGameObject)

        // let handleComponent = new HandlerComponent();
        // handleComponent.collider = circle
        // enemyGameObject.addComponent(handleComponent)

        GameObject.instantiate(enemyGameObject)


        let collisionObject = GameObject.instantiate(new GameObject("PlayerColision"))

        let count = 0


        for(let wall of this.walls){
            let wallObject = new GameObject("Walls" + count)
            
            wallObject.addComponent(wall.type)
            wallObject.transform.x = wall.size.x
            wallObject.transform.y = wall.size.y
            wallObject.transform.sx = wall.transform_sx
            wallObject.transform.sy = wall.transform_sy
            
            // handleComponent = new HandlerComponent();
            // handleComponent.collider = wall.type
            // wallObject.addComponent(handleComponent)

            GameObject.instantiate(wallObject)

            count++
        }

        let pointsObject =
            new GameObject("PointsGameObject")
                .addComponent(new PointsComponent())
                .addComponent( new Text("Time: 0"))

        pointsObject.transform.x =-60
        pointsObject.transform.y = 180

            
            GameObject.instantiate(pointsObject)

        
    }

    handleUpdate(component, eventName) {
        if (eventName == "Hit")  {

            let playerGameObjects = GameObject.getObjectsByName("PlayerGameObject")
            let countLive = 0;
            for (let playerGameObject of playerGameObjects) {
                if (!playerGameObject.markedForDestroy) {
                    countLive++;
                }
            }

            if(countLive == 0) {
                SceneManager.changeScene(2)
            }
        }  

        // if (true) {
        //     this.time++;
        //     if (this.time >= 360)
        //         this.time = 0
        //         let enemyGameObject = new GameObject("Enemy")
        //         let enemyComponent = new EnemyComponent()
        //         enemyComponent.addListener(this)
        //         enemyComponent.addListener(GameObject.getObjectByName("Enemy1"))
        //         enemyGameObject.addComponent(enemyComponent)
        //         //create the ball. Need to figure out how to assign which ball is player and which is enemy 
        //         let badCircle = new Circle() 
        //         enemyGameObject.addComponent(badCircle)
        //         badCircle.fillStyle = "red"
        
        //         badCircle.transform.sx = 5
        //         badCircle.transform.x = -15 * i
        //         GameObject.instantiate(enemyGameObject)
    //}
}
update(){
    this.cooldown = false
    this.frameTime++
    if(this.frameTime %30 == 0){
        console.log("roll the dice")
        this.time++
        this.frameTime = 0
    }

    if(this.time %30 ==0 && this.cooldown == false){
        console.log("roll the dice")
        this.cooldown = true;
        randEvent = Math.floor(Math.random() * 10) + 1      //gets me random int between 1 and 10

        //This next part could be optimized. Do it if you have time.
        if(randEvent == 1){
            //add enemy
            console.log("enemy added")
            if(this.time %30 ==0){
                this.cooldown == true
                console.log("resume")
            }
        }
        else if(randEvent == 2){
            //shake the camera
            console.log("shake shake shake")
            if(this.time %30 ==0){
                this.cooldown == true
                console.log("resume")
            }
        }
        else if(randEvent == 3){
            //gui shenanigans
            console.log("fuck you, the gui is here")
            if(this.time %30 ==0){
                this.cooldown == true
                console.log("resume")
            }
        }
        else if( randEvent == 4 || randEvent == 5 || randEvent == 6){
            //rain
            console.log("it sure is raining")
            if(this.time %30 ==0){
                this.cooldown == true
                console.log("resume")
            }
        }
        else if(randEvent == 7 || randEvent == 8){
            //textbox event 
            //"Clear your mind of all distractions. 
            //Focus on the space between raindrops"
            console.log("Clear your mind of all distractions. Focus on the space between raindrops")
            if(this.time %30 ==0){
                this.cooldown == true
                console.log("resume")
            }
        }
        if(randEvent == 9){
            //you get a break this time
            console.log("out to lunch")
            if(this.time %30 ==0){
                this.cooldown == true
                console.log("resume")
            }
        }
        if(randEvent == 9){
            //Lucky! Destroy the one of the enemies
            console.log("lucky!")
            if(this.time %30 ==0){
                this.cooldown == true
                console.log("resume")
            }
        }

    }
}
}

class MainScene extends Scene {
    constructor(){
        super()
    }
    //populate all of the game objects that will be present in the scene
    start(){
        this.time = 0
        this.cooldown = false
        
        // let floorGameObject = new GameObject("floorGameObject")
        // let floorRect = new Rectangle("gray", "gray", 10)
        //     floorGameObject.addComponent(floorRect), new Vector2(0, 200)
        // floorRect.transform.sx = 1000
        // floorRect.transform.sy = 100
        // floorGameObject.addComponent(HandleComponent)

        // let roofGameObject = new GameObject("floorGameObject")
        // let roofRect = new Rectangle("transparent", "transparent", 10)
        //     roofGameObject.addComponent(roofRect), new Vector2(0, -245)
        // roofRect.transform.sx = 1000
        // roofRect.transform.sy = 100
        // roofGameObject.addComponent(HandleComponent)

        // let leftWallGameObject = new GameObject("floorGameObject") 
        // let leftWallRect = new Rectangle("gray", "gray", 10)
        // leftWallGameObject.addComponent(leftWallRect), new Vector2(400, 0)
        // leftWallRect.transform.sx = 100
        // leftWallRect.transform.sy = 1000
        // leftWallGameObject.addComponent(HandleComponent)

        // let rightWallGameObject = new GameObject("floorGameObject") 
        // let rightWallRect = new Rectangle("gray", "gray", 10)
        // rightWallGameObject.addComponent(rightWallRect), new Vector2(-400, 0)
        // rightWallRect.transform.sx = 100
        // rightWallRect.transform.sy = 1000
        // rightWallGameObject.addComponent(HandleComponent)

            this.addGameObject(new GameObject("ControllerGameObject").addComponent(new MainController()))
        
        }
        
    }


class PointsComponent extends Component {
    name = "PointsComponent"
    start() {
        this.points = 0
        this.frameTime = 0
    }
    // handleUpdate(component, eventName) {
        
    //         this.points++;
    //         let persistentPointsComponent = GameObject
    //             .getObjectByName("PersistentPointsGameObject")
    //             .getComponent("PersistentPointsComponent")
    //         if (this.points > persistentPointsComponent.points) {
    //             persistentPointsComponent.updatePoints(this.points)
    //         }
        
    //}
    update() {
        this.frameTime++
        if(this.frameTime %30 == 0){
            console.log("roll the dice")
            this.points++
            this.frameTime = 0
        }
        this.parent.getComponent("Text").string = "Raindrops Dodged: " + this.points;
    }

}


class EnemyComponent extends Component {
    name = "EnemyComponent"
    start() {
        //This tracks the starting position and velocity of the ball
        this.transform.x = 0     //starting position x
        this.transform.y = -100      //starting position y: Make these two semi-random. Make them spawn not within 100ish px of the player
        this.enemyVX = 5
        this.enemyVY = 5       //X and Y velocity. Change so that this is 
        //also need somethign to track time and create a new enemy every so often
    }
    update(){
        
        this.transform.x += this.enemyVX
        this.transform.y += this.enemyVY

        if (this.transform.x < -340) {
            this.enemyVX *= -1
        }
        if (this.transform.x > 340){
            this.enemyVX *= -1}

        if (this.transform.y < -180) {
            this.enemyVY *= -1
        }
        if (this.transform.y > 135)
            this.enemyVY *=-1
    
    }
}

class PlayerComponent extends Component {
    name = "PlayerComponent"
    start() {
        this.transform.x = 0
        this.transform.y = 0
        this.playerVY = 7.5
    }
    update() {
        if (this.transform.y >= 300) {
            
        }
        else if (this.transform.y <= 135 &! keysDown["ArrowUp"]){
            this.transform.y += this.playerVY
            this.playerVY = 7.5
        }

        if (keysDown["ArrowLeft"]) {  
            if (this.transform.x > -340) {
                this.transform.x -= 5
            }
        }
        else if (keysDown["ArrowRight"]) {
            if (this.transform.x < 340){
            this.transform.x += 5
            }
        }
        if (keysDown["ArrowUp"]) {
            if (this.transform.y > -185){
            this.transform.y -= this.playerVY
            }
        }
        if (keysDown["ArrowDown"] &! this.transform.y >= 300){
            this.transform.y += this.playerVY*.5
        }

        //TODO: IF COLLISION WITH ENEMY
        //this.parent.destroy
        //this.updateListeners("Hit")

    }

}


class MainCameraComponent extends Component {
    start(){

    }
    update(){
        // this.transform.x = 75;
        // this.transform.y = 75;
        // this.transform.sx = 3;
        // this.transform.sy = 3;
        // this.transform.x = 50;
    }
}


class CollisionComponent extends Component{
//Look for collisions
    static componentNames = [
        "Rectangle",
        "Circle",
        "Point"
    ]

    static handle(one, two) {
        //what kind of collision?
        let typeOne = "None";
        let typeTwo = "None";
        let componentOne;
        let componentTwo;

        for(let name of CollisionComponent.componentNames){
            componentOne = one.getComponent(name);
            if(componentOne) {
                typeOne = name;
                break;
            }
        }

        if (typeOne =="None"){
            return;
        }

        for (let name of CollisionComponent.componentNames){
            componentTwo = two.getComponent(name)
            if (componentTwo){
                typeTwo = name;
                break;
            }
        }

        if (typeOne == "Point" && typeTwo == "Point"){
            return false;
        }
        if (typeOne == "Point" && typeTwo == "Circle"){
            return CollisionComponent.handlePointCircle(componentOne, componentTwo)
        }
        if (typeOne == "Point" && typeTwo == "Rectangle"){
            return CollisionComponent.handlePointRect(componentOne, componentTwo)   
        }
        if (typeOne == "Circle" && typeTwo == "Point"){
            //flip
            return CollisionComponent.handlePointCircle(componentTwo, componentOne)
        }
        if (typeOne == "Circle" && typeTwo == "Circle"){
            return CollisionComponent.handleCirlceCircle(componentOne, componentTwo)
        }
        if (typeOne == "Circle" && typeTwo == "Rectangle"){
            return CollisionComponent.handleCircleRect(componentOne, componentTwo)
        }
        if (typeOne == "Rectangle" && typeTwo == "Point"){
            //flip
            return CollisionComponent.handlePointRect(componentTwo, componentOne)
        }
        if (typeOne == "Rectangle" && typeTwo == "Circle"){
            //flip
            return CollisionComponent.handleCircleRect(componentTwo, componentOne)
        }
        if (typeOne == "Rectangle" && typeTwo == "Rectangle"){
            return CollisionComponent.handleRectRect(componentOne, componentTwo)
        }
    }

    static handlePointCircle(one, two) {
        let distance = Math.sqrt((one.transform.x - two.transform.x) ** 2 + (one.transform.y - two.transform.y) ** 2)
        return distance <= two.transform.sx;
      }
      static handlePointRect(one, two) {
        let x = one.transform.x;
        let y = one.transform.y;
        let left = two.transform.x - two.transform.sx / 2;
        let right = two.transform.x + two.transform.sx / 2;
        let bottom = two.transform.y - two.transform.sy / 2;
        let top = two.transform.y + two.transform.sy / 2;
    
        return x > left && x < right && y > bottom && y < top;
      }
      static handleCircleCircle(one, two) {
        let distance = Math.sqrt((one.transform.x - two.transform.x) ** 2 + (one.transform.y - two.transform.y) ** 2)
        return distance <= one.transform.sx + two.transform.sx;
      }
      static handleCircleRect(one, two) {
    
        let lineBetweenCenters = { AB: null, C: null, distance:0 };
        let centerCircle = new Vector2(one.transform.x, one.transform.y);
        let centerRectangle = new Vector2(two.transform.x, two.transform.y);
        lineBetweenCenters.AB = centerCircle.minus(centerRectangle).normalize();
      
        lineBetweenCenters.C = -lineBetweenCenters.AB.dot(centerCircle)
        lineBetweenCenters.distance = centerCircle.minus(centerRectangle).length();
    
        let r1 = centerCircle.add(lineBetweenCenters.AB.scale(one.transform.sx))
        let r2 = centerCircle.add(lineBetweenCenters.AB.scale(-one.transform.sx))
    
        let corner1 = new Vector2(two.transform.sx/2, two.transform.sy/2);
        let corner2 = new Vector2(-two.transform.sx/2, two.transform.sy/2);
        let corner3 = new Vector2(-two.transform.sx/2, -two.transform.sy/2);
        let corner4 = new Vector2(two.transform.sx/2, -two.transform.sy/2);
    
        let dot1 = corner1.dot(lineBetweenCenters.AB)+lineBetweenCenters.distance
        let dot2 = corner2.dot(lineBetweenCenters.AB)+lineBetweenCenters.distance
        let dot3 = corner3.dot(lineBetweenCenters.AB)+lineBetweenCenters.distance
        let dot4 = corner4.dot(lineBetweenCenters.AB)+lineBetweenCenters.distance
        let dots = [dot1,dot2, dot3, dot4];
        let rs = [one.transform.sx, -one.transform.sx];
        for(let dot of dots){
          if(dot < one.transform.sx)
          return true
        }
        return false;
    
    
        // let possibleLines = [];
    
        // let left = two.transform.x - two.transform.sx / 2;
        // let right = two.transform.x + two.transform.sx / 2;
        // let bottom = two.transform.y - two.transform.sy / 2;
        // let top = two.transform.y + two.transform.sy / 2;
    
        // if (one.transform.x < left) {
        //   let one = new Vector2(left, bottom);
        //   let two = new Vector2(left, top);
        //   let AB = one.minus(two).normalize().perpendicular()
        //   let C = -AB.dot(one);
        //   possibleLines.push({ AB, C })
        // }
        // if (one.transform.x > right) {
        //   let one = new Vector2(right, bottom);
        //   let two = new Vector2(right, top);
        //   let AB = one.minus(two).normalize().perpendicular()
        //   let C = -AB.dot(one);
        //   possibleLines.push({ AB, C })
    
        // }
        // if (one.transform.y < bottom) {
        //   let one = new Vector2(left, bottom);
        //   let two = new Vector2(right, bottom);
        //   let AB = one.minus(two).normalize().perpendicular()
        //   let C = -AB.dot(one);
        //   possibleLines.push({ AB, C })
        // }
        // if (one.transform.y > top) {
        //   let one = new Vector2(left, top);
        //   let two = new Vector2(right, top);
        //   let AB = one.minus(two).normalize().perpendicular()
        //   let C = -AB.dot(one);
        //   possibleLines.push({ AB, C })
        // }
    
        // if (possibleLines.length == 0) {
        //   return true
        // }
    
        // if (one.transform.x < 24.7) {
        //   let noop;
        //   console.log("Hi")
        // }
    
        // //Go through the possible lines and respond accordingly
        // let distances = [];
    
        // for (let line of possibleLines) {
        //   let distance = line.AB.dot(new Vector2(one.transform.x, one.transform.y)) + line.C;
        //   distances.push(distance);
        // }
    
        // let maxDistance = Math.max(...distances.map(x => Math.abs(x)));
        // if (maxDistance < one.transform.sx) {
        //   return true;
        // }
        // return false;
    
    
    
      }
      static handleRectRect(one, two) {
        let left1 = one.transform.x - one.transform.sx / 2;
        let right1 = one.transform.x + one.transform.sx / 2;
        let bottom1 = one.transform.y - one.transform.sy / 2
        let top1 = one.transform.y + one.transform.sy / 2
    
        let left2 = two.transform.x - two.transform.sx / 2;
        let right2 = two.transform.x + two.transform.sx / 2;
        let bottom2 = two.transform.y - two.transform.sy / 2
        let top2 = two.transform.y + two.transform.sy / 2
    
        return !(left1 > right2 || left2 > right1
          || right1 < left2 || right2 < left1
          || bottom1 > top2 || bottom2 > top1
          || top1 < bottom2 || top2 < bottom1)
    
      }
    }
    

class HandlerComponent extends Component{
    collider
    start(){
        this.controller = GameObject.getObjectByName("ControllerGameObject").getComponent("MainController")
        this.originalVelocity= this.collider.vy
    }

    update(){
    for (let i = 0; i < this.controller.walls.length; i++) {
        let gameObject = GameObject.getObjectByName("Walls" + i);
  
        
        if (CollisionComponent.handle(this.parent, gameObject)) {
            this.collider.vy = 0
            break
        }
        else {
          //Otherwise, return to the normal color
          this.collider.vy = originalVelocity
        }
      }
    }
}





//____________________________________________________END_______________________________________

class EndController extends Component {
    update() {
        if (keysDown["f"]){
            SceneManager.changeScene(0)
        }
    }
}

class EndScene extends Scene{
    constructor(){
        super("Black")
    }
    start(){
        this.addGameObject(new GameObject().addComponent(new EndController()))
        this.addGameObject(new GameObject().addComponent(new Text("You Lost", "red")), new Vector2(15, 20))
        this.addGameOject(new GameObject("MaxPointsGameObject")
            .addComponent(new ScoreSetterComponent())
            .addComponent(new Text("", "red")),
            new Vector2(15, 37))
    }
}

let startScene = new StartScene()
let mainScene = new MainScene()
let endScene = new EndScene()

window.allScenes = [startScene, mainScene, endScene]
