import React from "react";
import { Link } from "react-router-dom";
import { WantToRead } from "./ratingcomponents";

export default function Booktile(props) {
    const name = props.name.length>35? props.name.slice(0,35)+"..." : props.name
    return(
        <div className="booktile">
            <Link to={'/book/'+props.id} >
                <img className="booktile--img" src={props.image} alt={props.name}/>
            </Link>

            <div className="booktile--rate">
                <img className="booktile--rate--img" src={process.env.PUBLIC_URL+"/images/star.png"} alt="ye"/>
                <p>{props.rating}</p>

                <Link to={`/book/${props.id}/review`} className="booktile--ratelink">
                    <img className="booktile--rate--img" src={process.env.PUBLIC_URL+"/images/emptystar.png" } alt="mm"/>
                </Link>
            </div>

            <WantToRead className="booktile--wanttoread"/>

            <div className="booktile--name">
                <Link 
                    to={'/book/'+props.id} 
                    className="noLink searchtile--head"
                >  <b>{name}</b>
                </Link>  <br/>
                <small>{props.author}</small> 
            </div>    

        </div>
    )
}