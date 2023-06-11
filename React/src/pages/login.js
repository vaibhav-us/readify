import React from "react";
import { Link,Form } from "react-router-dom";

export async function action({request}) {
    const formData = await request.formData()
    const creds = {
        email : formData.get("email"),
        password : formData.get("password")
    }
    const res = await fetch("/api/login", 
        {method : "post", body: JSON.stringify(creds)}
    )
    const data = await res.json()
    if (!res.ok) {
        throw {
            message : data.message,
            statusText : res.statusText,
            status : res.status
        }
    }
    return null;
}


export default function Login (){
    return(
        <Form className="login" method="post" >
            <h1>Login in</h1>
            <label htmlFor="email">email</label>
            <input type="text" name="email" />
            <label htmlFor="password">password</label>
            <input type="text" name="password" />
            <p>Forget your password?</p>
            <button className="sign--in" type="submit">Sign in</button>
            <br/><br />
            <hr className="login--hr"/>
            <span className="login--newto">New to BRR?</span>
            <Link to="/signup">
                <button className="sign--up">Sign up</button>
            </Link>
        </Form>      
    )
}