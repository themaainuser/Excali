import axios from "axios"
import { HTTP_BACKEND } from "../config";
import { useState } from "react";
type Shapes = {
    type: "rect";
    X: number;
    Y: number;
    width: number;
    height: number;
}|{
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
}

export async function drawShape(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket){

    // const[chats, setChats]= useState(messages);
    
    const ctx = canvas.getContext("2d");

    let existingShapes: Shapes[] = await getExistingShapes(roomId)
    console.log(ctx)
    if (!ctx){
        return;
    }

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "chat" ){
            const parsedShape = JSON.parse(message.message);
            existingShapes.push(parsedShape)
            clearCanvas(existingShapes, ctx, canvas)
        }
    }

    ctx.fillStyle = "rgba(0,0,0)"
    ctx.fillRect(0,0,canvas.width, canvas.height)


    clearCanvas(existingShapes, ctx, canvas)
    let clicked = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener("mousedown",(e)=>{
        clicked = true
        startX = e.clientX
        startY = e.clientY
    })    
    canvas.addEventListener("mouseup",(e)=>{
        clicked = false
        const width = e.clientX - startX
        const height = e.clientY - startY
        const shape:Shapes ={
            type:"rect",
            X:startX,
            Y:startY,
            width,
            height
        }
        existingShapes.push(shape)

        socket.send(JSON.stringify({
            type:"chat",
            message: JSON.stringify({
                shape
            })
        }))
        
        
    })
    canvas.addEventListener("mousemove", (e)=>{
        if(clicked){
            const width = e.clientX - startX
            const height = e.clientY - startY
            clearCanvas(existingShapes,ctx, canvas) // If Not called builed a nice effect
            ctx.strokeStyle = "rgba(255, 255, 255)"
            ctx.strokeRect(startX, startY, width, height)   
        }
    })

}

function clearCanvas(existingShapes: Shapes[], ctx: CanvasRenderingContext2D, canvas:HTMLCanvasElement){
        ctx.clearRect(0,0,canvas.width, canvas.height)
        ctx.fillStyle = "rgba(0,0,0)"
        ctx.fillRect(0,0,canvas.width, canvas.height)

        existingShapes.map((shape)=>{
           if (shape.type == "rect"){
            ctx.strokeStyle = "rgba(255, 255, 255)"
            ctx.strokeRect(shape.X, shape.Y, shape.width, shape.height) 
           }  
        })
}

async function getExistingShapes(roomId: string){
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const message = res.data.messages;

    const shapes = message.map((x:{ message:string }) => {
        const messageData = JSON.parse(x.message);
        return messageData;
    })
    return shapes
}