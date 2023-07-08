import React from "react";
import { Form,Link,redirect,useActionData } from "react-router-dom";
import { postItems } from "../utility";

const urlsp = new URLSearchParams(window.location.search)
const redirectTo = urlsp.get("redirectTo")? "?redirectTo="+urlsp.get("redirectTo") : ""

export async function action({request}) {
    const url = new URLSearchParams(window.location.search)
    const formData = await request.formData()

    const creds = Object.fromEntries(formData)
    let req
    for (const key in creds)  
        req = {...req,[key]:creds[key]===''?true:false}            
    if (req) return {req:req,error:[]}

    const data = await postItems(creds,"http://127.0.0.1:8000/auth/signup/")

    if (data.message==="hello there") {
        localStorage.setItem("user",formData.get("name"))
        return redirect(url.get("redirectTo")? url.get("redirectTo"):'/profile')
    }
    console.log(data);
    return {...data,req:req};
}

export function Password({name}) {
    const [showPass,setShowPass] = React.useState(false)
    const eyeImage = showPass ? "eyeopen.png" :"eyeclose.png"
    
    return(
        <div className="password--container searchbar">
            <input type={showPass? "text":"password"} name={name} id={name} className="searchbar--input password--input"/>
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
    console.log(responseData);
    return(
        <Form className="login" method="post">
            <h1>Create Account</h1>
            
            {responseData?.error[0]==='user already registered' ?
            <div className="error--message">
                <img src={process.env.PUBLIC_URL+"/images/caution.png"} alt="" width="10px"/>
                <span key={responseData.error[0]} className="red">  {responseData.error[0]}   </span>
                <Link to={'/login'+redirectTo} className="noLink error--message--Link">try logging in &gt;&gt;</Link>
            </div>
            :
            responseData?.error.map(err => {
                return(
                    <div className="error--message">
                        <img src={process.env.PUBLIC_URL+"/images/caution.png"} alt="" width="10px"/>
                        <span key={err} className="red">  {err}</span>
                    </div>
                )
            })}

            <label htmlFor="name">Your Name</label>
            <input type="text" name="name" id="name" placeholder={"First and Last Name"} />
            {responseData?.req.name && <small className="login--input--bottomlabel">This is a required field</small>
            }<br/><br/>

            <label htmlFor="email">Email</label>
            <input type="text" name="email" id="email" placeholder="something@xyz.com"/>
            {responseData?.req.email && <small className="login--input--bottomlabel">This is a required field</small>
            }<br/><br/>

            <label htmlFor="password" >password</label>
            <Password name="password"/>
            {responseData?.req.password && <small className="login--input--bottomlabel">This is a required field</small>
            }<br/><br/>
            
            <label htmlFor="confirmPassword" >Confirm password</label>
            <Password name="confirmPassword"/>
            <br /><br />
            
            <button className="create--acc">Create Account</button>
        </Form>
        
    )
}