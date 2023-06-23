import React from "react";

export default function RatingRatio(props) {
    const starArray=[]
    for (let i = 1; i <= 5; i++) {
        starArray.push(<img 
            className="ratingratio--star" 
            key={i} 
            src={process.env.PUBLIC_URL+"images/emptystar.png"}
            alt=''
        />)    
    }

    const newWidth = (props.rating/5)*100+"%"
    console.log(newWidth);
    return(
        <div className="ratingratio" >
            {starArray}
        </div>
    )
}