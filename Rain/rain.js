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

class StartController extends Component {
    start() {
        this.freezeTime = 0
        this.maxFreezeTime = 1
        GameObject.getObjectByName("PersistentPointsGameObject").doNotDestroyOnLoad()

    }
    update() {
        this.freezeTime += Time.deltaTime
        if (keysDown["a"] && this.freezeTime >= this.maxFreezeTime) {
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

            this.maxScoreComponent.string = "Max Score: "

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
        // this.parent.transform.sx = 10;
        // this.parent.transform.sy = 10;
    }
}

// class StartScene extends Scene {
//     constructor() {
//         super("black")
//     }
//     start() {
//         this.addGameObject(new GameObject("StartConttrollerGameObject").addComponent(new StartController()))
//         this.addGameObject(new GameObject("PersistentPointsGameObject").addComponent(new PersistentPointsComponent()))
//         this.addGameObject(new GameObject("WelcomeToPongGameObject").addComponent(new Text("Welcome to Pong", "white")), new Vector2(-125, 20))
//         this.addGameObject(new GameObject("MaxScoreGameObject").addComponent(new Text("", "white")).addComponent(new ScoreSetterComponent()), new Vector2(-125, 45))
//         Camera.main.parent.addComponent(new StartCameraComponent());
//     }
// }



class StartScene extends Scene {
    constructor(){
        super("gray")
    }    
    start() {
        this.addGameObject(new GameObject("StartConttrollerGameObject").addComponent(new StartController()))
        this.addGameObject(new GameObject("PersistentPointsGameObject").addComponent(new PersistentPointsComponent()))
        this.addGameObject(new GameObject("WelcomeToPongGameObject").addComponent(new Text("Rain", "blue")), new Vector2(-125, 20))
        this.addGameObject(new GameObject("MaxScoreGameObject").addComponent(new Text("text", "white")).addComponent(new ScoreSetterComponent()), new Vector2(-125, 45))        

        Camera.main.parent.addComponent(new StartCameraComponent());
        
    
        }
    
}



//-------------------------------------------------------------------------------------------
//Main


class MainController extends Component {
    name = "MainController"
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

    rain = [
        {
            type: new Circle()
        }
    ]

