import React from "react";
import RatingRatio from "./ratingratio";
import { Link } from "react-router-dom";
import { fullDate } from "../utility";
import {ReviewButton, StarBlink, WantToRead} from "./ratingcomponents";

export default function SearchTile(props) {
    return(
        <div className="searchtile">
            <div className="searchtile--firsthalf">
                <Link to={"/book/"+props.id} className="searchtile--imgcontainer">
                    <img className="searchtile--img" src={props.image} alt=''/>
                </Link>  
                <WantToRead bookId={props.id} className={"searchtile--want"} /> 
                <StarBlink bookId={props.id}/>
            </div>
            
            
            <div className="searchtile--content">
                <Link className="noLink searchtile--head" to={"/book/"+props.id}>
                    <b>{props.name} </b>
                </Link>
                <br/>
                <small><i className="gray">{props.author}</i></small>
                <div className="searchtile--rate">
                    <RatingRatio rating={props.rating}/> 
                </div>
                {props.publication &&<p className="gray">Published on {fullDate(props.publication)}</p>}

                {props.genre?.map(ele=><span className="review--point">{ele}</span>)}

                <ReviewButton state={props} className={"searchtile--review"} />
                <hr />
            </div>
            
        </div>
    )
}