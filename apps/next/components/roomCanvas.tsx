"use client";

import { WS_URL } from "@/config";
import { drawShape } from "@/draw";
import axios from "axios";
import { useEffect, useRef, useState } from "react"
import { Canvas } from "./canvas";

export function RoomCanvas ({ roomId }: {roomId: string}){

    const [socket, setSocket] = useState< WebSocket | null >(null);
    useEffect(()=>{
     const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4YmY4MjBmNS04NjAyLTRlOTctYTU2NS05YTNhMDUyMjQ0YTIiLCJpYXQiOjE3Mzg4NTMzOTd9.TTc4YAheeQbEZGjJ9kjd7mL6nImcHyT4_Zc4Zt_nh48`)   

     ws.onopen = ()=>{
        setSocket(ws)
        ws.send(JSON.stringify({
            type: "join_room",
            roomId
        }))
     }
    })

    if (!socket){
        return(
            <div>
                Loding...
            </div>
        )
    }

    return(
       <div>
        <Canvas roomId={roomId} socket={socket}></Canvas>
       </div>
    )   
}