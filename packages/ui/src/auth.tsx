"use client";

export default function AuthPage( {Signin} : {
    Signin: boolean
} ){
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    console.log("print")
    return(
        <div className="w-screen h-screen flex justify-center items-center" >
            <div className="bg-white rounded">
                <input type="text" placeholder="Email"></input>
                <input type="password" placeholder="Password"></input>
            </div>
            <button onClick={(e)=>{}} >{Signin ? "Sign in": "Sign up"}</button>
        </div>
    )
}