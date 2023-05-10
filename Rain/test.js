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


class PointsComponent extends Component {
    name = "PointsComponent"
    start() {
        this.points = 0
    }
    handleUpdate(component, eventName) {
        
            this.points++;
            let persistentPointsComponent = GameObject
                .getObjectByName("PersistentPointsGameObject")
                .getComponent("PersistentPointsComponent")
            if (this.points > persistentPointsComponent.points) {
                persistentPointsComponent.updatePoints(this.points)
            }
        
    }
    update() {
        this.parent.getComponent("Text").string = "Game Points: " + this.points;
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
        

        
            //this.good = (this.playerX, this.playerY)
            //this.time +=1

//TODO COME BACK TO THIS WHAT TO DO ABOUT THE PLAYER
//ASK ABOUT COLLISION DETECTION <========> equation for circle (x-this.enemyX)^2 + (y-this.enemyY)^2 = 5^2
        // if (this.good == this.transform.x, this.transform.y){
        //     console.log("game over")
        //     this.score = this.time
        //     scene = 2
        // } 
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
            this.transform.x -= 5
        }
        else if (keysDown["ArrowRight"]) {
            this.transform.x += 5
        }
        if (keysDown["ArrowUp"]) {
            this.transform.y -= this.playerVY

        }
        if (keysDown["ArrowDown"] &! this.transform.y >= 300){
            this.transform.y += this.playerVY*.5
        }

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

class MainController extends Component {
    start() {
        camera.main.fillStyle = "gray"
            //Create new player object
            let playerGameObject = new GameObject("PlayerGameObject")
            let playerComponent = new PlayerComponent();
            playerComponent.addListener(this)
            playerComponent.addListener(GameObject.getObjectByName("PointsGameObject").getComponent("PointsComponent"))
            playerGameObject.addComponent(playerComponent)

            let circle = new Circle() 
            playerGameObject.addComponent(circle)
            circle.fillStyle = "blue"

            circle.transform.sx = 5
            circle.transform.x = -15 * i
            GameObject.instantiate(playerGameObject)

    }

    handleUpdate(component, eventName) {
        if (eventName == "Hit")  {
            //I don't think I need this, it checks the game over conditions for pong
            //however, I will need to put my own end conditions there and this can help me figure out how to do that.
            

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
    }
}

class MainScene extends Scene {
    constructor(){
        super("green")
    }
    //populate all of the game objects that will be present in the scene
    start(){
        let floorGameObject = this.addGameObject(new GameObject("floorGameObject"), new Vector2(0, 200)) 
        let floorRect = new Rectangle("purple", "purple", 10)
            floorGameObject.addComponent(floorRect)
        floorRect.transform.sx = 1000
        floorRect.transform.sy = 100

        let roofGameObject = this.addGameObject(new GameObject("floorGameObject"), new Vector2(0, -245)) 
        let roofRect = new Rectangle("purple", "purple", 10)
            roofGameObject.addComponent(roofRect)
        roofRect.transform.sx = 1000
        roofRect.transform.sy = 100
        // floorRect.transform.y = 165

        let leftWallGameObject = this.addGameObject(new GameObject("floorGameObject"), new Vector2(400, 0)) 
        let leftWallRect = new Rectangle("purple", "purple", 10)
        leftWallGameObject.addComponent(leftWallRect)
        leftWallRect.transform.sx = 100
        leftWallRect.transform.sy = 1000

        let rightWallGameObject = this.addGameObject(new GameObject("floorGameObject"), new Vector2(-400, 0)) 
        let rightWallRect = new Rectangle("purple", "purple", 10)
        rightWallGameObject.addComponent(rightWallRect)
        rightWallRect.transform.sx = 100
        rightWallRect.transform.sy = 1000

        let pointsObject = this.addGameObject(
            new GameObject("PointsGameObject")
                .addComponent(new PointsComponent())
                .addComponent( new Text("Time: 0")), new Vector2(-60, 180))
        
    for (let i = 0; i < 4; i++){
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
        badCircle.transform.x = -15 * i
        GameObject.instantiate(enemyGameObject)

    if(Time.frameCount % 1800 == 0 ){
        let randomEvent = Math.floor((Math.random()*10 + 1))
        //Camera move event
        if (randomEvent == 1){
            
        }
        //new ball
        if (randomEvent == 2|| randomEvent == 3){
            let enemyGameObject = new GameObject("Enemy1")
            let enemyComponent = new EnemyComponent()
            enemyComponent.addListener(this)
            enemyComponent.addListener(GameObject.getObjectByName("Enemy1"))
            enemyGameObject.addComponent(enemyComponent)
            enemyComponent.transform.x = Math.floor((Math.random()*300 + 1))    //starting position x
            //create the ball. Need to figure out how to assign which ball is player and which is enemy 
            let badCircle = new Circle() 
            enemyGameObject.addComponent(badCircle)
            badCircle.fillStyle = "red"
    
            badCircle.transform.sx = 5
            badCircle.transform.x = -15 * i
            GameObject.instantiate(enemyGameObject)
        }
        //rain + fake balls
        if (randomEvent == 4|| randomEvent == 5){
        //two new balls
        }
        if (randomEvent == 6|| randomEvent == 7){
            //rain
        }
        if (randomEvent == 8|| randomEvent == 9){
            //safe. Nothing happens  
        }
        if (randomEvent == 10){
    }
        
        

        this.addGameObject(new GameObject("ControllerGameObject").addComponent(new MainController()))
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
