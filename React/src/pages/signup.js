import React from "react";
import { Form } from "react-router-dom";

export async function action({request}) {
    const formData = await request.formData()
    const creds = {
        email : formData.get("email"),
        password : formData.get("password"),
        name : formData.get("name")
    }
    const res = await fetch("http:/localhost:5000/api/signup", 
        {method : "POST", body: JSON.stringify(creds)}
    )
    return null;
}


export default function Signup (){
    return(
        <Form className="login" method="post">
            <h1>Create Account</h1>
            <label htmlFor="name">Your Name</label>
            <input type="text" name="name" id="name" placeholder={"First and Last Name"} />
            <label htmlFor="email">email</label>
            <input type="text" name="email" id="email"/>
            <label htmlFor="password">password</label>
            <input type="text" name="password" id="password"/>
            <br /><br /><br /><br />
            <button className="create--acc">Create Account</button>
        </Form>
        
    )
}