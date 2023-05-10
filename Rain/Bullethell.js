import "/engine/engine.js"
class StartScene extends Scene{
    update(){
        if (keysDown["f"]){
            SceneManager.changeScene(1)
        }
    }
    draw(ctx){
        ctx.fillStyle = "violet"
        ctx.fillRect(0,0, canvas.width, canvas.height)
        ctx.fillStyle = "black"
        ctx.fillText("WELCOME... TO HELL", canvas.width/2, canvas.height/2)
    }
}

class MainScene extends Scene{
    start(){
        this.up = true
        this.playerX = canvas.width/2
        this.playerY = canvas.height/2
        this.playerVX = 0
        this.playerVY = 7.5
        this.enemyX = 234
        this.enemyY = 563
        this.enemyVX = 15
        this.enemyVY = 15
        this.enemyX2 = 20
        this.enemyY2 = 20
        this.enemyVX2 = 15
        this.enemyVY2 = 15
        this.time=0
        this.good = (this.playerX, this.playerY)
        this.collision = (this.enemyX, this.enemyY)

    }
    update(){
        this.enemyX += this.enemyVX
        this.enemyY += this.enemyVY
        this.enemyX2 += this.enemyVX2
        this.enemyY2 += this.enemyVY2
        this.good = (this.playerX, this.playerY)
        this.collision = (this.enemyX, this.enemyY)
        this.time +=1

        if (this.playerY >= canvas.height-60) {
            
        }
        else if (this.playerY <= canvas.height-60 &! keysDown["ArrowUp"]){
            this.playerY += this.playerVY
            this.playerVY = 7.5
        }

        if (keysDown["ArrowLeft"]) {
            this.playerX -= 5
        }
        else if (keysDown["ArrowRight"]) {
            this.playerX += 5
        }
        if (keysDown["ArrowUp"]) {
            this.playerY -= this.playerVY

        }
        if (keysDown["ArrowDown"]){
            this.playerY += this.playerVY*.5
        }


        if (this.enemyX < 10) {
            this.enemyVX *= -1
        }
        if (this.enemyX > canvas.width){
            this.enemyVX *= -1}

        if (this.enemyY < 10) {
            this.enemyVY *= -1
        }
        if (this.enemyY > canvas.height-60)
            this.enemyVY *=-1
        
        if (this.enemyX2 < 10) {
            this.enemyVX2 *= -1
        }
        if (this.enemyX2 > canvas.width){
            this.enemyVX2 *= -1}

        if (this.enemyY2 < 10) {
            this.enemyVY2 *= -1
        }
        if (this.enemyY2 > canvas.height-60){
            this.enemyVY2 *=-1
        }

//ASK ABOUT COLLISION DETECTION <========> equation for circle (x-this.enemyX)^2 + (y-this.enemyY)^2 = 5^2
        if (this.good == this.collision){
            console.log("game over")
            this.score = this.time
            scene = 2
        } 
    }
    draw(ctx){
        ctx.fillStyle = "green"
        ctx.fillRect(0,0,canvas.width, canvas.height)

        ctx .fillStyle = "black"
        ctx.fillRect(0, canvas.height-50, canvas.width, canvas.height)

        ctx.fillStyle = "red"
        ctx.beginPath()
        ctx.arc(this.playerX, this.playerY, 5, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "blue"
        ctx.beginPath()
        ctx.arc(this.enemyX, this.enemyY, 5, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "blue"
        ctx.beginPath()
        ctx.arc(this.enemyX2, this.enemyY2, 5, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "white"
        ctx.fillText("Score: "+ this.time, canvas.width/2, canvas.height-40)
    }
}

class EndScene extends Scene {
    update(){
        if (keysDown["f"]){
            SceneManager.changeScene(0)
        }
    }
    draw(ctx){
        ctx.fillStyle = "blue"
        ctx.fillRect(0,0,canvas.width, canvas.height)
        ctx.fillStyle = "white"
        ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2)
        ctx.fillText("Final Score:" + score, (canvas.width/2), (canvas.height/2)+50)
    }

}

let startScene = new StartScene()
let mainScene = new MainScene()
let endScene = new EndScene()

SceneManager.addScene(startScene)
SceneManager.addScene(mainScene)
SceneManager.addScene(endScene)

