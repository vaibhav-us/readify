import React from "react";
import { Form, Link, useActionData, useNavigate, useSearchParams } from "react-router-dom";
import { postItems } from "../utility";

export async function action({request}){
    const formData = await request.formData()
    const creds = Object.fromEntries(formData)

    const data = await postItems(
        creds,
        `http://127.0.0.1:8000/auth/${ formData.has("login") ? "signin" : "signup" }/`
    )
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
export function ErrorMsg(props) {
    const [img, color] = props.condition === 0
        ? ["caution", "red"]
        : props.condition
            ? ["greentick", "green"]
            : ["warning", "gray"]

    return (
        <div className="error--message">
            <img src={process.env.PUBLIC_URL + `/images/${img}.png`} alt="" width="10px" />
            <small className={color}>  {props.msg}</small>
        </div>
    )
}

export default function Authentication() {
    const [page,setPage] = React.useState("Login")
    const responseData= useActionData() || {error:'initial',password:[],email:[],common:[]}
    const searchParams = useSearchParams()[0]
    const navigate = useNavigate()

    const passwordConditions = ["password must contain atleast 8 characters","password should contain atleast one uppercase"]
    React.useEffect(()=>{
        if ( ! responseData.error ){
            localStorage.setItem("id",responseData.id)
            localStorage.setItem("user",responseData.name)
            navigate( searchParams.get("redirectTo")? searchParams.get("redirectTo"):'/profile'  ,{replace:true})
        }   
    },[responseData])

    return(
        <div className="login">
            <nav className="auth--navbar">

                {["Login","Signup"].map(ele =>{ return (
                    <h2 
                        className={"auth--switches" +( page===ele ? " auth--switches--clicked":"")}
                        onClick={()=>setPage(ele)}
                        key={ele}
                    > {ele} </h2>
                )})}
                
            </nav>

            {page==="Login"?

            <Form method="post" >
                <input name="login" hidden/>
                {searchParams.get("msg") && <h3 className="red">{searchParams.get("msg")}</h3>}

                {responseData.error &&  responseData.common &&
                 responseData.common.map(ele => <ErrorMsg msg={ele} condition={0}/>)
               }

                <label htmlFor="email">Email</label>
                <input type="text" name="email" />
                <br/><br/>

                <label htmlFor="password" >Password</label>
                <Password name="password"/>
                
                <p>Forget your password?</p>
                <button className="sign--in" type="submit">Sign in</button>
                <br/><br />

                <div className="line--dec">
                    <hr className="login--hr"/>
                    <span className="login--newto">New to BRR?</span>
                </div>
                
                <button 
                    type="button" 
                    className="sign--up"
                    onClick={()=>setPage("Signup")}
                >  Sign up  </button>
                
            </Form> 
            
            :

            <Form method="post">
                <input name="signup"  hidden/>

                {responseData.error && 
                responseData.common.map(ele => (
                    <div key={ele} style={{display:"flex"}}>
                        <ErrorMsg  msg={ele} condition={0}/>
                        <button 
                            className="nobutton tryLogin"
                            type="button" 
                            onClick={()=>setPage("Login")}
                        >Try logging in &gt;&gt;</button>
                        <br/>
                    </div>
                ) )}

                <label htmlFor="name">Your Name</label>
                <input required type="text" name="name" id="name" placeholder={"First and Last Name"} />
                <div/><br/>

                <label htmlFor="email">Email</label>
                <input required type="email" name="email" id="email" placeholder="something@xyz.com"/>
    
                {responseData.error && 
                 responseData.email.map(ele => <ErrorMsg key={ele} msg={ele} condition={0}/>) 
                }
                <div/><br/>

                <label htmlFor="password" >password</label>
                <Password name="password"/>
                
                {responseData.error === 1
                ?   responseData.password.map(ele => <ErrorMsg key={ele} msg={ele} condition={0}/>) 
                :   passwordConditions.map(ele=> <ErrorMsg key={ele} msg={ele}/>)
                } 
                
                <div/><br/>
                
                <label htmlFor="confirmPassword" >Confirm password</label>
                <Password name="confirmPassword"/>
                <br /><br />
                
                <button className="create--acc">Create Account</button>
            </Form>}
        </div>
        
    )
}
