import React from "react";
import { Link } from "react-router-dom";

export default function Booktile(props) {
    const name = props.name.length>35? props.name.slice(0,35)+"..." : props.name
    return(
        <Link to={'/book/'+props.id} className="booktile">
            <img className="booktile--img" src={props.image} alt={props.name}/>
            
            <div className="booktile--rate">
                <img className="booktile--rate--img" src={process.env.PUBLIC_URL+"/images/star.png"} alt="ye"/>
                <p>{props.rating}</p>
                <img className="booktile--rate--img" src={process.env.PUBLIC_URL+"/images/emptystar.png" } alt="mm"/>
            </div>

            <div className="booktile--name">
                <p><b>{name}</b> <br/>
                   <small>{props.author}</small> 
                </p>
            </div>    
        </Link>
    )
}