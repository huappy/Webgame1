import "/engine/engine.js"
//LOOK AT CLASS NOTES (the written ones) FOR WORLD --> SCREEN--> GUI TRANSLATION FOR MAKING TEXTBOXES
//also look at camera class for the code for camera transitions
//---------------------------------Start Scene-------------------------------
class StartCameraComponent extends Component {
    start() {

    }
    update() {
        this.parent.transform.x += 0;
    }
}

class ActingScene extends Scene {
    constructor(){
        super("black")
    }    
    start() {
        this.line = 1

 
  
        let actor1 = new GameObject("Actor1")
        let squareMan = new Rectangle()
        squareMan.fillStyle = "red"
        actor1.addComponent(squareMan)
        actor1.transform.x =-50
        actor1.transform.y = -50
        actor1.transform.sx = 10
        actor1.transform.sy =10
        GameObject.instantiate(actor1)

        let actor2 = new GameObject("Actor2")
        squareMan = new Rectangle()
        squareMan.fillStyle = "blue"
        actor2.addComponent(squareMan)
        actor2.transform.x =50
        actor2.transform.y = -50
        actor2.transform.sx = 10
        actor2.transform.sy =10
        GameObject.instantiate(actor2)

        Camera.main.parent.addComponent(new StartCameraComponent());
        this.addGameObject(new GameObject("ControllerGameObject").addComponent(new ActorController()))
    
        }

        
        }
    


class ActorController extends Component{
    start(ctx) {
        this.line = 1
        this.frameTime = 0
        this.time = 0
        this.stop = false

        const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);

        // Add three color stops
        gradient.addColorStop(1, "black");
        gradient.addColorStop(0, "yellow")


    



        Camera.main.fillStyle = gradient
        
    }
    update() {
        this.frameTime++
        if(this.frameTime %30 == 0){
            // console.log("roll the dice")
            this.time++
            this.frameTime = 0
        }  
            //This next part could be optimized. Do it if you have time.   
            

                if(this.line == 1 && !this.time ==0){
                    //DONE
                    if(this.stop == false){

                        this.dialogue = new GameObject("DialogueGameObject").addComponent(new Text("One Actor", "red")), new Vector2(0, 0)
                        this.dialogue.transform.x = -93
                        GameObject.instantiate(this.dialogue)
                        this.str =  "One Actor"
                        this.stop = true
                        
                        
                }
                if(this.time %5 ==0 && !this.time ==0){
                    this.dialogue.destroy()
                    this.line++
                    this.time = 0
                    this.stop = false
    
            }
                    
        
            }
                else if(this.line == 2 && !this.time ==0){
                    //DONE

                    if(this.stop == false){
                        
                        this.dialogue = new GameObject("DialogueGameObject").addComponent(new Text("Two Actor", "blue")), new Vector2(150, 20)
                        this.dialogue.transform.x = 10
                        GameObject.instantiate(this.dialogue)
                        this.str =  "Two Actor"
                        this.stop = true
                        this.time = 0
                        GameObject.instantiate(this.dialogue)
            
                    }
                    if(this.time %5 ==0 && !this.time ==0){
                        this.dialogue.destroy()
                        this.line++
                        this.time = 0
                        this.stop = false
                }
                    
        
            }
                
        
                else if(this.line == 3 && !this.time ==0){
                    //DONE

                    if(this.stop == false){
                        this.dialogue = new GameObject("DialogueGameObject").addComponent(new Text("Red Actor", "red")), new Vector2(-150, 20)
                        this.dialogue.transform.x = -93
                        GameObject.instantiate(this.dialogue)
                        this.str =  "Red Actor"
                        this.stop = true
                        
                        GameObject.instantiate(this.dialogue)

            
                    }
                    if(this.time %5 ==0 && !this.time ==0){
                        this.dialogue.destroy()
                        this.line++
                        this.time = 0
                        this.stop = false
                }
            }
                    
        
            
                else if(this.line == 4 && !this.time ==0){
                    //DONE

                    if(this.stop == false){
                        
                        this.dialogue = new GameObject("DialogueGameObject").addComponent(new Text("Blue Actor", "blue")), new Vector2(150, 20)
                        this.dialogue.transform.x = 7
                        GameObject.instantiate(this.dialogue)
                        this.str =  "Blue Actor"
                        this.stop = true
                        
                        GameObject.instantiate(this.dialogue)

                }
                    
                if(this.time %5 ==0 && !this.time ==0){
                    this.dialogue.destroy()
                    this.line++
                    this.time = 0
                    this.stop = false
            }
         }
                else if(this.line == 5 && !this.time ==0){
                    //DONE

                    if(this.stop == false){

                        this.dialogue = new GameObject("DialogueGameObject").addComponent(new Text("...", "red")), new Vector2(-150, 20)
                        this.dialogue.transform.x = -57
                        GameObject.instantiate(this.dialogue)
                        this.str =  "One Actor"
                        this.stop = true
                        
                        GameObject.instantiate(this.dialogue)

                }
                    if(this.time %10 ==0 && !this.time ==0){
                        this.dialogue.destroy()
                        this.line++
                        this.time = 0
                        this.stop = false
            }
        
        }
                else if(this.line == 6 && !this.time ==0){
                    //DONE
                    if(this.stop == false){

                        this.dialogue = new GameObject("DialogueGameObject").addComponent(new Text("Line?!", "red")), new Vector2(-150, 20)
                        this.dialogue.transform.x = -72
                        GameObject.instantiate(this.dialogue)
                        this.str =  "One Actor"
                        this.stop = true
                        
                        GameObject.instantiate(this.dialogue)

                }
                    if(this.time %10 ==0 && !this.time ==0){
                        this.dialogue.destroy()
                        this.line++
                        this.time = 0
                        this.stop = false
                }                    
        
            }
            else if(this.line == 7 && !this.time ==0){
                //DONE
                if(this.stop == false){

                    this.dialogue = new GameObject("DialogueGameObject").addComponent(new Text("Let's just start over...", "blue")), new Vector2(150, 20)
                    this.dialogue.transform.x = -90
                    GameObject.instantiate(this.dialogue)
                    this.str =  "One Actor"
                    this.stop = true
                    
                    GameObject.instantiate(this.dialogue)

            }
                if(this.time %10 ==0 && !this.time ==0){
                    this.dialogue.destroy()
                    this.line = 1
                    this.time = 0
                    this.stop = false
            }                    
    
        }
    
        }
    
    } 




//-------------------------------------------------------------------------------------------
//Main



let scene = new ActingScene()


window.scene = [scene]
