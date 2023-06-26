import React from "react";
import RatingRatio from "./ratingratio";
import { Link } from "react-router-dom";
import { fullDate } from "../utility";

export default function SearchTile(props) {
    
    return(
        <div className="searchtile">
            <Link to={"/book/"+props.id}>
                <img className="searchtile--img" src={props.image} alt=''/>
            </Link>
            
            <div className="searchtile--content">
                <Link className="noLink searchtile--head" to={"/book/"+props.id}>
                    <b>{props.name} </b>
                </Link>
                <br/>
                <small><i className="gray">{props.author}</i></small>
                <div className="searchtile--rate">
                    <RatingRatio rating={props.rating}/> 

                    {props.date &&<small className="gray">Published on {fullDate(props.date)}</small>}

                </div>
                 {/* {props.genre.map(ele=><span className="review--point">{ele}</span>)} */}
                <button className="wanttoread searchtile--want">Want to Read</button>
                <hr />
            </div>
            
        </div>
    )
}