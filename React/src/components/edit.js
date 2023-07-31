import React from "react";
import { Link } from "react-router-dom";

export default function Edit(props) {
    return(
        <span className="edit--hover">
            <Link to={props.to+'?edit'} className="noLink edit">
                <img src={process.env.PUBLIC_URL+'/images/edit.png'} height={"25px"} />
            </Link>    
        </span>
        
    )
}