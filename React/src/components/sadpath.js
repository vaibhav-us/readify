import React from "react";
import { Link, useNavigate, useRouteError } from "react-router-dom";

export function Loading(props) {
    return(
        <div className="suchempty--container">
            <img src={process.env.PUBLIC_URL+"/images/loading.gif"} alt="LOADING..."/>
            <h3 className="gray">{props?.msg}</h3>
        </div>
    )
}

export function Error404() {
    const navigate = useNavigate()
    return(
        <div className="error404" >
            <img src={process.env.PUBLIC_URL+'/images/404.jpg'}/>
            <Link className="error404--home error404--pos" onClick={()=>navigate(-1)}>Go Back</Link>
        </div>
    )
}

export default function ErrorPage() {
    let error = useRouteError()
    error = new Error(error)
    const navigate = useNavigate()

    return(
        <div className="suchempty--container gray">
            <br/><br/><br/><br/><br/><br/>
            <img src={process.env.PUBLIC_URL+"/images/doge.png"} alt=''/>
            <big>Our server is down</big>
            <br/>
            <small>{error.message}</small>
            <div className="errorlinks--container">
                <Link className="error404--home error--links" onClick={()=>navigate(-1)}>Go Back</Link>
                <Link className="error404--home error--links" onClick={()=>navigate('/')}>Home</Link>    
            </div>           
        </div>
    )
}