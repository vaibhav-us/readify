import React from "react";
import { Form,redirect,useActionData } from "react-router-dom";
import { postItems } from "../utility";

export async function action({request}) {
    const url = new URLSearchParams(window.location.search)
    const formData = await request.formData()

    const creds = Object.fromEntries(formData)
    const data = await postItems(creds,"http://127.0.0.1:8000/auth/signup/")

    if (data.message==="hello there") {
        localStorage.setItem("user",formData.get("name"))
        return redirect(url.get("redirectTo")? url.get("redirectTo"):'/profile')
    }
    return data;
}

export function Password() {
    const [showPass,setShowPass] = React.useState(false)
    const eyeImage = showPass ? "eyeopen.png" :"eyeclose.png"
    
    return(
        <div className="password--container searchbar">
            <input type={showPass? "text":"password"} name="password" id="password" className="searchbar--input password--input"/>
            <img 
                src={process.env.PUBLIC_URL+"/images/"+eyeImage} 
                alt="eye"
                onClick={()=>setShowPass(prev => !prev)}
                width={"20px"}
                height={"20px"}
            />
        </div>
    )
}


export default function Signup (){
    const responseData= useActionData()
    console.log(responseData?.message,localStorage.getItem("user"));
    return(
        <Form className="login" method="post">
            <h1>Create Account</h1>
            <label htmlFor="name">Your Name</label>
            <input type="text" name="name" id="name" placeholder={"First and Last Name"} />
            <label htmlFor="email">email</label>
            <input type="text" name="email" id="email"/>
            <label htmlFor="password" >password</label>
            <Password />
            <br /><br /><br /><br />
            <button className="create--acc">Create Account</button>
        </Form>
        
    )
}