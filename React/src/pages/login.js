import React from "react";
import { Link } from "react-router-dom";

export default function Login (){
    return(
        <div className="login">
            <h1>Login in</h1>
            <p>username</p>
            <input type="text" name="username" />
            <p>password</p>
            <input type="text" name="password" />
            <p>Forget your password?</p>
            <button className="sign--in">Sign in</button>
            <br/><br />
            <hr className="login--hr"/>
            <span className="login--newto">New to BRR?</span>
            <Link to="/signup">
                <button className="sign--up">Sign up</button>
            </Link>
            
        </div>
        
    )
}