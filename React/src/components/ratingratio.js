import React from "react";


export default function RatingRatio({rating}) {
    const starArray=[]
    const roundedOffRating = Math.round(rating*4)/4
    const fractionalImage = {0.75:"/images/quarterstar.png",0.5:"/images/halfstar.png",0.25:"/images/thirdquarterstar.png"}
    
    for (let i = 1; i <= 5; i++) {
        if (i<=roundedOffRating) {
            starArray.push(<img 
                className="ratingratio--star" 
                key={i} 
                src={process.env.PUBLIC_URL+"/images/star.png"}
                alt=''
            />)  
        }
        else if (i-roundedOffRating<1) {
            starArray.push(<img 
                className="ratingratio--star" 
                key={i} 
                src={process.env.PUBLIC_URL+fractionalImage[i-roundedOffRating]}
                alt=''
            />) 
        }
        else {
            starArray.push(<img 
                className="ratingratio--star" 
                key={i} 
                src={process.env.PUBLIC_URL+"/images/emptystar.png"}
                alt=''
            />)
        }         
    }
    return(
        rating  &&
        <div className="ratingratio" >
            {starArray}
            <b>{rating}</b>
        </div>
    )
}