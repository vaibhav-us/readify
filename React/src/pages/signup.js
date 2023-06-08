import React from "react";


export default function Signup (){
    return(
        <div className="login">
            <h1>Create Account</h1>
            <p>Your name</p>
            <input className="input--name" type="text" name="name" value={"First and Last Name"} />
            <p>username</p>
            <input type="text" name="username" />
            <p>password</p>
            <input type="text" name="password" />
            <br /><br /><br /><br />
            <button className="create--acc">Create Account</button>
        </div>
        
    )
}