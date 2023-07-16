import React from "react";
import { Form,Link,redirect,useActionData } from "react-router-dom";
import { postItems } from "../utility";

const urlsp = new URLSearchParams(window.location.search)
const redirectTo = urlsp.get("redirectTo")? "?redirectTo="+urlsp.get("redirectTo") : ""

export async function action({request}) {
    const url = new URLSearchParams(window.location.search)
    const formData = await request.formData()

    const creds = Object.fromEntries(formData)
    // let req
    // for (const key in creds)  
    //     req = {...req,[key]:creds[key]===''?true:false}            
    // if (req) return {req:req,error:[]}

    const data = await postItems(creds,"http://127.0.0.1:8000/auth/signup/")

    if (data.message==="hello there") {
        console.log(data);
        localStorage.setItem("user",formData.get("name"))
        localStorage.setItem("id",data.userId)
        return redirect(url.get("redirectTo")? url.get("redirectTo"):'/profile')
    }
    console.log(data);
    // return {...data,req:req};
    return data;
}

export function Password({name}) {
    const [showPass,setShowPass] = React.useState(false)
    const eyeImage = showPass ? "eyeopen.png" :"eyeclose.png"
    
    return(
        <div className="password--container searchbar">
            <input 
                type={showPass? "text":"password"} 
                name={name} 
                id={name} 
                className="searchbar--input password--input"
                required
            />
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
export  function ErrorMsg(props) {
    return(
        <div className="error--message">
            <img src={process.env.PUBLIC_URL+"/images/caution.png"} alt="" width="10px"/>
            <small className="red">  {props.msg}</small>
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
            responseData?.error.map(err => <ErrorMsg key={err} msg={err} />)}

            <label htmlFor="name">Your Name</label>
            <input required type="text" name="name" id="name" placeholder={"First and Last Name"} />
            {}
            <br/><br/>

            <label htmlFor="email">Email</label>
            <input required type="text" name="email" id="email" placeholder="something@xyz.com"/>
            {}
            <br/><br/>

            <label htmlFor="password" >password</label>
            <Password name="password"/>
            {}
            <br/><br/>
            
            <label htmlFor="confirmPassword" >Confirm password</label>
            <Password name="confirmPassword"/>
            <br /><br />
            
            <button className="create--acc">Create Account</button>
        </Form>
        
    )
}