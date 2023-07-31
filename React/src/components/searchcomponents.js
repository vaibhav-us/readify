import React from "react";
import { Form } from "react-router-dom";
import RatingRatio from "./ratingratio";

export function CropImage(props) {
    return(
        <div
            className={"profile--img"+(props.className?` ${props.className}`:"")} 
            style={props.style? props.style:{}}
        >
            <img  src={process.env.PUBLIC_URL+props.src} alt=""/>
        </div>
    )
}

export function SearchBar(props) {
    return(
        <Form 
            method="post" 
            onSubmit={props.onSubmit}
            className={"searchbar"+(props.className?` ${props.className}`:"")} 
            style={props.style?props.style:{}}
        >
            <input 
                className={"searchbar--input"}
                placeholder={props.placeholder} 
                name={ props.name }
                onChange={props.onChange}
                autoComplete="off"
            />
            <button className="nobutton">
                <img src={process.env.PUBLIC_URL+"/images/search.png"} alt="" height={"15px"}/>
            </button>
        </Form>
    )
}

// const SortButton = props => {
//     return(
//         <div className="sort--button">
//             {props.ele} 
//             <button
//                 onClick={() => props.onClick(props.ele,"asc")} 
//                 className="sort--arrow nobutton"
//                 style={props.stateVar.sortValue===props.ele && props.stateVar.direction==="asc" ? {fontSize:"25px"} : {}}
//             >  &uarr;  </button> 
//             <button 
//                 onClick={() => props.onClick(props.ele,"desc")}
//                 className="sort--arrow nobutton"
//                 style={props.stateVar.sortValue===props.ele && props.stateVar.direction==="desc" ? {fontSize:"25px"} : {}}
//             >  &darr;  </button>
//         </div> 
//     )
// }
export function Sort(props) {
    const sortElements = ["Rating","Release Date", "Alphabetical"]
    return(
        <div 
            className={"sort--container"+(props.className?` ${props.className}`:"")}
            style={props.style? props.style : {}} 
        >
            <div className="sort--tag"> Sort By </div>

            {sortElements.map(ele => {
                 return(
                    <div key={ele} className="sort--button">
                        {ele} 
                        <button
                            onClick={() => props.onClick(ele,"asc")} 
                            className="sort--arrow nobutton"
                            style={props.stateVar.sortValue===ele && props.stateVar.direction==="asc" ? {fontSize:"25px"} : {}}
                        >  &uarr;  </button> 
                        <button 
                            onClick={() => props.onClick(ele,"desc")}
                            className="sort--arrow nobutton"
                            style={props.stateVar.sortValue===ele && props.stateVar.direction==="desc" ? {fontSize:"25px"} : {}}
                        >  &darr;  </button>
                    </div> 
                )
            })}
        </div>
    )
}

export function Filter(props) {
    const [display,setDisplay] = React.useState(false)
    return(
        <div className="filter--container">
            <button 
                className={"filter--button"+(props.className?` ${props.className}`:"")}
                style={props.style? props.style : {}}
                onClick={()=>setDisplay(true)} 
            >
                <img src={process.env.PUBLIC_URL+"/images/filter.png"} alt="" height= {"100%"}/>
            </button>


            <div className="filter--section" style={{display:display?"":"none"}}>
            <button onClick={(()=>setDisplay(false))} className="filter--close nobutton">X</button>

            <fieldset className="filter--section--rating">
                <legend>Rating</legend>
                {[1,2,3,4,5].map(ele => {
                    return(
                        <div key={ele}>
                            <input 
                                type="checkbox" 
                                onChange={(e)=>props.onChange(e,ele,1)} 
                                id={ele} 
                                checked={props.stateVar[ele]}
                                name="rating" 
                            />
                            <label htmlFor={ele} >
                                <RatingRatio rating={ele} style={{width:"20px",height:"20px",marginBottom:"0"}}/>
                            </label>
                        </div>
                    )
                })}
            </fieldset>
    
            <fieldset className="filter--section--publication">
                <legend>Publication</legend>
                {["After",'Before'].map(ele => {
                    return(
                        <div key={ele}>
                            <label htmlFor={ele} >{ele==="After"? `${ele}   ` : ele}   </label>
                                <input 
                                    type="date" 
                                    onChange={(e)=>props.onChange(e,ele)} id={ele}  
                                    name="publication" 
                                />
                            </div>
                        )
                    })}
            </fieldset>

            <div className="filter--button--container">
                <button className="sort--tag" type="button">Clear Filter</button>
            </div>
        </div>   
        </div>
    )
}

