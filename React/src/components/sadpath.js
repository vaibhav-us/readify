import React from "react";
import { Link, useNavigate } from "react-router-dom";

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
            <Link className="error404--home" onClick={()=>navigate(-1)}>Go Back</Link>
        </div>
    )
}