    start(ctx) {

        this.enemyCount = 0
        this.frameTime = 0
        this.time = 0
        this.direction = 0
        this.counter = 0
        this.raindrops = 0
        this.randEvent = 0
        this.cooldown = false
        this.stop = false

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
        playerGameObject.addComponent(new PlayerHandlerComponent())


        let circle = new Circle() 
        playerGameObject.addComponent(circle)
        circle.fillStyle = "blue"

        circle.transform.sx = 5
        circle.transform.x = -15

        // let handleComponent = new HandlerComponent();
        // handleComponent.collider = circle
        // playerGameObject.addComponent(handleComponent)

        GameObject.instantiate(playerGameObject)


        this.enemyGameObject = new GameObject("Enemy0")
        this.enemyComponent = new EnemyComponent()
        this.enemyComponent.addListener(this)
        this.enemyComponent.addListener(GameObject.getObjectByName("Enemy0"))
        this.enemyGameObject.addComponent(this.enemyComponent)
        //create the ball. Need to figure out how to assign which ball is player and which is enemy 
        this.badCircle = new Circle() 
        this.enemyGameObject.addComponent(this.badCircle)
        this.badCircle.fillStyle = "red"

        this.badCircle.transform.sx = 5
        this.badCircle.transform.x = -15
        GameObject.instantiate(this.enemyGameObject)

        // let handleComponent = new HandlerComponent();
        // handleComponent.collider = circle
        // enemyGameObject.addComponent(handleComponent)





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
                .addComponent( new GUITextCentered("Time: 0"))

        pointsObject.transform.x = 340
        pointsObject.transform.y = 365
        this.originalX = pointsObject.transform.x
        this.originalY = pointsObject.transform.y

            
            GameObject.instantiate(pointsObject)
            // Camera.main.transform.x +=10

            this.cameraOriginX = Camera.main.transform.x
            this.cameraOriginY = Camera.main.transform.y
        



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
    this.frameTime++
    if (keysDown["v"]){
        SceneManager.changeScene(2)
    }

    if(this.frameTime %30 == 0){
        // console.log("roll the dice")
        this.time++
        this.frameTime = 0

        
    
    if(this.time % 10 == 0 && this.cooldown != true && this.time != 0){
        console.log("roll the dice")
        this.cooldown = true;
        this.randEvent = Math.floor(Math.random() * 10) + 1      //gets me random int between 1 and 10

    }  
   }   //This next part could be optimized. Do it if you have time.   
        
   
        if(this.randEvent == 1 || this.randEvent == 5){
            //DONE
            console.log("add enemy")
            
            this.cooldown == true
            let randEvent2 = Math.floor(Math.random() * 4) + 1 
            if (randEvent2 == 1){
                this.offsetVX = Math.floor(Math.random() * 5) + 1      //gets me random int between 1 and 10
                this.offsetVY = Math.floor(Math.random() * 5) + 1 
            }
            if (randEvent2 == 2){
                this.offsetVX = -(Math.floor(Math.random() * 5) + 1)     //gets me random int between 1 and 10
                this.offsetVY = Math.floor(Math.random() * 5) + 1 
            }
            if (randEvent2 == 3){
                this.offsetVX = Math.floor(Math.random() * 5) + 1      //gets me random int between 1 and 10
                this.offsetVY = -(Math.floor(Math.random() * 5) + 1)
            }
            if (randEvent2 == 4){
                this.offsetVX = -(Math.floor(Math.random() * 5) + 1)      //gets me random int between 1 and 10
                this.offsetVY = -(Math.floor(Math.random() * 5) + 1)
            }

            this.enemyCount++
            this.randEvent = 0
            this.cooldown == true
            let offset = Math.floor(Math.random() * 10) + 1      //gets me random int between 1 and 10
            //change GameObject(name) so that all of the enemies are not linked to the same object
            this.enemyCount++
          
            let enemyGameObject = new GameObject("Enemy")
            let enemyComponent = new EnemyComponent()
            enemyComponent.addListener(this)
            enemyComponent.addListener(enemyGameObject)
            enemyGameObject.addComponent(enemyComponent, this.handle)
            //create the ball. Need to figure out how to assign which ball is player and which is enemy 
            let badCircle = new Circle() 
            enemyGameObject.addComponent(badCircle)
            badCircle.fillStyle = "red"
            //figure out why it always appears at the same place
            badCircle.transform.sx = 7.5 
            badCircle.transform.x = -30 * offset
            GameObject.instantiate(enemyGameObject)

            if(this.time %15 ==0 && !this.time ==0){
                this.randEvent = 0
                this.cooldown = false
                this.stop = false
                this.direction = 0
                console.log("resume")
    
            }
            

        }
        else if(this.randEvent == 2 || this.randEvent == 8 ){

            //DONE
            //shake the camera
            console.log("shake shake shake")
            this.cooldown == true
            if (this.stop == false){

            
                if(this.distance < 4){
                    Camera.main.transform.x += 5
                    this.distance++
                }
                else if(this.distance < 12 && this.distance >=4 ){
                    Camera.main.transform.x -= 5
                    this.distance++
                }
                else if(this.distance < 20 && this.distance >=12 ){
                    Camera.main.transform.x +=5
                    this.distance++
                }
                else if(this.distance < 28 && this.distance >=20 ){
                    Camera.main.transform.y +=5
                    this.distance++
                }
                else if(this.distance < 36 && this.distance >=28 ){
                    Camera.main.transform.y -= 5
                    this.distance++
                }
                else if(this.distance < 44 && this.distance >=26 ){
                    Camera.main.transform.y += 5
                    this.distance++
                    this.counter ++
                }
                else if (this.counter < 3){
                    this.distance = 0
                }
                else {
                    if (Camera.main.transform.x > this.cameraOriginX){
                        Camera.main.transform.x -= 5
                    }
                    else if (Camera.main.transform.x < this.cameraOriginX){
                        Camera.main.transform.x += 5
                    }
                    if (Camera.main.transform.y > this.cameraOriginY){
                        Camera.main.transform.y -= 5
                    }
                    else if (Camera.main.transform.y < this.cameraOriginY){
                        Camera.main.transform.y += 5
                    }
                    if(Camera.main.transform.x == this.cameraOriginX
                        && Camera.main.transform.y == this.cameraOriginY){
                            this.stop = true
                            this.distance = 0
                            this.counter = 0
                            this.randEvent = 0
                            this.cooldown = false
                        }

                }


            }
            else {
                this.randEvent = 0
            }

    
            }
        

        else if(this.randEvent == 3 || this.randEvent == 9){
            //gui shenanigans
            //DONE
            this.cooldown == true
            if(this.stop == false){
                let pointsObject = GameObject.getObjectByName("PointsGameObject")
                console.log("fuck you, the gui is here")
                
                if(this.direction < 100){
                    pointsObject.transform.y -=2
                    this.direction++
                }
                else if (this.direction >= 100 && this.direction < 200){
                    pointsObject.transform.x -=2
                    this.direction++
                }
                else if (this.direction >= 200 && this.direction < 300){
                    pointsObject.transform.x += 2
                    pointsObject.transform.y -= 2
                    this.direction++
                }
                else if (this.direction >= 300 && this.direction < 400){
                    pointsObject.transform.x += 2
                    pointsObject.transform.y += 2
                    this.direction++
                }
                else if (this.direction >= 400 && this.direction < 500){
                    pointsObject.transform.x += 2
                    pointsObject.transform.y -= 2
                    this.direction++
                }
                else if (this.direction >= 500 && this.direction < 600){
                    pointsObject.transform.x -= 2
                    pointsObject.transform.y -= 2
                    this.direction++
                }
                else{
                    if (pointsObject.transform.x > this.originalX){
                        pointsObject.transform.x--
                    }
                    else if (pointsObject.transform.x < this.originalX){
                        pointsObjectt.transform.x++
                    }
                    if (pointsObject.transform.y < this.originalY){
                        pointsObject.transform.y++
                    }
                    else if (pointsObject.transform.y < this.originalY){
                        pointsObject.transform.y++
                    }
                    if(pointsObject.transform.x == this.originalX
                        && pointsObject.transform.y == this.originalY){
                            this.stop = true
                            this.distance = 0
                            this.counter = 0
                            this.randEvent = 0
                            this.cooldown = false
                        }
                    }
            

            }
            else{
                this.randEvent = 0
            }

        }

        else if(this.randEvent == 4){
            //DONE
            console.log("these are some strange meteorites")
            
            this.cooldown == true
            let randEvent2 = Math.floor(Math.random() * 4) + 1 
            if (randEvent2 == 1){
                this.offsetVX = Math.floor(Math.random() * 5) + 1      //gets me random int between 1 and 10
                this.offsetVY = Math.floor(Math.random() * 5) + 1 
            }
            if (randEvent2 == 2){
                this.offsetVX = -(Math.floor(Math.random() * 5) + 1)     //gets me random int between 1 and 10
                this.offsetVY = Math.floor(Math.random() * 5) + 1 
            }
            if (randEvent2 == 3){
                this.offsetVX = Math.floor(Math.random() * 5) + 1      //gets me random int between 1 and 10
                this.offsetVY = -(Math.floor(Math.random() * 5) + 1)
            }
            if (randEvent2 == 4){
                this.offsetVX = -(Math.floor(Math.random() * 5) + 1)      //gets me random int between 1 and 10
                this.offsetVY = -(Math.floor(Math.random() * 5) + 1)
            }

            this.enemyCount++
            this.randEvent = 0
            this.cooldown == true
            let offset = Math.floor(Math.random() * 10) + 1      //gets me random int between 1 and 10
            //change GameObject(name) so that all of the enemies are not linked to the same object
            this.enemyCount++
          
            let enemyGameObject = new GameObject("Faker")
            let enemyComponent = new EnemyComponent()
            enemyComponent.addListener(this)
            enemyComponent.addListener(enemyGameObject)
            //enemyGameObject.addComponent(enemyComponent.handle)
            //create the ball. Need to figure out how to assign which ball is player and which is enemy 
            let badCircle = new Circle() 
            enemyGameObject.addComponent(badCircle)
            badCircle.fillStyle = "pink"
            //figure out why it always appears at the same place
            badCircle.transform.sx = 5 
            enemyGameObject.transform.x = -30 * offset
            enemyGameObject.layer = -1
            GameObject.instantiate(enemyGameObject)

            if(this.time %15 ==0 && !this.time ==0){
                this.randEvent = 0
                this.cooldown = false
                this.stop = false
                this.direction = 0
                console.log("resume")
    
            }
            

        }
         
        
        else if(this.randEvent == 6){
            //DONE
            console.log("ummmmm")
            
            this.cooldown == true
            let randEvent2 = Math.floor(Math.random() * 4) + 1 
            if (randEvent2 == 1){
                this.offsetVX = Math.floor(Math.random() * 5) + 1      //gets me random int between 1 and 10
                this.offsetVY = Math.floor(Math.random() * 5) + 1 
            }
            if (randEvent2 == 2){
                this.offsetVX = -(Math.floor(Math.random() * 5) + 1)     //gets me random int between 1 and 10
                this.offsetVY = Math.floor(Math.random() * 5) + 1 
            }
            if (randEvent2 == 3){
                this.offsetVX = Math.floor(Math.random() * 5) + 1      //gets me random int between 1 and 10
                this.offsetVY = -(Math.floor(Math.random() * 5) + 1)
            }
            if (randEvent2 == 4){
                this.offsetVX = -(Math.floor(Math.random() * 5) + 1)      //gets me random int between 1 and 10
                this.offsetVY = -(Math.floor(Math.random() * 5) + 1)
            }

            this.enemyCount++
            this.randEvent = 0
            this.cooldown == true
            let offset = Math.floor(Math.random() * 10) + 1      //gets me random int between 1 and 10
            //change GameObject(name) so that all of the enemies are not linked to the same object
            this.enemyCount++
          
            let enemyGameObject = new GameObject("Faker")
            let enemyComponent = new EnemyComponent()
            enemyComponent.addListener(this)
            enemyComponent.addListener(enemyGameObject)
            enemyGameObject.addComponent(enemyComponent)
            //create the ball. Need to figure out how to assign which ball is player and which is enemy 
            let badCircle = new Circle() 
            enemyGameObject.addComponent(badCircle)
            badCircle.fillStyle = "pink"
            //figure out why it always appears at the same place
            badCircle.transform.sx = 10 
            enemyGameObject.transform.x = -30 * offset
            enemyGameObject.layer = -1
            GameObject.instantiate(enemyGameObject)

            if(this.time %15 ==0 && !this.time ==0){
                this.randEvent = 0
                this.cooldown = false
                this.stop = false
                this.direction = 0
                console.log("resume")
    
            }
            

        }
        
        else if(this.randEvent == 7){
            console.log("oh jeez")
            this.enemyCount++
            this.randEvent = 0
            this.cooldown == true
            let offset = Math.floor(Math.random() * 10) + 1      //gets me random int between 1 and 10
            //change GameObject(name) so that all of the enemies are not linked to the same object
            this.enemyCount++
          
            let enemyGameObject = new GameObject("Enemy")
            let enemyComponent = new EnemyComponent()
            enemyComponent.addListener(this)
            enemyComponent.addListener(enemyGameObject)
            enemyGameObject.addComponent(enemyComponent)
            //create the ball. Need to figure out how to assign which ball is player and which is enemy 
            let badCircle = new Circle() 
            enemyGameObject.addComponent(badCircle)
            badCircle.fillStyle = "red"
            //figure out why it always appears at the same place
            badCircle.transform.sx = 10 
            badCircle.transform.x = -30 * offset
            GameObject.instantiate(enemyGameObject)

        }


        else if(this.randEvent == 8){
            //DONE
            //you get a break this time
            this.cooldown == true
            this.randEvent = 0
            console.log("out to lunch")

        
        }
        else if(this.randEvent == 10){
            //DONE
            //Lucky! Destroy the one of the enemies
            this.cooldown == true
            this.randEvent = 0          //dont let it happen more than once
            let enemyGameObjects = GameObject.getObjectsByName("Enemy")
            let livingEnemies = 0
            for( let enemyGameObject of enemyGameObjects){
                if(!enemyGameObject.markedForDestroy){
                    livingEnemies++
                }
            }
            if(livingEnemies > 2){
                GameObject.getObjectByName("Enemy").destroy()
            }
            else{
                console.log("too few")
            }
            console.log("lucky!")
    
            
            
        }
        if(this.time %15 ==0 && !this.time ==0 && this.randEvent == 0){
            this.cooldown = false
            this.stop = false
            this.direction = 0
            console.log("resume")

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
        this.addGameObject(new GameObject("MaxPointsGameObject")
            .addComponent(new ScoreSetterComponent())
            .addComponent(new Text("", "red")),
            new Vector2(15, 37))

            this.addGameObject(new GameObject("ControllerGameObject").addComponent(new MainController()))
        
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
    
            // if (true) {
            //     this.time++;
            //     if (this.time >= 360)
            //         this.time = 0

    }
    }


class PointsComponent extends Component {
    name = "PointsComponent"
    start() {
        this.points = 0
        this.frameTime = 0
    }
    handleUpdate(component, eventName) {
        
            this.points++;

        
    }
    update() {
        this.frameTime++
        if(this.frameTime %30 == 0){
            this.points++
            this.frameTime = 0
        }
        this.parent.getComponent("GUIText").string = "Meteors Dodged: " + this.points;
        let persistentPointsComponent =GameObject.getObjectByName("PersistentPointsGameObject")
        .getComponent("PersistentPointsComponent")
    if (this.points > persistentPointsComponent.points) {
        persistentPointsComponent.updatePoints(this.points)
    }
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
            return CollisionComponent.handleCircleCircle(componentOne, componentTwo)
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


        let lineBetweenCenters = {AB: null, C: null, distance: 0 }
        let centerCircle = new Vector2(one.transform.x, one.transform.y)
        let centerRectangle = new Vector2(two.transform.x, two.transform.y)
        lineBetweenCenters.AB = centerCircle.minus(centerRectangle).normalize();
        let tempA = lineBetweenCenters.AB.x;
        let tempB = lineBetweenCenters.AB.y;
        lineBetweenCenters.AB.x = tempB;
        lineBetweenCenters.AB.y = -tempA

        lineBetweenCenters.C = -lineBetweenCenters.AB.dot(centerCircle)
        lineBetweenCenters.distance = centerCircle.minus(centerRectangle).length();

        let r1 = centerCircle.add(lineBetweenCenters.AB.scale(one.transform.sx))
        let r2 = centerCircle.add(lineBetweenCenters.AB.scale(-one.transform.sx))

        let corner1 = new Vector2(two.transform.sx/2, two.transform.sy/2)
        let corner2 = new Vector2(-two.transform.sx/2, two.transform.sy/2)
        let corner3 = new Vector2(-two.transform.sx/2, -two.transform.sy/2)
        let corner4 = new Vector2(two.transform.sx/2. -two.transform.sy/2)

        let dot1 = corner1.dot(lineBetweenCenters.AB + lineBetweenCenters.distance)
        let dot2 = corner2.dot(lineBetweenCenters.AB + lineBetweenCenters.distance)
        let dot3 = corner3.dot(lineBetweenCenters.AB + lineBetweenCenters.distance)
        let dot4 = corner4.dot(lineBetweenCenters.AB + lineBetweenCenters.distance)

        let dots = [dot1, dot2, dot3, dot4]
        let rs = [one.transform.sx, -one.transform.sx]
        for(let dot of dots){
            if(dot < one.transform.sx)
            return true
        }
        return false

    
        // let lineBetweenCenters = { AB: null, C: null, distance:0 };
        // let centerCircle = new Vector2(one.transform.x, one.transform.y);
        // let centerRectangle = new Vector2(two.transform.x, two.transform.y);
        // lineBetweenCenters.AB = centerCircle.minus(centerRectangle).normalize();
      
        // lineBetweenCenters.C = -lineBetweenCenters.AB.dot(centerCircle)
        // lineBetweenCenters.distance = centerCircle.minus(centerRectangle).length();
    
        // let r1 = centerCircle.add(lineBetweenCenters.AB.scale(one.transform.sx))
        // let r2 = centerCircle.add(lineBetweenCenters.AB.scale(-one.transform.sx))
    
        // let corner1 = new Vector2(two.transform.sx/2, two.transform.sy/2);
        // let corner2 = new Vector2(-two.transform.sx/2, two.transform.sy/2);
        // let corner3 = new Vector2(-two.transform.sx/2, -two.transform.sy/2);
        // let corner4 = new Vector2(two.transform.sx/2, -two.transform.sy/2);
    
        // let dot1 = corner1.dot(lineBetweenCenters.AB)+lineBetweenCenters.distance
        // let dot2 = corner2.dot(lineBetweenCenters.AB)+lineBetweenCenters.distance
        // let dot3 = corner3.dot(lineBetweenCenters.AB)+lineBetweenCenters.distance
        // let dot4 = corner4.dot(lineBetweenCenters.AB)+lineBetweenCenters.distance
        // let dots = [dot1,dot2, dot3, dot4];
        // let rs = [one.transform.sx, -one.transform.sx];
        // for(let dot of dots){
        //   if(dot < one.transform.sx)
        //   return true
        // }
        // return false;
    
    
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
    

class PlayerHandlerComponent extends Component{
    start(){
        this.controller = GameObject.getObjectByName("ControllerGameObject").getComponent("MainController")
        let enemyGameObjects = GameObject.getObjectsByName("Enemy")
    }

    update(){
        let enemyGameObjects = GameObject.getObjectsByName("Enemy")
        for( let enemyGameObject of enemyGameObjects){
            if(CollisionComponent.handle(this.parent, enemyGameObject)){
                this.parent.destroy()
                break
            }
            }
        }

        
        // if (CollisionComponent.handle(this.parent, gameObject) && gameObject.name == "Wall1") {
        //     this.collider.vy = 0
        //     break
        // }
        // else {
        //   //Otherwise, return to the normal color
        //   this.collider.vy = originalVelocity
        // }
    }
        

    // class EnemyHandlerComponent extends Component{
    //     wall
    //     start(){
    //         this.controller = GameObject.getObjectByName("ControllerGameObject").getComponent("MainController")
    //         this.originalVelocity= this.collider.vy
    //     }
    
    //     update(){
    //         for(let i = 0; i < this.controller.walls.length){
    
    //         }
            
    //         if (CollisionComponent.handle(this.parent.name = "Circle", gameObject = "PlayerGameObject")) {
    //             this.collider.vy = 0
    //             break
    //         }
    //         else {
    //           //Otherwise, return to the normal color
    //           this.collider.vy = originalVelocity
    
    //     enemies = getObjectByName("Enemy")
    //     this.scene =sceneManager.getActiveScene() 
    //     for(gameObject in this.scene.GameObjects){
    //         if (CollisionComponent.handle(this.parent, gameObject) && this.parent != gameObject){
    //             console.log(this.parent +", " + gameObject)
    //     }
            
    //       }
    //      }
    // }
    //     }






//____________________________________________________END_______________________________________

class EndController extends Component {
    update() {
        if (keysDown["v"]){
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
        this.addGameObject(new GameObject("MaxPointsGameObject")
            .addComponent(new ScoreSetterComponent())
            .addComponent(new Text("", "red")),
            new Vector2(15, 37))
    }
}

let startScene = new StartScene()
let mainScene = new MainScene("MainScene")
let endScene = new EndScene()

window.allScenes = [startScene, mainScene, endScene]
