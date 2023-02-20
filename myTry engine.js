class SceneManager{
    static scenes = []
    static currentSceneIndex = 0
    static changedSceneFlag = true
    static addScene(scene){
        SceneManager.scenes.push(scene)
    }
    static getActiveScene(){
        return SceneManager.scenes[SceneManager.currentSceneIndex];
    }
    static changeScene(index){
        SceneManager.currentSceneIndex = index
        SceneManager.changedSceneFlag = true
    }
}

class Scene{

}

let canvas = document.querySelector("#canv")
let ctx = canvas.getContext("2d");

//Not the strings has to be all lowercase, e.g. keydown not keyDown or KeyDown
let keysDown = []
let mouseX;
let mouseY

document.addEventListener("keydown", keyDown)
document.addEventListener("keyup", keyUp)

document.addEventListener("mousedown", mouseDown);
document.addEventListener("mouseup", mouseUp);
document.addEventListener("mousemove", mouseMove);

//0 is start scene, 1 main scene, 2 is dead scene
let scene = 0;

let pause = false

function mouseDown(e) {
    //console.log("mouseDown: " + e.clientX + " " + e.clientY)
}
function mouseUp(e) {
    //console.log("mouseUp: " + e.clientX + " " + e.clientY)
}
function mouseMove(e) {
    //console.log("mouseMove: " + e.clientX + " " + e.clientY)
}


function keyUp(e) {
    keysDown[e.key] = false
    //console.log(e)
    if (e.key == "ArrowLeft") {
        console.log("Up Left")
    }
    if (e.key == "ArrowRight") {
        console.log("Up Right")
    }
    if (e.key == "ArrowDown") {
        console.log("Up Down")
    }
    if (e.key == "ArrowUp") {
        console.log("Up Up")
    }
    if (e.key == "p") {
        pause = !pause
    }

}

function keyDown(e) {
    keysDown[e.key] = true
    //console.log(e)
    if (e.key == "ArrowLeft") {
        console.log("Down Left")
    }
    if (e.key == "ArrowRight") {
        console.log("Down Right")
    }
    if (e.key == "ArrowDown") {
        console.log("Down Down")
    }
    if (e.key == "ArrowUp") {
        console.log("Down Up")
    }
    //To prevent scrolling (if needed)
    //This has to be in keyDown, not keyup
    if (e.key == " ") {
        e.preventDefault()
    }
}


function engineUpdate() {
    if (pause) return
    if (SceneManager.changedSceneFlag && SceneManager.getActiveScene().start){
        SceneManager.getActiveScene().start()
        SceneManager.changeSceneFlag = false  
    }
    SceneManager.getActiveScene().update()
}

function engineDraw() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    SceneManager.getActiveScene().draw(ctx)
}

function start(title){
    document.title = title
    function gameLoop() {
        engineUpdate()

        engineDraw()

    }

    setInterval(gameLoop, 1000 / 25)

}
