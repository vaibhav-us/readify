import React from "react";
import { Link,Form, redirect, useActionData } from "react-router-dom";
import { postItems } from "../utility";
import { Password } from "./signup";

const urlsp = new URLSearchParams(window.location.search)
const redirectTo = urlsp.get("redirectTo")? "?redirectTo="+urlsp.get("redirectTo") : ""

export async function action({request}) {
    const formData = await request.formData()

    const creds = Object.fromEntries(formData)
    const data = await postItems(creds,"http://127.0.0.1:8000/auth/signin/")

    if (data.message!=="error"){
        localStorage.setItem("user",data.message)
        return redirect(urlsp.get("redirectTo")? urlsp.get("redirectTo"):'/profile')
    }
    
    return data;
}


export default function Login (){
    const responseData = useActionData()

    return(
        <Form className="login" method="post" >
            <h1>Login in</h1>
            {responseData?.message==="error" && 
            <p className="red">Credentials Doesn't Match !!</p>}

            <label htmlFor="email">email</label>
            <input type="text" name="email" />
            <label htmlFor="password" >password</label>
            <Password/>
            <p>Forget your password?</p>
            <button className="sign--in" type="submit">Sign in</button>
            <br/><br />


            <div className="line--dec">
                <hr className="login--hr"/>
                <span className="login--newto">New to BRR?</span>
            </div>
            <Link to={"/signup"+redirectTo}>
                <button className="sign--up">Sign up</button>
            </Link>
        </Form>      
    )
}