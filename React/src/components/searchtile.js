import React from "react";
import RatingRatio from "./ratingratio";
import { Link } from "react-router-dom";
import { fullDate, isLogged } from "../utility";
import {ReviewButton, StarBlink, WantToRead} from "./ratingcomponents";

export function MiniSearchTile(props) {
    const resultingName = props.name.length>=100 
        ?   props.name.slice(0,100)
        :   props.name 
    return(
        <div className="minisearchtile">
            <Link to={'/book/'+props.id} className="minisearchtile--1sthalf">
                <img src={props.image} alt='' className="searchtile--img"/>
            </Link>

            <div className="minisearchtile--2ndhalf">
                <Link to={'/book/'+props.id} className="noLink searchtile--head"><b>{resultingName}</b></Link>
                <br/>
                <small>{props.author}</small>
                <br/>
                <RatingRatio rating={props.rating} className="searchtile--rate"/>
                <br/>
                {props.genre?.map(ele => 
                    <Link 
                        key={ele} 
                        className="noLink review--point review--point--more"
                        to={"/search?genre="+ele.trim()}    
                    > {ele} </Link>
                )}
            </div>
        </div>
    )
}
export function MediumSearchTile(props){
    return(
        <div className="mediumsearchtile--container">
            <MiniSearchTile {...props}/>
            <div className="mediumsearchtile--rhs">
                <WantToRead bookId={props.id} logged={props.logged}/>
                <StarBlink bookId={props.id} logged={props.logged}/>
            </div>
        </div>
    )
}

export default function SearchTile(props) {
    return(
        <div className="searchtile">
            <div className="searchtile--firsthalf">
                <Link to={"/book/"+props.id} className="searchtile--imgcontainer">
                    <img className="searchtile--img" src={props.image} alt=''/>
                </Link>  
                <WantToRead bookId={props.id} className={"searchtile--want"} logged={props.logged} /> 
                <StarBlink bookId={props.id}/>
            </div>
            
            
            <div className="searchtile--content">
                <Link className="noLink searchtile--head" to={"/book/"+props.id}>
                    <b>{props.name} </b>
                </Link>
                <br/>
                <small><i className="gray">{props.author}</i></small>
                <RatingRatio className="searchtile--rate" rating={props.rating}/> 
        
                {props.publication &&<p className="gray">Published on {fullDate(props.publication)}</p>}

                {props.genre?.map(ele => 
                    <Link 
                        key={ele} 
                        className="noLink review--point review--point--more"
                        to={"/search?genre="+ele.trim()}    
                    > {ele} </Link>
                )}

                <ReviewButton bookId={props.id} className="searchtile--review" logged={props.logged}/>
                <hr />
            </div>
            
        </div>
    )
}